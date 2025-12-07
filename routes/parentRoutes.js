const express = require('express');
const router = express.Router();
const Kid = require('../models/Kid');
const Progress = require('../models/Progress');

// Get Parent Dashboard Stats
router.get('/stats/:parentId', async (req, res) => {
    try {
        const kids = await Kid.find({ parentId: req.params.parentId });
        const kidIds = kids.map(k => k._id);

        // Mock data for weekly activity (replace with real aggregation later)
        const weeklyActivity = [
            { day: 'M', value: 20 },
            { day: 'T', value: 35 },
            { day: 'W', value: 10 },
            { day: 'Th', value: 45 },
            { day: 'F', value: 30 },
            { day: 'S', value: 50 },
            { day: 'S', value: 40 },
        ];

        // Mock subject breakdown
        const subjectBreakdown = [
            { title: 'Math', value: 40, color: '#FF5733' },
            { title: 'English', value: 30, color: '#33FF57' },
            { title: 'Science', value: 30, color: '#3357FF' },
        ];

        res.json({
            kids: kids,
            weeklyActivity: weeklyActivity,
            subjectBreakdown: subjectBreakdown,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
