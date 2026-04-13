# 📸 Photo Gallery - Setup Guide

## What's Changed?

✅ **Server-Side Storage** - Photos are now stored on a server, not in the browser  
✅ **Shared Access** - All users/browsers see the same uploaded photos  
✅ **Persistent Storage** - Photos stay saved even after closing the browser  
✅ **File-Based Storage** - Photos stored in `/uploads` folder on the server  

---

## Installation & Setup

### Step 1: Install Dependencies
Open PowerShell in the project folder and run:
```powershell
npm install
```

This will install:
- **express** - Web server
- **multer** - File upload handler
- **cors** - Cross-origin requests

### Step 2: Start the Server
```powershell
npm start
```

You should see:
```
✨ Photo Gallery Server Running ✨
📍 Open: http://localhost:3000
✓ Uploads folder: d:\My Project\My Dear Zindagi\uploads
✓ Metadata file: d:\My Project\My Dear Zindagi\photos_metadata.json
```

### Step 3: Open the Gallery
Open your browser and go to: **http://localhost:3000**

---

## How It Works Now

### Upload Photos (PIN: 2026)
1. Click "Upload Photos"
2. Enter PIN: **2026**
3. Drop/select photos
4. Photos upload to server and save to `/uploads` folder
5. Metadata stored in `photos_metadata.json`

### View Photos (PIN: 1234)
1. Click "View Photos"
2. Enter PIN: **1234**
3. See all uploaded photos from any browser/device
4. Photos load from the server

### Multiple Users
- **User 1** uploads photos with PIN 2026 → saved to server
- **User 2** views photos with PIN 1234 → loads from server
- **User 3** also views the same photos → all see identical gallery

---

## File Structure

```
My Dear Zindagi/
├── index.html              ← Frontend (updated to use API)
├── server.js               ← Backend server (new)
├── package.json            ← Dependencies (new)
├── uploads/                ← Photo storage folder (created automatically)
└── photos_metadata.json    ← Photo metadata (created automatically)
```

---

## Key Features

✨ **Max 50 Photos** - Gallery capacity limit  
📁 **Server Storage** - All photos saved on disk  
🔐 **Dual Passwords** - View (1234) and Upload (2026) access  
🗑️ **Delete Support** - Remove photos with one click  
📱 **Responsive** - Works on mobile and desktop  

---

## Stop the Server

Press **Ctrl+C** in PowerShell to stop the server.

---

## Troubleshooting

**"Cannot connect to server" message?**
- Make sure you ran `npm start`
- Check if running on http://localhost:3000

**Photos not saving?**
- Verify the `/uploads` folder exists
- Check server logs for errors
- Make sure you have write permissions to the folder

**Port already in use?**
- Edit `server.js` and change `PORT = 3000` to another number (e.g., 3001)

---

## Server API Endpoints

- `GET /api/photos` - Get all photos metadata
- `GET /api/photos/:filename` - Download a specific photo
- `POST /api/photos/upload` - Upload a new photo
- `DELETE /api/photos/:id` - Delete a photo

---

**Need Help?** Check the server logs in PowerShell for detailed error messages.
