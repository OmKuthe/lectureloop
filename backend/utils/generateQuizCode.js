const generateQuizCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `LL${randomNum}`;
  };
  
  module.exports = generateQuizCode;
  