const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');
const Lesson = require('./models/Lesson');
const connectDB = require('./config/db');

dotenv.config();

const seedMathData = async () => {
    try {
        await connectDB();

        // 1. Create or Update "Math" Subject
        let mathSubject = await Subject.findOne({ name: 'Mathematics' });
        if (!mathSubject) {
            mathSubject = await Subject.create({
                name: 'Mathematics',
                availableForAges: ['3-5', '6-8', '9-12'], // Adjust ages as needed
            });
            console.log('Math Subject created');
        } else {
            console.log('Math Subject already exists');
        }

        // 2. Clear existing lessons for this subject (optional, for clean state)
        // await Lesson.deleteMany({ subjectId: mathSubject._id });

        // 3. Create Sample Lesson with Images
        const lesson = await Lesson.create({
            subjectId: mathSubject._id,
            title: 'Fun with Shapes',
            description: 'Learn to identify different shapes around us!',
            order: 1,
            questions: [
                {
                    text: 'Which shape is this?',
                    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Circle_-_black_simple.svg/800px-Circle_-_black_simple.svg.png',
                    options: ['Circle', 'Square', 'Triangle'],
                    correctAnswer: 'Circle'
                },
                {
                    text: 'Can you find the Square?',
                    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Square_-_black_simple.svg/800px-Square_-_black_simple.svg.png',
                    options: ['Circle', 'Square', 'Star'],
                    correctAnswer: 'Square'
                },
                {
                    text: 'Video games use which math?',
                    // No image for this one to test conditional rendering
                    options: ['Calculus', 'Geometry', 'Algebra'],
                    correctAnswer: 'Geometry'
                }
            ]
        });

        console.log('Math Lesson seeded with images:', lesson.title);

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedMathData();
