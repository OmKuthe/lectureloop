const Quiz = require("../models/Quiz");
const generateQuizCode = require("../utils/generateQuizCode");
const fs = require("fs");
const pdfParse = require("pdf-parse");



exports.getQuizAnalytics = async (req, res) => {
  try {
    const { quizCode } = req.params;

    const attempts = await Attempt.find({ quizCode });

    if (!attempts.length) {
      return res.status(200).json({
        totalStudents: 0,
        averageScore: 0,
      });
    }

    const totalStudents = attempts.length;

    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

    const averageScore = (totalScore / totalStudents).toFixed(2);

    res.status(200).json({
      totalStudents,
      averageScore,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
exports.createQuiz = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let extractedText = "";

    // If PDF
    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    }

    // If TXT
    else if (file.mimetype === "text/plain") {
      extractedText = fs.readFileSync(file.path, "utf8");
    }

    else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Clean text
    extractedText = extractedText.replace(/\s+/g, " ").trim();

    // Generate questions
    const questions = generateQuestions(extractedText);

    const quizCode = generateQuizCode();

    const newQuiz = new Quiz({
      quizCode,
      questions,
    });

    await newQuiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quizCode,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating quiz" });
  }
};

const generateQuestions = (text) => {
  const sentences = text.split(".").filter(s => s.length > 20);

  const questions = [];

  for (let i = 0; i < 10 && i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const words = sentence.split(" ");

    // pick a keyword (longer word)
    const keywords = words.filter(w => w.length > 4);
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];

    let questionObj;

    if (i % 3 === 0) {
      questionObj = generateDefinitionQuestion(sentence, keyword);
    } else if (i % 3 === 1) {
      questionObj = generateConceptQuestion(sentence, keyword);
    } else {
      questionObj = generateFillBlankQuestion(sentence, keyword);
    }

    questions.push(questionObj);
  }

  return questions;
};

const generateDefinitionQuestion = (sentence, keyword) => {
  return {
    question: `What is ${keyword}?`,
    ...generateOptions(keyword, sentence.split(" "))
  };
};
const generateConceptQuestion = (sentence, keyword) => {
  return {
    question: `Which of the following best describes ${keyword}?`,
    ...generateOptions(keyword, sentence.split(" "))
  };
};
const generateFillBlankQuestion = (sentence, keyword) => {
  const questionText = sentence.replace(keyword, "______");

  return {
    question: questionText,
    ...generateOptions(keyword, sentence.split(" "))
  };
};

const generateOptions = (correctWord, words) => {
  const cleanWords = words
    .map(w => w.replace(/[^a-zA-Z]/g, ""))
    .filter(w => w.length > 4 && w.toLowerCase() !== correctWord.toLowerCase());

  const uniqueWords = [...new Set(cleanWords)];

  const shuffled = uniqueWords.sort(() => 0.5 - Math.random());

  const wrongOptions = shuffled.slice(0, 3);

  const allOptions = [...wrongOptions, correctWord];

  const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

  const correctIndex = shuffledOptions.indexOf(correctWord);

  return {
    options: shuffledOptions,
    correctAnswer: correctIndex,
  };
};

exports.getQuizByCode = async (req, res) => {
  try {
    const { quizCode } = req.params;

    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // IMPORTANT: Do not send correct answers to student
    const questionsWithoutAnswers = quiz.questions.map(q => ({
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      quizCode: quiz.quizCode,
      questions: questionsWithoutAnswers,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz" });
  }
};


const Attempt = require("../models/Attempt");

exports.submitAttempt = async (req, res) => {
  try {
    const { quizCode } = req.params;
    const { studentName, answers } = req.body;

    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    const attempt = new Attempt({
      quizCode,
      studentName,
      answers,
      score,
    });

    await attempt.save();

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      total: quiz.questions.length,
      percentage: ((score / quiz.questions.length) * 100).toFixed(2),
    });

  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz" });
  }
};

exports.getQuizAnalytics = async (req, res) => {
  try {
    const { quizCode } = req.params;

    const attempts = await Attempt.find({ quizCode });

    if (!attempts.length) {
      return res.status(200).json({
        totalStudents: 0,
        averageScore: 0,
      });
    }

    const totalStudents = attempts.length;

    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

    const averageScore = (totalScore / totalStudents).toFixed(2);

    res.status(200).json({
      totalStudents,
      averageScore,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
