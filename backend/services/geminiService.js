// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    // Initialize with your API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use the correct model name from your curl response
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateQuizQuestions(text, count = 10) {
    try {
      console.log("Generating questions with Gemini...");
      
      // Clean and limit text to avoid token limits (Gemini Pro has 30k token limit)
      const cleanText = text.replace(/\s+/g, ' ').trim().substring(0, 5000);
      
      const prompt = `
        You are an expert teacher creating a quiz from a lecture.
        
        Generate ${count} multiple-choice questions based on this lecture content.
        
        IMPORTANT RULES:
        - Questions should test understanding of KEY CONCEPTS
        - Each question must have EXACTLY 4 options
        - Options should be PLAUSIBLE and EDUCATIONAL
        - Mark the correct answer with the INDEX (0, 1, 2, or 3)
        - Add a brief EXPLANATION for why the answer is correct
        - Return ONLY valid JSON, no other text
        
        RETURN FORMAT (JSON array):
        [
          {
            "question": "What is the main concept discussed?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "This is correct because..."
          }
        ]
        
        Lecture content:
        ${cleanText}
        
        Generate ${count} questions now. Return ONLY the JSON array, nothing else.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let textResponse = response.text();
      
      console.log("Raw Gemini response:", textResponse.substring(0, 200));
      
      // Clean the response to extract JSON
      textResponse = textResponse.trim();
      
      // Remove markdown code blocks if present
      textResponse = textResponse.replace(/```json\n?/g, '');
      textResponse = textResponse.replace(/```\n?/g, '');
      
      // Find JSON array in the response
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }
      
      const questions = JSON.parse(jsonMatch[0]);
      
      // Validate and format questions
      if (!Array.isArray(questions)) {
        throw new Error("Response is not an array");
      }
      
      return questions.map((q, index) => ({
        type: 'mcq',
        difficulty: this.determineDifficulty(q.question, text),
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "Based on the lecture content",
        source: "AI-generated"
      }));
      
    } catch (error) {
      console.error("Error generating questions with Gemini:", error);
      console.error("Error details:", error.message);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  determineDifficulty(question, text) {
    // Simple difficulty heuristic
    const wordCount = question.split(' ').length;
    if (wordCount > 20) return 'hard';
    if (wordCount > 12) return 'medium';
    return 'easy';
  }
}

module.exports = new GeminiService();