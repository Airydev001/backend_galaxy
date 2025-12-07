const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Lesson = require('../models/Lesson');

// Get Lessons for a Specific Subject
router.get('/:subjectName/lessons', async (req, res) => {
    const { subjectName } = req.params;

    try {
        // Find the subject by name (case-insensitive)
        const subject = await Subject.findOne({
            name: { $regex: new RegExp(`^${subjectName}$`, 'i') }
        });

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Find lessons for this subject
        const lessons = await Lesson.find({ subjectId: subject._id })
            .sort({ order: 1 });

        res.json({
            subject: subject,
            lessons: lessons
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
