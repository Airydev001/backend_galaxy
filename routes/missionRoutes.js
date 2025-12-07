const express = require('express');
const router = express.Router();

// Get Daily Mission
router.get('/daily/:kidId', async (req, res) => {
    // Logic to generate or fetch a daily mission
    // For now, return a static mission
    res.json({
        title: "Today's Mission",
        tasks: [
            {
                title: "Counting 1-10",
                description: "Practice counting from 1 to 10",
                type: "lesson",
                targetId: "lesson_id_here", // Link to actual lesson
                isCompleted: false,
            },
            {
                title: "Play a Game",
                description: "Play the shape matching game",
                type: "game",
                targetId: "game_id_here",
                isCompleted: false,
            }
        ]
    });
});

module.exports = router;
