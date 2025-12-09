const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Kid = require('../models/Kid');
const Subject = require('../models/Subject');

// Get Dashboard for Kid
router.get('/:kidId', async (req, res) => {
    const { kidId } = req.params;

    try {
        const kid = await Kid.findById(kidId);
        if (!kid) {
            return res.status(404).json({ message: 'Kid not found' });
        }

        // Find subjects suitable for the kid's age group
        const subjects = await Subject.find({ availableForAges: kid.ageGroup });

        // Fetch lessons for each subject and calculate progress
        const subjectsWithLessons = await Promise.all(subjects.map(async (subject) => {
            // Get all lessons for this subject
            const lessons = await mongoose.model('Lesson').find({ subjectId: subject._id }).sort({ order: 1 });
            const totalLessons = lessons.length;

            // Get completed lessons count for this kid and subject
            const completedCount = await mongoose.model('Progress').countDocuments({
                kidId: kid._id,
                subjectId: subject._id
            });

            // Calculate percentage
            const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            console.log(`Subject: ${subject.name}, Kid: ${kid._id}`);
            console.log(`Total Lessons: ${totalLessons}, Completed: ${completedCount}, Percent: ${progressPercent}`);
            console.log(`Subject ID from Subject: ${subject._id}`);

            return {
                ...subject.toObject(),
                lessons: lessons,
                progressPercent: progressPercent
            };
        }));

        res.json({
            kid: {
                id: kid._id,
                name: kid.name,
                ageGroup: kid.ageGroup,
                avatar: kid.avatar,
                stars: kid.stars,
            },
            subjects: subjectsWithLessons,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
