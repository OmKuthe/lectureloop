// utils/questionQuality.js
class QuestionQualityMetrics {
    static evaluateQuestion(question, text) {
      const metrics = {
        clarity: this.evaluateClarity(question.question),
        relevance: this.evaluateRelevance(question, text),
        difficulty: question.difficulty,
        distractorQuality: this.evaluateDistractors(question.options, question.correctAnswer)
      };
      
      return {
        ...metrics,
        overall: Object.values(metrics).reduce((a, b) => a + b, 0) / 4
      };
    }
    
    static evaluateClarity(questionText) {
      // Check if question is clear and well-formed
      const hasQuestionMark = questionText.includes('?');
      const isProperLength = questionText.length > 15 && questionText.length < 200;
      return (hasQuestionMark && isProperLength) ? 1 : 0.5;
    }
    
    static evaluateRelevance(question, text) {
      // Check if question is relevant to the text
      const keywords = question.question.toLowerCase().split(' ');
      const relevantKeywords = keywords.filter(k => 
        text.toLowerCase().includes(k) && k.length > 3
      );
      return relevantKeywords.length / Math.min(keywords.length, 5);
    }
    
    static evaluateDistractors(options, correctAnswer) {
      if (!options) return 1;
      
      const wrongOptions = options.filter((_, idx) => idx !== correctAnswer);
      const uniqueWrongOptions = new Set(wrongOptions);
      
      // Good distractors are unique and plausible
      return uniqueWrongOptions.size === wrongOptions.length ? 1 : 0.7;
    }
  }