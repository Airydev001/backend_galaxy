const express = require('express');
const router = express.Router();
const Kid = require('../models/Kid');

// Add Kid Profile
router.post('/add', async (req, res) => {
    const { parentId, name, ageGroup, avatar } = req.body;

    try {
        const kid = await Kid.create({
            parentId,
            name,
            ageGroup,
            avatar,
        });

        res.status(201).json({
            success: true,
            data: kid,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
