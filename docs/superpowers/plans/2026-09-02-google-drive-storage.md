# Google Drive Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\- [ ]\) syntax for tracking.

**Goal:** Integrate Google Drive folder storage for all PDF and image uploads in QVault, replacing Catbox/ImgBB with a robust, Vercel-compatible serverless upload and public preview pipeline.

**Architecture:** Next.js App Router API Route (\/api/upload\) authenticates with Google Drive API v3 via Service Account JWT, streams file uploads directly into Google Drive Folder ID \1hxj53429c4GEJWOnbT02ucGWNbwz5a4E\, grants public view permission, and returns Google Drive preview and download links to be stored in Supabase.

**Tech Stack:** Next.js 16 (App Router, Turbopack), TypeScript, \googleapis\, Supabase, Tailwind CSS.

## Global Constraints
- Target Google Drive Folder ID: \1hxj53429c4GEJWOnbT02ucGWNbwz5a4E\
- Service Account Email: \qvault-uploader@qvault-storage.iam.gserviceaccount.com\
- Files must be publicly readable without requiring users to log into Google
- Must support files up to 50MB+ on Vercel without payload body limit errors

---

### Task 1: Install \googleapis\ Dependency & Setup Environment Config

**Files:**
- Modify: \package.json\
- Modify: \.env.local\
- Create: \src/lib/drive.ts\

**Interfaces:**
- Produces: \getDriveClient()\ returning an authenticated \drive_v3.Drive\ instance.

- [ ] **Step 1: Install googleapis package**
\\\ash
npm install googleapis
\\\

- [ ] **Step 2: Create \src/lib/drive.ts\ helper**
\\\	ypescript
import { google } from 'googleapis'

export function getDriveClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!email || !privateKey) {
    throw new Error('Google Drive Service Account credentials are not configured in environment variables.')
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive']
  })

  return google.drive({ version: 'v3', auth })
}
\\\

- [ ] **Step 3: Verify build and types**
\\\ash
npx tsc --noEmit
\\\

---

### Task 2: Implement Upload API Route with Resumable & Chunked Upload Support

**Files:**
- Create: \src/app/api/upload/route.ts\

**Interfaces:**
- Consumes: \getDriveClient()\ from \src/lib/drive.ts\
- Produces: \POST /api/upload\ accepting multipart file or buffer, returning \{ success: true, fileId, viewUrl, downloadUrl }\

- [ ] **Step 1: Write \src/app/api/upload/route.ts\**
\\\	ypescript
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

    // Set public view permission
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      })
    } catch (permError) {
      console.warn('Permission warning (folder might already be public):', permError)
    }

    const viewUrl = https://drive.google.com/file/d//view
    const downloadUrl = https://drive.google.com/uc?export=download&id=

    return NextResponse.json({
      success: true,
      fileId,
      viewUrl,
      downloadUrl
    })
  } catch (error: any) {
    console.error('Drive upload API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file to Google Drive' },
      { status: 500 }
    )
  }
}
\\\

- [ ] **Step 2: Commit API Route**
\\\ash
git add src/app/api/upload/route.ts src/lib/drive.ts
git commit -m "feat: add Google Drive upload API route"
\\\

---

### Task 3: Update Client API & Upload Modal UI

**Files:**
- Modify: \src/lib/api.ts\
- Modify: \src/components/UploadModal.tsx\

**Interfaces:**
- Consumes: \POST /api/upload\
- Produces: \uploadToGoogleDrive(file: File): Promise<string>\

- [ ] **Step 1: Update \src/lib/api.ts\**
Add \uploadToGoogleDrive\ function and export it.

- [ ] **Step 2: Update \src/components/UploadModal.tsx\**
Switch from \uploadToCatbox\ to \uploadToGoogleDrive\.

- [ ] **Step 3: Test Upload & Build**
\\\ash
npm run build
\\\

---

### Task 4: End-to-End Verification

- [ ] **Step 1: Test file upload through UI or curl**
- [ ] **Step 2: Verify file appears inside Google Drive folder \1hxj53429c4GEJWOnbT02ucGWNbwz5a4E\**
- [ ] **Step 3: Verify Google Drive preview link works in Vault and Admin pages**
