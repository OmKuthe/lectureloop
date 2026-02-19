const Quiz = require("../models/Quiz");
const generateQuizCode = require("../utils/generateQuizCode");
const fs = require("fs");
const pdfParse = require("pdf-parse");




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
    const correctWordIndex = Math.floor(Math.random() * words.length);

    const correctWord = words[correctWordIndex];

    const questionText = sentence.replace(
      correctWord,
      "______"
    );

    const options = generateOptions(correctWord, words);

    questions.push({
      question: questionText,
      options: options.options,
      correctAnswer: options.correctIndex,
    });
  }

  return questions;
};
const generateOptions = (correctWord, words) => {
  const uniqueWords = [...new Set(words)].filter(
    w => w.length > 3 && w !== correctWord
  );

  const shuffled = uniqueWords.sort(() => 0.5 - Math.random());

  const wrongOptions = shuffled.slice(0, 3);

  const allOptions = [...wrongOptions, correctWord];

  const shuffledOptions = allOptions.sort(() => 0.5 - Math.random());

  const correctIndex = shuffledOptions.indexOf(correctWord);

  return {
    options: shuffledOptions,
    correctIndex,
  };
};