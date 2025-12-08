const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');
const Lesson = require('./models/Lesson');
const connectDB = require('./config/db');

dotenv.config();

const seedScienceData = async () => {
    try {
        await connectDB();

        // 1. Create or Update "Science" Subject
        let scienceSubject = await Subject.findOne({ name: 'Science' });
        if (!scienceSubject) {
            scienceSubject = await Subject.create({
                name: 'Science',
                availableForAges: ['3-5', '6-8', '9-12'],
            });
            console.log('Science Subject created');
        } else {
            console.log('Science Subject already exists');
        }

        // 2. Create Sample Lessons
        const lessons = [
            {
                subjectId: scienceSubject._id,
                title: 'Solar System',
                description: 'Explore the planets in our solar system!',
                order: 1,
                questions: [
                    {
                        text: 'Which planet is the Red Planet?',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/2530/2530898.png', // Mars icon
                        options: ['Mars', 'Venus', 'Jupiter'],
                        correctAnswer: 'Mars'
                    },
                    {
                        text: 'Which is the largest planet?',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/2530/2530906.png', // Jupiter icon
                        options: ['Earth', 'Jupiter', 'Saturn'],
                        correctAnswer: 'Jupiter'
                    }
                ]
            },
            {
                subjectId: scienceSubject._id,
                title: 'Plants & Trees',
                description: 'Learn about how plants grow!',
                order: 2,
                questions: [
                    {
                        text: 'What do plants need to grow?',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/628/628324.png', // Sun icon
                        options: ['Sunlight', 'Candy', 'Toys'],
                        correctAnswer: 'Sunlight'
                    }
                ]
            }
        ];

        for (const lessonData of lessons) {
            await Lesson.create(lessonData);
            console.log('Science Lesson seeded:', lessonData.title);
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedScienceData();
