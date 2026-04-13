const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ============ PHOTO METADATA FILE ============
const metadataFile = path.join(__dirname, 'photos_metadata.json');

function readPhotosMetadata() {
  try {
    if (fs.existsSync(metadataFile)) {
      return JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading metadata:', err);
  }
  return [];
}

function writePhotosMetadata(data) {
  try {
    fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing metadata:', err);
  }
}

// ============ API ENDPOINTS ============

// GET all photos metadata
app.get('/api/photos', (req, res) => {
  try {
    const photos = readPhotosMetadata();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// GET a single photo file
app.get('/api/photos/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);
    
    // Security check - prevent path traversal
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (fs.existsSync(filepath)) {
      res.sendFile(filepath);
    } else {
      res.status(404).json({ error: 'Photo not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

// POST upload photo
app.post('/api/photos/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photos = readPhotosMetadata();
    
    // Check capacity limit (50 photos)
    if (photos.length >= 50) {
      // Delete the uploaded file since we're at capacity
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Gallery is full (50 photos max)' });
    }

    const photoData = {
      id: Date.now(),
      filename: req.file.filename,
      name: req.file.originalname,
      date: new Date().toLocaleDateString(),
      url: `/api/photos/${req.file.filename}`,
      size: req.file.size
    };

    photos.push(photoData);
    writePhotosMetadata(photos);

    res.json({ success: true, photo: photoData });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// DELETE a photo
app.delete('/api/photos/:id', (req, res) => {
  try {
    const photoId = parseInt(req.params.id);
    const photos = readPhotosMetadata();
    const photoIndex = photos.findIndex(p => p.id === photoId);

    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const photo = photos[photoIndex];
    const filepath = path.join(uploadsDir, photo.filename);

    // Delete the file
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Remove from metadata
    photos.splice(photoIndex, 1);
    writePhotosMetadata(photos);

    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✨ Photo Gallery Server Running ✨`);
  console.log(`📍 Open: http://localhost:${PORT}`);
  console.log(`\n✓ Uploads folder: ${uploadsDir}`);
  console.log(`✓ Metadata file: ${metadataFile}`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});
