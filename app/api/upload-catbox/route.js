import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = file.name || 'upload.pdf';

        // Manually construct multipart/form-data body
        // This avoids Node.js FormData serialization issues with Catbox
        const boundary = '----CatboxBoundary' + Date.now().toString(16);

        const parts = [];

        // reqtype field
        parts.push(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="reqtype"\r\n\r\n` +
            `fileupload\r\n`
        );

        // fileToUpload field header
        parts.push(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="fileToUpload"; filename="${fileName}"\r\n` +
            `Content-Type: application/octet-stream\r\n\r\n`
        );

        // Closing boundary
        const closingBoundary = `\r\n--${boundary}--\r\n`;

        // Combine into a single Buffer
        const headerBuffers = parts.map(p => Buffer.from(p, 'utf-8'));
        const closingBuffer = Buffer.from(closingBoundary, 'utf-8');

        const body = Buffer.concat([
            ...headerBuffers.slice(0, 1),   // reqtype part
            headerBuffers[1],                // file header
            buffer,                          // file data
            closingBuffer                    // closing boundary
        ]);

        console.log(`Uploading ${fileName} (${buffer.length} bytes) to Catbox...`);

        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QVault/1.0',
            },
            body: body,
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.error('Catbox error:', response.status, responseText);
            throw new Error(`Catbox API error ${response.status}: ${responseText}`);
        }

        const trimmedUrl = responseText.trim();

        if (!trimmedUrl.startsWith('http')) {
            throw new Error('Catbox returned invalid URL: ' + trimmedUrl);
        }

        console.log(`Catbox upload successful: ${trimmedUrl}`);
        return NextResponse.json({ url: trimmedUrl });
    } catch (error) {
        console.error('Catbox Proxy Error:', error);
        return NextResponse.json({ error: error.message || 'Catbox upload failed' }, { status: 500 });
    }
}
