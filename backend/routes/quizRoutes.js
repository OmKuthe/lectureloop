const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { createQuiz, getQuizByCode } = require("../controllers/quizController");
const { submitAttempt } = require("../controllers/quizController");
const { getQuizAnalytics } = require("../controllers/quizController");

router.get("/:quizCode/analytics", getQuizAnalytics);
router.post("/create", upload.single("file"), createQuiz);
router.get("/:quizCode", getQuizByCode);
router.post("/:quizCode/submit", submitAttempt);


module.exports = router;
