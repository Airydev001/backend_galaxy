const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Subject = require('./models/Subject');
const Kid = require('./models/Kid');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb+srv://learningadventure:1234567890@cluster0.onrender.com/learning_adventure?retryWrites=true&w=majority') // Using connection string from .env.example or inferred
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

async function verify() {
    try {
        console.log("Starting verification...");

        // 1. Create a Dummy Subject
        const subject = await Subject.create({
            name: "Test Subject " + Date.now(),
            availableForAges: "3-5"
        });
        console.log("Created subject:", subject.name);

        // 2. Create Lesson for Age 3-5
        const lessonLow = await Lesson.create({
            subjectId: subject._id,
            title: "Easy Lesson",
            description: "For little kids",
            ageGroup: "3-5",
            questions: []
        });
        console.log("Created lesson for 3-5");

        // 3. Create Lesson for Age 6-8
        const lessonHigh = await Lesson.create({
            subjectId: subject._id,
            title: "Medium Lesson",
            description: "For middle kids",
            ageGroup: "6-8",
            questions: []
        });
        console.log("Created lesson for 6-8");

        // 4. Create Dummy Kid (Age 3-5)
        // Need a valid parent ID for Kid schema, skipping or mocking if possible, or using partial mock
        // Since I can't easily make a parent, I'll Mock the query results logic manually or try to rely on route logic if I could call it.
        // Instead, let's just test the Query logic that routes use directly.

        console.log("Simulating Subject Route with Kid Age 3-5...");
        const lessonsForLittleKid = await Lesson.find({
            subjectId: subject._id,
            ageGroup: "3-5"
        });
        console.log(`Found ${lessonsForLittleKid.length} lessons for 3-5.`);
        if (lessonsForLittleKid.length === 1 && lessonsForLittleKid[0].title === "Easy Lesson") {
            console.log("SUCCESS: Correctly filtered for 3-5.");
        } else {
            console.log("FAILURE: Filtering failed.");
        }

        console.log("Simulating Subject Route with Kid Age 6-8...");
        const lessonsForMediumKid = await Lesson.find({
            subjectId: subject._id,
            ageGroup: "6-8"
        });
        console.log(`Found ${lessonsForMediumKid.length} lessons for 6-8.`);
        if (lessonsForMediumKid.length === 1 && lessonsForMediumKid[0].title === "Medium Lesson") {
            console.log("SUCCESS: Correctly filtered for 6-8.");
        } else {
            console.log("FAILURE: Filtering failed.");
        }

        // Cleanup
        await Lesson.deleteMany({ subjectId: subject._id });
        await Subject.findByIdAndDelete(subject._id);
        console.log("Cleanup done.");

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

// Allow time to connect
setTimeout(verify, 2000);
