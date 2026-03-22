// test-gemini.js
require('dotenv').config();
const geminiService = require('./services/geminiService');

async function test() {
  try {
    const testText = "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It uses algorithms to parse data, learn from it, and make informed decisions.";
    
    console.log("Testing Gemini service...");
    const questions = await geminiService.generateQuizQuestions(testText, 3);
    console.log("Generated questions:", JSON.stringify(questions, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();