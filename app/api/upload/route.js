import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name || `upload_${Date.now()}.pdf`;
    const mimeType = file.type || 'application/pdf';
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1Kh-KayiATrn-FZzXr8QESzQfh8-Q8nVo';
    const webhookUrl = process.env.GOOGLE_DRIVE_WEBHOOK_URL;

    // Approach A: Google Apps Script Web App (Uploads directly using personal Google Drive quota)
    if (webhookUrl) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          mimeType,
          folderId,
          base64
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Google Apps Script Drive upload failed');
      }

      return NextResponse.json({
        success: true,
        fileId: data.fileId,
        fileUrl: data.viewUrl,
        viewUrl: data.viewUrl,
        downloadUrl: data.downloadUrl
      });
    }

    // Approach B: Service Account JWT
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!rawKey) {
      return NextResponse.json(
        { error: 'Neither GOOGLE_DRIVE_WEBHOOK_URL nor GOOGLE_PRIVATE_KEY is configured' },
        { status: 500 }
      );
    }

    const privateKey = rawKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    const drive = google.drive({ version: 'v3', auth });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = Readable.from(buffer);

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId]
      },
      media: {
        mimeType: mimeType,
        body: stream
      },
      fields: 'id, name, webViewLink, webContentLink',
      supportsAllDrives: true
    });

    const fileId = response.data.id;
    if (!fileId) {
      throw new Error('Failed to retrieve file ID from Google Drive response');
    }

    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        },
        supportsAllDrives: true
      });
    } catch (permError) {
      console.warn('Drive permission warning:', permError.message);
    }

    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    return NextResponse.json({
      success: true,
      fileId,
      fileUrl: viewUrl,
      viewUrl,
      downloadUrl
    });
  } catch (error) {
    console.error('Google Drive Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during upload' },
      { status: 500 }
    )
  }
}
