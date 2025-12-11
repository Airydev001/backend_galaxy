const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress'); // Import Progress model

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

        // If kidId is provided to filter by age
        let ageFilter = {};
        if (req.query.kidId) {
            const kid = await mongoose.model('Kid').findById(req.query.kidId);
            if (kid && kid.ageGroup) {
                ageFilter.ageGroup = kid.ageGroup;
            }
        }

        // Find lessons for this subject (and optionally age group)
        const lessons = await Lesson.find({ subjectId: subject._id, ...ageFilter })
            .sort({ order: 1 });

        // If kidId is provided, fetch progress
        let lessonsWithProgress = lessons.map(l => l.toObject());

        if (req.query.kidId) {
            const kidId = req.query.kidId;
            const progressRecords = await mongoose.model('Progress').find({
                kidId: kidId,
                subjectId: subject._id
            });

            lessonsWithProgress = lessonsWithProgress.map(lesson => {
                const progress = progressRecords.find(p => p.lessonId.toString() === lesson._id.toString());
                return {
                    ...lesson,
                    score: progress ? progress.score : null,
                    isCompleted: !!progress
                };
            });
        }

        res.json({
            subject: subject,
            lessons: lessonsWithProgress
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
