const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const Lesson = require('./models/Lesson');
const Progress = require('./models/Progress');
const Kid = require('./models/Kid');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const subjects = await Subject.find({});
        console.log(`Found ${subjects.length} subjects`);

        const lessons = await Lesson.find({});
        console.log(`Found ${lessons.length} lessons`);

        const progress = await Progress.find({});
        console.log(`Found ${progress.length} progress records`);
        progress.forEach(p => console.log(`Progress for kid: ${p.kidId}, Lesson: ${p.lessonId}, Subject: ${p.subjectId}`));

        // Check Lessons
        for (const lesson of lessons) {
            const subject = subjects.find(s => s._id.toString() === lesson.subjectId.toString());
            if (!subject) {
                console.error(`Lesson ${lesson.title} (${lesson._id}) has invalid subjectId: ${lesson.subjectId}`);
            }
        }

        // Check Progress
        for (const p of progress) {
            const subject = subjects.find(s => s._id.toString() === p.subjectId.toString());
            if (!subject) {
                console.error(`Progress ${p._id} has invalid subjectId: ${p.subjectId}`);
            } else {
                // Check if subjectID matches lesson's subjectID
                const lesson = lessons.find(l => l._id.toString() === p.lessonId.toString());
                if (lesson) {
                    if (lesson.subjectId.toString() !== p.subjectId.toString()) {
                        console.error(`Progress ${p._id} subjectId mismatch! Progress says ${p.subjectId} but Lesson says ${lesson.subjectId}`);
                    }
                }
            }

            const lesson = lessons.find(l => l._id.toString() === p.lessonId.toString());
            if (!lesson) {
                console.error(`Progress ${p._id} has invalid lessonId: ${p.lessonId}`);
            }
        }

        // Simulate Dashboard logic for first kid
        const kid = await Kid.findOne({});
        if (kid) {
            console.log(`Simulating dashboard for kid: ${kid.name} (${kid._id})`);
            const validSubjects = await Subject.find({ availableForAges: kid.ageGroup });
            console.log(`Found ${validSubjects.length} subjects for age group ${kid.ageGroup}`);

            for (const subject of validSubjects) {
                const lessons = await Lesson.find({ subjectId: subject._id });
                const completedCount = await Progress.countDocuments({
                    kidId: kid._id,
                    subjectId: subject._id
                });
                const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
                console.log(`Subject: ${subject.name}, Total: ${lessons.length}, Completed: ${completedCount}, Percent: ${progressPercent}%`);

                // Debugging Progress query failure
                if (completedCount === 0) {
                    const anyProgress = await Progress.find({ kidId: kid._id });
                    console.log(`Total progress records for kid: ${anyProgress.length}`);
                    if (anyProgress.length > 0) {
                        console.log(`Sample progress subjectId: ${anyProgress[0].subjectId}`);
                        console.log(`Target subjectId: ${subject._id}`);
                        console.log(`Are they equal? ${anyProgress[0].subjectId.toString() === subject._id.toString()}`);
                    }
                }
            }
        } else {
            console.log("No kids found to simulate dashboard.");
        }

        console.log('Consistency check complete.');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
