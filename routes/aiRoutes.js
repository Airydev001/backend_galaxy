const express = require('express');
const router = express.Router();
const { generateLessonContent } = require('../services/aiService');

router.post('/generate', async (req, res) => {
    const { topic, ageGroup, count } = req.body;

    if (!topic || !ageGroup) {
        return res.status(400).json({ message: 'Topic and Age Group are required' });
    }

    try {
        const content = await generateLessonContent(topic, ageGroup, count);
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate content', error: error.message });
    }
});

module.exports = router;
