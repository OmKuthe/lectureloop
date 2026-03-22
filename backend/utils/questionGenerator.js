// utils/questionGenerator.js
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

class QuestionGenerator {
  constructor() {
    this.tfidf = new natural.TfIdf();
  }

  async generateQuestions(text) {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error("No text provided for question generation");
    }
    
    // Clean and prepare text
    const cleanText = this.cleanText(text);
    const sentences = this.splitIntoSentences(cleanText);
    const paragraphs = this.splitIntoParagraphs(cleanText);
    
    // Check if we have enough content
    if (sentences.length < 3) {
      throw new Error("Not enough content to generate questions. Please provide more text.");
    }
    
    // Extract key concepts
    const keyConcepts = await this.extractKeyConcepts(cleanText);
    const importantSentences = this.getImportantSentences(sentences, keyConcepts);
    
    const questions = [];
    
    // Generate different types of questions based on available content
    if (importantSentences.length >= 2) {
      questions.push(...this.generateMCQQuestions(importantSentences, keyConcepts));
      questions.push(...this.generateTrueFalseQuestions(importantSentences));
      questions.push(...this.generateFillInBlanks(importantSentences));
      
      if (keyConcepts.length >= 4 && paragraphs.length >= 2) {
        questions.push(...this.generateMatchingQuestions(keyConcepts, paragraphs));
      }
    }
    
    // Ensure we have questions
    if (questions.length === 0) {
      throw new Error("Could not generate any questions from the provided content");
    }
    
