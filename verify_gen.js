const { generateLessonContent } = require('./services/aiService');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
    try {
        console.log("Testing with count = 2");
        const res1 = await generateLessonContent("Math", "5-7", 2);
        console.log("Count 2 Result Questions Length:", res1.questions ? res1.questions.length : 'No questions');

        if (res1.questions && res1.questions.length === 2) {
            console.log("SUCCESS: Got 2 questions.");
        } else {
            console.log("FAILURE: Expected 2 questions.");
        }

        console.log("\nTesting with count = 4");
        const res2 = await generateLessonContent("Science", "8-10", 4);
        console.log("Count 4 Result Questions Length:", res2.questions ? res2.questions.length : 'No questions');

        if (res2.questions && res2.questions.length === 4) {
            console.log("SUCCESS: Got 4 questions.");
        } else {
            console.log("FAILURE: Expected 4 questions.");
        }

    } catch (e) {
        console.error("Error during test:", e);
    }
}
test();
