import { NextResponse } from 'next/server';

// Use Edge runtime - it uses Web API FormData (like a browser)
// and runs on CDN edge nodes, not datacenter IPs that Catbox blocks
export const runtime = 'edge';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        console.log(`Uploading ${file.name} (${file.size} bytes) to Catbox via Edge...`);

        // Build FormData exactly as Catbox expects
        const catboxForm = new FormData();
        catboxForm.append('reqtype', 'fileupload');
        catboxForm.append('fileToUpload', file, file.name || 'upload.pdf');

        // Upload directly to Catbox - Edge runtime handles FormData natively
        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: catboxForm,
        });

        const responseText = await response.text();
        console.log('Catbox response:', response.status, responseText.substring(0, 200));

        if (!response.ok) {
            console.error('Catbox error:', response.status, responseText);
            return NextResponse.json(
                { error: `Catbox API error ${response.status}: ${responseText.substring(0, 100)}` },
                { status: 502 }
            );
        }

        const trimmedUrl = responseText.trim();

        if (!trimmedUrl.startsWith('http')) {
            return NextResponse.json(
                { error: 'Catbox returned invalid response: ' + trimmedUrl.substring(0, 100) },
                { status: 502 }
            );
        }

        console.log('Catbox upload successful:', trimmedUrl);
        return NextResponse.json({ url: trimmedUrl });
    } catch (error) {
        console.error('Catbox Proxy Error:', error);
        return NextResponse.json(
            { error: error.message || 'Catbox upload failed' },
            { status: 500 }
        );
    }
}
