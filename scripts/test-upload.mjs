import { google } from 'googleapis';
import { Readable } from 'stream';
import fs from 'fs';

const creds = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));
const folderId = '1Kh-KayiATrn-FZzXr8QESzQfh8-Q8nVo';

const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

async function run() {
  console.log('Testing upload to folder:', folderId);
  const dummyContent = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF';
  const buffer = Buffer.from(dummyContent);

  const res = await drive.files.create({
    requestBody: {
      name: 'QVault_Test_Verification_Paper.pdf',
      parents: [folderId]
    },
    media: {
      mimeType: 'application/pdf',
      body: Readable.from(buffer)
    },
    supportsAllDrives: true,
    fields: 'id, name, webViewLink, webContentLink'
  });

  const fileId = res.data.id;
  console.log('🎉 SUCCESS! Uploaded file ID:', fileId);
  console.log('File Name:', res.data.name);
  console.log('View Link:', `https://drive.google.com/file/d/${fileId}/view`);

  // Set public view permission
  await drive.permissions.create({
    fileId: fileId,
    supportsAllDrives: true,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  });
  console.log('✅ Public permission set successfully!');
}

run().catch(console.error);
