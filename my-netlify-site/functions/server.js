const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/downloads')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Serve admin.html for the /admin path
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

const upload = multer({ dest: path.join(__dirname, '../public/downloads') });

// Load existing data
const dataPath = path.join(__dirname, '../data/uploads.json');
let uploads = [];

if (fs.existsSync(dataPath)) {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    uploads = JSON.parse(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    uploads = [];
  }
}

// Route to get uploads
app.get('/uploads', (req, res) => {
  res.json(uploads);
});

// Route to upload a new picture and text
app.post('/upload', upload.single('image'), (req, res) => {
  const { filename } = req.file;
  const { text } = req.body;
  const newUpload = { imageUrl: `/uploads/${filename}`, text };
  uploads.push(newUpload);
  fs.writeFileSync(dataPath, JSON.stringify(uploads, null, 2));
  res.status(201).json(newUpload);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});