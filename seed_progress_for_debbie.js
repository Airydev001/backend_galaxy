const mongoose = require('mongoose');
const Progress = require('./models/Progress');
const Kid = require('./models/Kid');
const Lesson = require('./models/Lesson');
const Subject = require('./models/Subject');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const kid = await Kid.findOne({ name: 'Debbie' }); // Or just findOne({})
        if (!kid) {
            console.log('Kid Debbie not found');
            return;
        }
        console.log(`Seeding for kid: ${kid.name} (${kid._id})`);

        // Find a subject and lesson
        const subject = await Subject.findOne({ name: 'Mathematics' });
        if (!subject) {
            console.log('Subject Mathematics not found');
            return;
        }

        const lesson = await Lesson.findOne({ subjectId: subject._id });
        if (!lesson) {
            console.log('No lesson found for Mathematics');
            return;
        }

        console.log(`Adding progress for Lesson: ${lesson.title}, Subject: ${subject.name}`);

        const progress = new Progress({
            kidId: kid._id,
            subjectId: subject._id,
            lessonId: lesson._id,
            score: 100,
            completedAt: new Date()
        });

        await progress.save();
        console.log('Progress saved!');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
