const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const mongoose = require('mongoose');

// Update or Create Progress
router.post('/update', async (req, res) => {
    const { kidId, subjectId, lessonId, score } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(kidId) ||
            !mongoose.Types.ObjectId.isValid(subjectId) ||
            !mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ message: 'Invalid ID(s)' });
        }

        // Find existing progress
        let progress = await Progress.findOne({ kidId, lessonId });

        if (progress) {
            // Update existing record (only if new score is higher, or just update latest? 
            // Let's just update to the latest for now, or keep max. User didn't specify.
            // Usually we want to track that they completed it again.
            // Let's update the score and completedAt date.
            progress.score = score;
            progress.completedAt = Date.now();
            await progress.save();
        } else {
            // Create new record
            progress = new Progress({
                kidId,
                subjectId,
                lessonId,
                score
            });
            await progress.save();
        }

        res.status(200).json({ success: true, data: progress });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
