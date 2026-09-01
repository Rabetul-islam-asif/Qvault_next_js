import { NextRequest, NextResponse } from 'next/server'
import { getDriveClient } from '@/lib/drive'
import { Readable } from 'stream'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1hxj53429c4GEJWOnbT02ucGWNbwz5a4E'
    const drive = getDriveClient()

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const stream = Readable.from(buffer)

    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId]
      },
      media: {
        mimeType: file.type || 'application/pdf',
        body: stream
      },
      fields: 'id, name, webViewLink, webContentLink'
    })

    const fileId = response.data.id
    if (!fileId) {
      throw new Error('Failed to retrieve file ID from Google Drive')
    }

    // Set public view permission so anyone with the link can view
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      })
    } catch (permError) {
      console.warn('Permission assignment warning (inherited permissions may apply):', permError)
    }

    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

    return NextResponse.json({
      success: true,
      fileId,
      fileUrl: viewUrl,
      viewUrl,
      downloadUrl
    })
  } catch (error: any) {
    console.error('Google Drive upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file to Google Drive' },
      { status: 500 }
    )
  }
}
