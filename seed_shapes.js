const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');
const Lesson = require('./models/Lesson');
const connectDB = require('./config/db');

dotenv.config();

const seedShapesData = async () => {
    try {
        await connectDB();

        // 1. Create or Update "Shapes" Subject
        let shapesSubject = await Subject.findOne({ name: 'Shapes' });
        if (!shapesSubject) {
            shapesSubject = await Subject.create({
                name: 'Shapes',
                availableForAges: ['3-5', '6-8', '9-12'],
            });
            console.log('Shapes Subject created');
        } else {
            console.log('Shapes Subject already exists');
        }

        // 2. Create Sample Lessons
        const lessons = [
            {
                subjectId: shapesSubject._id,
                title: 'Basic Shapes',
                description: 'Learn about circles, squares, and triangles!',
                order: 1,
                questions: [
                    {
                        text: 'Which shape has 3 sides?',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/649/649733.png', // Triangle icon
                        options: ['Circle', 'Square', 'Triangle'],
                        correctAnswer: 'Triangle'
                    },
                    {
                        text: 'Which shape is round?',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/481/481078.png', // Circle icon
                        options: ['Circle', 'Square', 'Triangle'],
                        correctAnswer: 'Circle'
                    }
                ]
            },
            {
                subjectId: shapesSubject._id,
                title: 'Advance Shapes',
                description: 'Explore stars, hearts and more!',
                order: 2,
                questions: [
                    {
                        text: 'Which shape looks like a star?',
                        imageUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', // Star icon
                        options: ['Star', 'Heart', 'Diamond'],
                        correctAnswer: 'Star'
                    }
                ]
            }
        ];

        for (const lessonData of lessons) {
            await Lesson.create(lessonData);
            console.log('Shapes Lesson seeded:', lessonData.title);
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedShapesData();
