const Quiz = require("../models/Quiz");
const generateQuizCode = require("../utils/generateQuizCode");

exports.createQuiz = async (req, res) => {
  try {
    // 1. Extract text from uploaded file
    // 2. Generate questions
    // 3. Generate quiz code
    // 4. Save to DB
    // 5. Return quizCode
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz" });
  }
};
