/**
 * Cloudflare Worker — Catbox CORS Proxy for QVault
 * 
 * Deploy this as a Cloudflare Worker (free tier).
 * It accepts file uploads from your browser and forwards them to Catbox,
 * returning the file URL with proper CORS headers.
 * 
 * Deployment steps:
 *   1. Go to https://dash.cloudflare.com → sign up (free)
 *   2. Workers & Pages → Create → Create Worker
 *   3. Name it "catbox-proxy" (or anything you like)
 *   4. Paste this entire file into the code editor
 *   5. Click "Deploy"
 *   6. Copy your worker URL (e.g. https://catbox-proxy.YOUR_SUBDOMAIN.workers.dev)
 *   7. Set that URL as CATBOX_WORKER_URL in app/page.js
 */

// Allowed origins — set your actual domains here for security.
// Use '*' during development, but restrict in production.
const ALLOWED_ORIGINS = '*';

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders(request),
            });
        }

        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', {
                status: 405,
                headers: corsHeaders(request),
            });
        }

        try {
            const incomingForm = await request.formData();
            const file = incomingForm.get('file') || incomingForm.get('fileToUpload');

            if (!file) {
                return jsonResponse({ error: 'No file provided' }, 400, request);
            }

            // Build the FormData exactly as Catbox expects
            const catboxForm = new FormData();
            catboxForm.append('reqtype', 'fileupload');
            catboxForm.append('fileToUpload', file, file.name || 'upload.pdf');

            // Forward to Catbox with browser-like headers
            // (Catbox is behind Cloudflare — without User-Agent it returns 520)
            const catboxRes = await fetch('https://catbox.moe/user/api.php', {
                method: 'POST',
                body: catboxForm,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                    'Accept': '*/*',
                    'Origin': 'https://catbox.moe',
                    'Referer': 'https://catbox.moe/',
                },
            });

            const responseText = await catboxRes.text();

            if (!catboxRes.ok) {
                return jsonResponse(
                    { error: `Catbox error ${catboxRes.status}: ${responseText.substring(0, 200)}` },
                    502,
                    request
                );
            }

            const url = responseText.trim();

            if (!url.startsWith('http')) {
                return jsonResponse(
                    { error: 'Catbox returned invalid response: ' + url.substring(0, 200) },
                    502,
                    request
                );
            }

            return jsonResponse({ url }, 200, request);
        } catch (err) {
            return jsonResponse(
                { error: err.message || 'Upload failed' },
                500,
                request
            );
        }
    },
};

function corsHeaders(request) {
    return {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    };
}

function jsonResponse(body, status, request) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(request),
        },
    });
}
