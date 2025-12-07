const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');

// Get Single Lesson by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid lesson ID' });
        }

        const lesson = await Lesson.findById(id);

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
