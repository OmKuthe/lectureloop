const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  quizCode: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  answers: {
    type: [Number], // array of selected option indexes
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attempt", attemptSchema);
