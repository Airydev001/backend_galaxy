const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateLessonContent = async (topic, ageGroup) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Create a lesson plan for a child aged ${ageGroup} on the topic "${topic}".
    Return the response in valid JSON format with the following structure:
    {
      "title": "Fun title for the lesson",
      "description": "Short, engaging description",
      "questions": [
        {
          "text": "Question text",
          "options": ["Option 1", "Option 2", "Option 3"],
          "correctAnswer": "Option 1",
          "imagePrompt": "A simple description of an image to accompany this question"
        }
      ]
    }
    Generate 3 questions. Ensure the language is appropriate for the age group.
    IMPORTANT: Return ONLY the JSON string, no markdown formatting or backticks.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown code blocks if Gemini adds them
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating lesson content:", error);
    throw error;
  }
};

module.exports = { generateLessonContent };
