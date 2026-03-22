// services/fallbackService.js
class FallbackService {
    generateFallbackQuestions(text) {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 30);
      const questions = [];
      
      for (let i = 0; i < Math.min(10, sentences.length); i++) {
        const sentence = sentences[i].trim();
        const words = sentence.split(' ');
        const keywords = words.filter(w => w.length > 6);
        
        if (keywords.length > 0) {
          const keyword = keywords[0];
          questions.push({
            type: 'mcq',
            difficulty: 'medium',
            question: `What is the meaning of "${keyword}" in this context?`,
            options: [
              keyword,
              "A related concept",
              "An unrelated term", 
              "None of the above"
            ],
            correctAnswer: 0,
            explanation: `Based on the text: "${sentence.substring(0, 100)}..."`
          });
        }
      }
      
      return questions;
    }
  }
  
  module.exports = new FallbackService();