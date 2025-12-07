const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');
const Lesson = require('./models/Lesson');
const Reward = require('./models/Reward');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await Subject.deleteMany();
        await Lesson.deleteMany();
        await Reward.deleteMany();

        const subjectsData = [
            {
                name: 'Math',
                availableForAges: ['3-5', '6-8'],
                lessons: [
                    {
                        title: 'Counting 1-10',
                        description: 'Learn to count from 1 to 10',
                        questions: [
                            { text: 'How many fingers do you have on one hand?', options: ['4', '5', '6'], correctAnswer: '5' },
                            { text: 'What comes after 2?', options: ['1', '3', '4'], correctAnswer: '3' }
                        ]
                    },
                    {
                        title: 'Simple Addition',
                        description: 'Add single digit numbers',
                        questions: [
                            { text: '1 + 1 = ?', options: ['1', '2', '3'], correctAnswer: '2' }
                        ]
                    },
                ],
            },
            {
                name: 'English',
                availableForAges: ['3-5', '6-8', '9-12'],
                lessons: [
                    {
                        title: 'Alphabet',
                        description: 'Learn the ABCs',
                        questions: [
                            { text: 'What is the first letter?', options: ['A', 'B', 'C'], correctAnswer: 'A' }
                        ]
                    },
                ],
            },
        ];

        for (const subData of subjectsData) {
            const subject = await Subject.create({
                name: subData.name,
                availableForAges: subData.availableForAges,
            });

            for (const lessonData of subData.lessons) {
                await Lesson.create({
                    subjectId: subject._id,
                    title: lessonData.title,
                    description: lessonData.description,
                    questions: lessonData.questions,
                });
            }
        }

        const rewards = [
            { title: 'Cool Hat', imagePath: 'assets/images/hat.png', price: 50, category: 'Outfits' },
            { title: 'Space Theme', imagePath: 'assets/images/space.png', price: 100, category: 'Themes' },
            { title: 'Super Hero', imagePath: 'assets/images/hero.png', price: 150, category: 'Avatar' },
        ];

        await Reward.insertMany(rewards);

        console.log('Data Seeded!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
