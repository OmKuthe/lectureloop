const Quiz = require("../models/Quiz");
const generateQuizCode = require("../utils/generateQuizCode");
const geminiService = require("../services/geminiService");
const pdfParse = require("pdf-parse");
const Attempt = require("../models/Attempt");

function generateFeedback(percentage) {
  if (percentage >= 90) {
    return "Excellent! You have mastered this topic!";
  } else if (percentage >= 80) {
    return "Great job! You have a strong understanding.";
  } else if (percentage >= 70) {
    return "Good work! You understood most of the concepts.";
  } else if (percentage >= 60) {
    return "Not bad! You passed, but there's room for improvement.";
  } else if (percentage >= 50) {
    return "You need to review the material more carefully.";
  } else if (percentage >= 40) {
    return "Below average. Consider studying the concepts you missed.";
  } else {
    return "Please review the lecture material thoroughly and try again.";
  }
}

// CREATE QUIZ
exports.createQuiz = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Processing file:", {
      name: file.originalname,
      type: file.mimetype,
      size: file.size
    });

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      extractedText = data.text;
      console.log("PDF parsed, text length:", extractedText.length);
    } else if (file.mimetype === "text/plain") {
      extractedText = file.buffer.toString("utf8");
      console.log("TXT parsed, text length:", extractedText.length);
    } else {
      return res.status(400).json({ message: "Unsupported file type. Please upload PDF or TXT files." });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: "No text could be extracted from the file" });
    }

    console.log("Generating questions from lecture content...");
    
    const generatedQuestions = await geminiService.generateQuizQuestions(extractedText, 10);
    
    console.log(`Successfully generated ${generatedQuestions.length} questions`);

    const quizCode = generateQuizCode();

    const newQuiz = new Quiz({
      quizCode,
      questions: generatedQuestions,
      metadata: {
        generatedAt: new Date(),
        generatedBy: "Gemini AI",
        questionCount: generatedQuestions.length,
        types: {
          mcq: generatedQuestions.length,
        },
        difficulties: {
          easy: generatedQuestions.filter(q => q.difficulty === 'easy').length,
          medium: generatedQuestions.filter(q => q.difficulty === 'medium').length,
          hard: generatedQuestions.filter(q => q.difficulty === 'hard').length
        }
      }
    });

    await newQuiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quizCode,
      metadata: newQuiz.metadata,
      questionCount: generatedQuestions.length
    });

  } catch (error) {
    console.error("Error creating quiz:", error);
    
    let errorMessage = "Error creating quiz";
    if (error.message.includes("API key")) {
      errorMessage = "Invalid Gemini API key. Please check your configuration.";
    } else if (error.message.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later.";
    } else if (error.message.includes("file")) {
      errorMessage = "Error processing file: " + error.message;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: error.message 
    });
  }
};

// GET QUIZ BY CODE
exports.getQuizByCode = async (req, res) => {
  try {
    const { quizCode } = req.params;

    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionsWithoutAnswers = quiz.questions.map((q, idx) => {
      const baseQuestion = {
        id: idx,
        question: q.question,
        type: q.type,
        difficulty: q.difficulty
      };
      
      if (q.type === 'mcq' || q.type === 'truefalse') {
        baseQuestion.options = q.options;
      }
      
      return baseQuestion;
    });

    res.status(200).json({
      quizCode: quiz.quizCode,
      questions: questionsWithoutAnswers,
      metadata: quiz.metadata,
      totalQuestions: quiz.questions.length
    });

  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Error fetching quiz" });
  }
};

