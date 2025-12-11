const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Lesson = require('../models/Lesson');

// Create a new Subject
router.post('/subjects', async (req, res) => {
    const { name, availableForAges } = req.body;

    try {
        const subject = await Subject.create({
            name,
            availableForAges,
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new Lesson for a Subject
router.post('/lessons', async (req, res) => {
    const { subjectId, title, description, questions, order, ageGroup } = req.body;

    try {
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const lesson = await Lesson.create({
            subjectId,
            title,
            description,
            questions,
            order,
            ageGroup,
        });

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all lessons for a subject (Admin view)
router.get('/lessons/:subjectId', async (req, res) => {
    try {
        const lessons = await Lesson.find({ subjectId: req.params.subjectId }).sort({ order: 1 });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all subjects (for dropdown)
router.get('/subjects', async (req, res) => {
    try {
        const subjects = await Subject.find({}, 'name _id availableForAges');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
