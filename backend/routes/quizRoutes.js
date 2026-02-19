const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { createQuiz } = require("../controllers/quizController");

router.post("/create", upload.single("file"), createQuiz);

module.exports = router;
