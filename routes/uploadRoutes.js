const express = require('express');
const router = express.Router();
const { parser } = require('../config/cloudinary');

router.post('/image', parser.single('image'), (req, res) => {
    console.log('📷 Upload request received');
    if (!req.file) {
        console.error('❌ No file received in request');
        return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('✅ File uploaded to Cloudinary:', req.file.path);
    res.json({ imageUrl: req.file.path });
});

module.exports = router;
