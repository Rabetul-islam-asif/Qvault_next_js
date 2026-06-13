import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Prepare multi-part form data to upload to Catbox API
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: file.type });
        
        const catboxFormData = new FormData();
        catboxFormData.append('reqtype', 'fileupload');
        catboxFormData.append('fileToUpload', blob, file.name || 'upload.pdf');

        console.log(`Forwarding file ${file.name} to Catbox API...`);
        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: catboxFormData,
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Catbox API responded with error status ${response.status}: ${errText}`);
        }

        const fileUrl = await response.text();
        const trimmedUrl = fileUrl.trim();
        
        console.log(`Catbox upload successful. File URL: ${trimmedUrl}`);
        return NextResponse.json({ url: trimmedUrl });
    } catch (error) {
        console.error('Catbox Proxy API Error:', error);
        return NextResponse.json({ error: error.message || 'Catbox upload failed' }, { status: 500 });
    }
}