    // Select best questions (up to 10)
    return this.selectBestQuestions(questions, Math.min(10, questions.length));
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\.\?\!]/g, '')
      .trim();
  }

  splitIntoSentences(text) {
    // Improved sentence splitting
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
    return sentences.map(s => s.trim()).filter(s => s.length > 20);
  }

  splitIntoParagraphs(text) {
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  }

  async extractKeyConcepts(text) {
    const words = tokenizer.tokenize(text.toLowerCase());
    const wordFreq = {};
    
    words.forEach(word => {
      // Remove punctuation and keep only meaningful words
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (cleanWord.length > 4 && !this.isStopWord(cleanWord)) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });
    
    // Get top 20 most frequent important words
    const concepts = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, freq]) => ({
        word,
        frequency: freq,
        importance: freq / words.length
      }));
    
    return concepts;
  }

  isStopWord(word) {
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
      'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
      'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
      'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
      'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
      'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
      'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
      'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
      'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
      'give', 'day', 'most', 'us'
    ]);
    return stopWords.has(word);
  }

  getImportantSentences(sentences, concepts) {
    const scoredSentences = sentences.map(sentence => {
      let score = 0;
      concepts.forEach(concept => {
        if (sentence.toLowerCase().includes(concept.word)) {
          score += concept.importance;
        }
      });
      return { sentence, score };
    });
    
    return scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 15) // Take top 15 sentences
      .map(item => item.sentence);
  }

  generateMCQQuestions(sentences, concepts) {
    const questions = [];
    const targetCount = Math.min(4, sentences.length);
    
    for (let i = 0; i < targetCount; i++) {
      const sentence = sentences[i];
      const relevantConcepts = concepts.filter(c => 
        sentence.toLowerCase().includes(c.word)
      );
      
      if (relevantConcepts.length > 0) {
        const concept = relevantConcepts[0];
        const context = this.getContextAroundWord(sentence, concept.word);
        
        const options = this.generatePlausibleOptions(concept, concepts, sentence);
        
        questions.push({
          type: 'mcq',
          difficulty: this.calculateDifficulty(concept),
          question: this.generateMCQQuestionText(concept, context),
          options: options,
          correctAnswer: concept.word,
          explanation: this.generateExplanation(sentence, concept),
          source: sentence
        });
      }
    }
    
    return questions;
  }

  getContextAroundWord(sentence, word) {
    const words = sentence.split(' ');
    const wordIndex = words.findIndex(w => w.toLowerCase().includes(word.toLowerCase()));
    if (wordIndex === -1) return sentence;
    
    const start = Math.max(0, wordIndex - 3);
    const end = Math.min(words.length, wordIndex + 4);
    return words.slice(start, end).join(' ');
  }

  calculateDifficulty(concept) {
    const wordLength = concept.word.length;
    const frequency = concept.frequency;
    
    if (wordLength > 10 || frequency < 2) return 'hard';
    if (wordLength > 6 || frequency < 5) return 'medium';
    return 'easy';
  }

  generateMCQQuestionText(concept, context) {
    const templates = [
      `What is the meaning of "${concept.word}" in the context: "${context}"?`,
      `Which statement best describes "${concept.word}"?`,
      `Based on the context, what does "${concept.word}" refer to?`,
      `In this passage, "${concept.word}" most likely means:`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  generatePlausibleOptions(correctConcept, allConcepts, sentence) {
    const similarConcepts = allConcepts.filter(c => 
      c.word !== correctConcept.word && 
      sentence.toLowerCase().includes(c.word)
    );
    
    const options = [correctConcept.word];
    
    // Add plausible distractors
    for (let i = 0; i < 3 && i < similarConcepts.length; i++) {
      options.push(similarConcepts[i].word);
    }
    
    // If not enough similar concepts, add random important terms
    while (options.length < 4) {
      const randomConcept = allConcepts[Math.floor(Math.random() * allConcepts.length)];
      if (randomConcept && !options.includes(randomConcept.word)) {
        options.push(randomConcept.word);
      }
    }
    
    return this.shuffleArray(options);
  }

  generateTrueFalseQuestions(sentences) {
    const questions = [];
    const targetCount = Math.min(2, sentences.length);
    
    for (let i = 0; i < targetCount; i++) {
      const sentence = sentences[i];
      const isTrue = Math.random() > 0.5;
      let statement;
      
      if (isTrue) {
        statement = sentence;
      } else {
        const words = sentence.split(' ');
        const keyWords = words.filter(w => w.length > 5);
        if (keyWords.length > 0) {
          const wordToReplace = keyWords[Math.floor(Math.random() * keyWords.length)];
          const replacement = this.getFalseReplacement(wordToReplace);
          statement = sentence.replace(wordToReplace, replacement);
        } else {
          statement = sentence;
        }
      }
      
      questions.push({
        type: 'truefalse',
        difficulty: 'easy',
        question: `Is the following statement true or false? "${statement}"`,
        correctAnswer: isTrue,
        explanation: this.generateTrueFalseExplanation(sentence, statement, isTrue),
        source: sentence
      });
    }
    
    return questions;
  }

  getFalseReplacement(word) {
    const replacements = {
      'increases': 'decreases',
      'important': 'unimportant',
      'significant': 'insignificant',
      'positive': 'negative',
      'always': 'never',
      'good': 'bad',
      'high': 'low',
      'large': 'small',
      'fast': 'slow'
    };
    return replacements[word.toLowerCase()] || `not ${word}`;
  }

  generateFillInBlanks(sentences) {
    const questions = [];
    const targetCount = Math.min(2, sentences.length);
    
    for (let i = 0; i < targetCount; i++) {
      const sentence = sentences[i];
      const words = sentence.split(' ');
      const keyWords = words.filter(w => w.length > 5);
      
      if (keyWords.length > 0) {
        const blankWord = keyWords[Math.floor(Math.random() * keyWords.length)];
        const blankedSentence = sentence.replace(blankWord, '______');
        
        questions.push({
          type: 'fillblank',
          difficulty: 'medium',
          question: blankedSentence,
          correctAnswer: blankWord,
          contextClues: this.findContextClues(sentence, blankWord),
          explanation: `The correct answer is "${blankWord}" based on the context of the passage.`,
          source: sentence
        });
      }
    }
    
    return questions;
  }

  findContextClues(sentence, blankWord) {
    const words = sentence.split(' ');
    const blankIndex = words.findIndex(w => w === blankWord);
    if (blankIndex === -1) return sentence;
    
    const start = Math.max(0, blankIndex - 2);
    const end = Math.min(words.length, blankIndex + 3);
    const clues = [...words.slice(start, end)];
    const relativeIndex = blankIndex - start;
    if (relativeIndex >= 0 && relativeIndex < clues.length) {
      clues[relativeIndex] = '______';
    }
    return clues.join(' ');
  }

  generateMatchingQuestions(concepts, paragraphs) {
    const questions = [];
    
    if (concepts.length >= 4) {
      const terms = concepts.slice(0, 4).map(c => c.word);
      const definitions = terms.map(term => {
        const relevantParagraph = paragraphs.find(p => 
          p.toLowerCase().includes(term.toLowerCase())
        );
        return this.extractDefinition(relevantParagraph || '', term);
      });
      
      questions.push({
        type: 'matching',
        difficulty: 'hard',
        terms: terms,
        definitions: definitions,
        question: 'Match each term with its correct definition:',
        correctMatches: terms.map((_, idx) => idx)
      });
    }
    
    return questions;
  }

  extractDefinition(text, term) {
    const sentences = this.splitIntoSentences(text);
    const relevantSentence = sentences.find(s => 
      s.toLowerCase().includes(term.toLowerCase())
    );
    
    if (relevantSentence) {
      const definitionPatterns = [
        /(?:is|are|means|refers to|defined as) ([^\.]+)/i,
        /(?:which is|that is) ([^\.]+)/i,
        new RegExp(`${term} ([^\.]+)`, 'i')
      ];
      
      for (const pattern of definitionPatterns) {
        const match = relevantSentence.match(pattern);
        if (match) return match[1].trim();
      }
      
      return relevantSentence;
    }
    
    return `Definition for ${term}`;
  }

  generateExplanation(sentence, concept) {
    return `The term "${concept.word}" is explained in the text: "${sentence.substring(0, 100)}..."`;
  }

  generateTrueFalseExplanation(original, modified, isTrue) {
    if (isTrue) {
      return `This statement is true as stated in the original text.`;
    } else {
      return `This statement is false. The original text states: "${original}"`;
    }
  }

  selectBestQuestions(questions, count) {
    const scoredQuestions = questions.map(q => ({
      ...q,
      score: this.scoreQuestionQuality(q)
    }));
    
    return scoredQuestions
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(({ score, ...question }) => question);
  }

  scoreQuestionQuality(question) {
    let score = 0;
    
    if (question.question && question.question.length > 20) score += 1;
    if (question.explanation && question.explanation.length > 30) score += 1;
    if (question.difficulty === 'hard') score += 2;
    if (question.difficulty === 'medium') score += 1;
    if (question.type === 'mcq') score += 2;
    if (question.type === 'truefalse') score += 1;
    if (question.options && question.options.length >= 3) score += 1;
    
    return score;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

module.exports = QuestionGenerator;