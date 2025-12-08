const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');
const Lesson = require('./models/Lesson');
const connectDB = require('./config/db');

dotenv.config();

const seedEnglishData = async () => {
    try {
        await connectDB();

        // 1. Create or Update "English" Subject
        let englishSubject = await Subject.findOne({ name: 'English' });
        if (!englishSubject) {
            englishSubject = await Subject.create({
                name: 'English',
                availableForAges: ['3-5', '6-8', '9-12'],
            });
            console.log('English Subject created');
        } else {
            console.log('English Subject already exists');
        }

        // 2. Create Sample Lesson
        const lesson = await Lesson.create({
            subjectId: englishSubject._id,
            title: 'Word Matching',
            description: 'Match the picture with the correct word!',
            order: 1,
            questions: [
                {
                    text: 'What is this?',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png', // Book icon
                    options: ['Book', 'Boot', 'Bag'],
                    correctAnswer: 'Book'
                },
                {
                    text: 'Which animal is this?',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/616/616408.png', // Cat icon
                    options: ['Cat', 'Car', 'Cap'],
                    correctAnswer: 'Cat'
                },
                {
                    text: 'Find the Apple',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/415/415733.png', // Apple icon
                    options: ['Ant', 'Apple', 'Axe'],
                    correctAnswer: 'Apple'
                }
            ]
        });

        console.log('English Lesson seeded:', lesson.title);

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedEnglishData();