// SUBMIT ATTEMPT
exports.submitAttempt = async (req, res) => {
  try {
    const { quizCode } = req.params;
    const { studentName, answers } = req.body;

    if (!studentName || !answers) {
      return res.status(400).json({ message: "Student name and answers are required" });
    }

    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    const detailedResults = [];

    quiz.questions.forEach((q, index) => {
      const studentAnswer = answers[index];
      let isCorrect = false;
      let correctAnswer = null;
      let userAnswerDisplay = studentAnswer;
      
      if (q.type === 'mcq') {
        if (typeof studentAnswer === 'number') {
          isCorrect = studentAnswer === q.correctAnswer;
        } else if (typeof studentAnswer === 'string') {
          const answerIndex = q.options.findIndex(opt => 
            opt.toLowerCase() === studentAnswer.toLowerCase()
          );
          isCorrect = answerIndex === q.correctAnswer;
        }
        
        correctAnswer = q.options[q.correctAnswer];
        userAnswerDisplay = q.options[studentAnswer] || studentAnswer;
      } 
      else if (q.type === 'truefalse') {
        isCorrect = studentAnswer === q.correctAnswer;
        correctAnswer = q.options[q.correctAnswer];
        userAnswerDisplay = q.options[studentAnswer] || studentAnswer;
      }
      
      if (isCorrect) {
        score++;
      }
      
      detailedResults.push({
        questionIndex: index,
        isCorrect,
        correctAnswer,
        userAnswer: userAnswerDisplay,
        explanation: q.explanation,
        questionText: q.question,
        questionType: q.type
      });
    });

    const totalQuestions = quiz.questions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);
    const passed = percentage >= 60;

    const attempt = new Attempt({
      quizCode,
      studentName,
      answers,
      score,
      totalQuestions,
      percentage,
      passed,
      completedAt: new Date(),
      detailedResults
    });

    await attempt.save();

    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    const wrongAnswers = detailedResults.filter(r => !r.isCorrect).length;
    
    const weakAreas = detailedResults
      .filter(r => !r.isCorrect)
      .map(r => ({
        question: r.questionText,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation
      }));

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      total: totalQuestions,
      percentage,
      passed,
      correctAnswers,
      wrongAnswers,
      weakAreas: weakAreas.slice(0, 3),
      detailedResults,
      feedback: generateFeedback(percentage),
      performance: {
        excellent: percentage >= 90,
        good: percentage >= 70 && percentage < 90,
        average: percentage >= 60 && percentage < 70,
        needsImprovement: percentage < 60
      }
    });

  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ 
      message: "Error submitting quiz",
      error: error.message 
    });
  }
};

// GET QUIZ ANALYTICS
exports.getQuizAnalytics = async (req, res) => {
  try {
    const { quizCode } = req.params;

    const attempts = await Attempt.find({ quizCode }).sort({ completedAt: -1 });

    if (!attempts.length) {
      return res.status(200).json({
        totalStudents: 0,
        averageScore: 0,
        passRate: 0,
        topScore: 0,
        recentAttempts: []
      });
    }

    const totalStudents = attempts.length;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const averageScore = (totalScore / totalStudents).toFixed(2);
    const passRate = ((attempts.filter(a => a.passed).length / totalStudents) * 100).toFixed(2);
    const topScore = Math.max(...attempts.map(a => a.score));
    
    const recentAttempts = attempts.slice(0, 5).map(a => ({
      studentName: a.studentName,
      score: a.score,
      percentage: a.percentage,
      passed: a.passed,
      completedAt: a.completedAt
    }));

    const quiz = await Quiz.findOne({ quizCode });
    let questionAnalysis = [];
    
    if (quiz) {
      questionAnalysis = quiz.questions.map((q, idx) => {
        const correctCount = attempts.filter(a => {
          if (q.type === 'mcq') {
            return a.answers[idx] === q.correctAnswer;
          } else if (q.type === 'truefalse') {
            return a.answers[idx] === q.correctAnswer;
          }
          return false;
        }).length;
        
        const successRate = (correctCount / totalStudents) * 100;
        
        return {
          questionIndex: idx,
          type: q.type,
          difficulty: q.difficulty,
          successRate: successRate.toFixed(2),
          difficultyLevel: successRate > 70 ? 'Easy' : successRate > 40 ? 'Medium' : 'Hard'
        };
      });
    }

    res.status(200).json({
      totalStudents,
      averageScore,
      passRate,
      topScore,
      recentAttempts,
      questionAnalysis,
      attempts: attempts.map(a => ({
        studentName: a.studentName,
        score: a.score,
        percentage: a.percentage,
        passed: a.passed,
        completedAt: a.completedAt
      }))
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

// GET QUIZ STATS
exports.getQuizStats = async (req, res) => {
  try {
    const { quizCode } = req.params;
    
    const quiz = await Quiz.findOne({ quizCode });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    const attempts = await Attempt.find({ quizCode });
    
    const stats = {
      quizCode,
      totalAttempts: attempts.length,
      questionCount: quiz.questions.length,
      questionTypes: quiz.metadata?.types || {},
      difficulties: quiz.metadata?.difficulties || {},
      averageScore: attempts.length > 0 
        ? (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(2)
        : 0,
      passRate: attempts.length > 0
        ? ((attempts.filter(a => a.passed).length / attempts.length) * 100).toFixed(2)
        : 0
    };
    
    res.status(200).json(stats);
    
  } catch (error) {
    console.error("Error fetching quiz stats:", error);
    res.status(500).json({ message: "Error fetching quiz statistics" });
  }
};