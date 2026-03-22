// models/Quiz.js - With pre-save validation
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'mcq'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  explanation: {
    type: String
  },
  source: {
    type: String
  }
});

const quizSchema = new mongoose.Schema({
  quizCode: {
    type: String,
    required: true,
    unique: true
  },
  questions: [questionSchema],
  metadata: {
    generatedAt: Date,
    generatedBy: String,
    questionCount: Number,
    types: mongoose.Schema.Types.Mixed,
    difficulties: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save validation
quizSchema.pre('save', function(next) {
  // Validate each question has exactly 4 options
  for (let i = 0; i < this.questions.length; i++) {
    const q = this.questions[i];
    if (!q.options || q.options.length !== 4) {
      next(new Error(`Question ${i + 1} must have exactly 4 options. Found: ${q.options?.length || 0}`));
      return;
    }
    
    // Validate correctAnswer is within range
    if (q.correctAnswer < 0 || q.correctAnswer > 3) {
      next(new Error(`Question ${i + 1} has invalid correctAnswer index: ${q.correctAnswer}`));
      return;
    }
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);