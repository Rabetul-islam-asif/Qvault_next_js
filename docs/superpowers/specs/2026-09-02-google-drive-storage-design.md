# Google Drive Storage Integration Design Specification

## Overview
Migrate QVault's question paper and media upload system from third-party temporary hosting (Catbox/ImgBB) to a dedicated, centralized Google Drive folder owned by the administrator.

## Motivation & Goals
- Store all uploaded PDFs and images persistently in a central Google Drive folder (\1hxj53429c4GEJWOnbT02ucGWNbwz5a4E\).
- Ensure uploads work seamlessly on Vercel deployment without hitting serverless 4.5MB request body size limits.
- Provide users with reliable previewing (Google Drive interactive PDF viewer) and direct download capabilities.
- Keep Google Service Account credentials secure on the server side.

## Architecture

\\\
[Client / UploadModal]
        │
        ▼ (POST /api/upload with FormData)
[Next.js App Router API Route / Serverless]
        │
        ├─ Authenticates with Google Drive API v3 (JWT Auth)
        ├─ Streams file directly into Target Folder (1hxj53429c4GEJWOnbT02ucGWNbwz5a4E)
        ├─ Sets permission: role=reader, type=anyone
        ▼
[Google Drive API] ──> Returns webViewLink & fileId
        │
        ▼
[Supabase pending_papers Table] ──> Stores fileUrl as Google Drive URL
\\\

## Configuration & Environment Variables
- \GOOGLE_SERVICE_ACCOUNT_EMAIL\: Service account email (\qvault-uploader@qvault-storage.iam.gserviceaccount.com\)
- \GOOGLE_PRIVATE_KEY\: RSA private key from the downloaded Google Cloud JSON key file.
- \GOOGLE_DRIVE_FOLDER_ID\: Target Google Drive folder ID (\1hxj53429c4GEJWOnbT02ucGWNbwz5a4E\).

## Key Components

### 1. API Layer (\src/app/api/upload/route.ts\)
- Uses \googleapis\ (\google.drive('v3')\).
- Single-request upload for files under 4.5MB.
- Chunked/resumable upload handling for files exceeding 4.5MB.
- Permissions automation: sets \eader\ permission for \nyone\.
- Returns \{ success: true, fileId, viewUrl, downloadUrl }\.

### 2. Client API Helper (\src/lib/api.ts\)
- Implements \uploadToGoogleDrive(file: File, onProgress?: (percent: number) => void)\.
- Replaces legacy \uploadToCatbox\.

### 3. UI Layer (\src/components/UploadModal.tsx\)
- Integrates \uploadToGoogleDrive\.
- Real-time upload progress indicator during submission.
- Saves Google Drive URL in Supabase \pending_papers\ table.

## Verification & Testing Plan
1. **API Upload Test**: Upload test PDF via API route and verify arrival in Google Drive folder \1hxj53429c4GEJWOnbT02ucGWNbwz5a4E\.
2. **Permission Check**: Verify generated link is viewable in incognito/logged-out window.
3. **End-to-End Test**: Submit paper via UI, verify Supabase record, and test View/Download links in Vault and Admin Dashboard.
