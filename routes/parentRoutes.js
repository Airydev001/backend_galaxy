const express = require('express');
const router = express.Router();
const Kid = require('../models/Kid');
const Progress = require('../models/Progress');

// Get Parent Dashboard Stats
router.get('/stats/:parentId', async (req, res) => {
    try {
        const kids = await Kid.find({ parentId: req.params.parentId });
        const kidIds = kids.map(k => k._id);

        if (kidIds.length === 0) {
            return res.json({
                kids: [],
                totalPlayTime: "0h 0m",
                avgAccuracy: 0,
                lessonsCompleted: 0,
                currentStreak: 0,
                weeklyActivity: [],
                subjectBreakdown: []
            });
        }

        // 1. Total Lessons Completed
        const totalLessons = await Progress.countDocuments({ kidId: { $in: kidIds } });

        // 2. Average Accuracy
        const accuracyAgg = await Progress.aggregate([
            { $match: { kidId: { $in: kidIds } } },
            { $group: { _id: null, avgScore: { $avg: "$score" } } }
        ]);
        const avgAccuracy = accuracyAgg.length > 0 ? Math.round(accuracyAgg[0].avgScore) : 0;

        // 3. Total Playtime (Estimate: 10 mins per lesson)
        const totalMinutes = totalLessons * 10;
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const totalPlayTime = `${hours}h ${mins}m`;

        // 4. Current Streak (Consecutive days ending today/yesterday)
        const streakAgg = await Progress.aggregate([
            { $match: { kidId: { $in: kidIds } } },
            { $project: { date: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } } } },
            { $group: { _id: "$date" } },
            { $sort: { _id: -1 } }
        ]);

        let streak = 0;
        if (streakAgg.length > 0) {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            let checkDate = new Date(); // Start checking from today
            // Check if the most recent activity was today or yesterday to start the streak
            if (streakAgg[0]._id === todayStr) {
                // Good
            } else if (streakAgg[0]._id === yesterdayStr) {
                checkDate.setDate(checkDate.getDate() - 1); // Start checking from yesterday
            } else {
                // Streak broken
                checkDate = null;
            }

            if (checkDate) {
                for (let i = 0; i < streakAgg.length; i++) {
                    const dateStr = checkDate.toISOString().split('T')[0];
                    if (streakAgg[i]._id === dateStr) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }
            }
        }

        // 5. Weekly Activity (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days inclusive
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const weeklyAgg = await Progress.aggregate([
            {
                $match: {
                    kidId: { $in: kidIds },
                    completedAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: "$completedAt" } // 1 (Sun) - 7 (Sat)
                }
            },
            {
                $group: {
                    _id: "$dayOfWeek",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Map MongoDB dayOfWeek (1=Sun) to our chart format (M, T, W...)
        // Chart expects index 1=Mon, 2=Tue... 7=Sun based on the front end code?
        // Let's check frontend: days are ['M', 'T', 'W', 'Th', 'F', 'S', 'S']
        // Frontend logic seems to map value 1->M, 2->T, etc.
        // MongoDB: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat.

        // Map Mongo (Sun=1) to Chart (Sun=7) so Mon=1
        const mapMongoToChart = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 1: 7 };

        const activityMap = {};
        weeklyAgg.forEach(item => {
            const chartIndex = mapMongoToChart[item._id];
            activityMap[chartIndex] = item.count;
        });

        const weeklyActivity = [];
        for (let i = 1; i <= 7; i++) {
            // Example values roughly scaled. The chart logic in frontend uses index+1 as X.
            // We just need to return a list that matches the frontend expectation.
            // But existing frontend expects [{ day: 'M', value: 20 }] format?
            // Actually, verify frontend logic: 
            // spots: weeklyActivity.asMap().entries.map((e) => FlSpot((e.key + 1).toDouble(), ...))
            // So it just iterates the list. The list order matters.
            // We should return Mon, Tue, Wed... Sun ordered list.
            const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'S'];
            weeklyActivity.push({
                day: days[i - 1],
                value: activityMap[i] || 0
            });
        }

        // 6. Subject Breakdown
        const breakdownAgg = await Progress.aggregate([
            { $match: { kidId: { $in: kidIds } } },
            { $group: { _id: "$subjectId", count: { $sum: 1 } } },
            { $lookup: { from: "subjects", localField: "_id", foreignField: "_id", as: "subject" } },
            { $unwind: "$subject" },
            { $project: { title: "$subject.name", value: "$count" } }
        ]);

        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFC300', '#DAF7A6'];
        const subjectBreakdown = breakdownAgg.map((item, index) => ({
            title: item.title,
            value: item.value,
            color: colors[index % colors.length]
        }));


        res.json({
            kids: kids,
            totalPlayTime,
            avgAccuracy,
            lessonsCompleted: totalLessons,
            currentStreak: streak,
            weeklyActivity,
            subjectBreakdown,
        });
    } catch (error) {
        console.error("Error fetching parent stats:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
