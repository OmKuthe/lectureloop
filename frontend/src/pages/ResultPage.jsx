// pages/ResultPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  FaTrophy, 
  FaChartLine, 
  FaBook, 
  FaRedo, 
  FaHome,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaMedal
} from 'react-icons/fa';
import AnimatedButton from "../components/UI/AnimatedButton";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;
  const [count, setCount] = useState(0);

  // Generate random positions and animations for bubbles
  const generateBubbles = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      left: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      xOffset: Math.random() * 40 - 20
    }));
  };

  const [bubbles] = useState(generateBubbles);

  useEffect(() => {
    if (!result) {
      navigate("/");
      return;
    }

    // Trigger confetti on successful completion
    if (result.passed) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec489a', '#3b82f6', '#10b981']
      });
      
      // Second burst for extra celebration
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.3 },
          colors: ['#f59e0b', '#ef4444', '#8b5cf6']
        });
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5, x: 0.7 },
          colors: ['#f59e0b', '#ef4444', '#8b5cf6']
        });
      }, 200);
    }

    // Animate score counting
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = result.percentage / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= result.percentage) {
        setCount(result.percentage);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [result, navigate]);

  if (!result) return null;

  const getScoreMessage = () => {
    if (result.percentage >= 90) return "Outstanding! You're a star student! ⭐";
    if (result.percentage >= 70) return "Great job! You really know your stuff! 🎉";
    if (result.percentage >= 50) return "Good effort! Keep practicing to improve! 📚";
    if (result.percentage >= 30) return "Nice try! Review the material and try again! 💪";
    return "Don't give up! Every mistake is a learning opportunity! 🌱";
  };

  const getScoreColor = () => {
    if (result.percentage >= 70) return "from-green-500 to-emerald-500";
    if (result.percentage >= 50) return "from-blue-500 to-cyan-500";
    if (result.percentage >= 30) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      
      {/* Grid Pattern Background */}
      <div
  className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)"/%3E%3C/svg%3E')] opacity-50`}
/>
      
      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute bg-gradient-to-br from-white/10 to-white/5 rounded-full backdrop-blur-sm"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              bottom: "-20%"
            }}
            animate={{
              y: ["0%", "-120%"],
              x: [0, bubble.xOffset, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Wave Border */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 text-center border border-white/20"
          >
            <div className="mb-6">
              {result.passed ? (
                <motion.div
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 360, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <FaTrophy className="w-20 h-20 text-yellow-400 mx-auto drop-shadow-lg" />
                </motion.div>
              ) : (
                <FaBook className="w-20 h-20 text-blue-400 mx-auto" />
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {result.passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
            </h1>
            
            <div className="relative inline-block mb-6">
              <div className={`text-8xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
                {count}%
              </div>
              <div className="text-white/60 mt-2">
                {result.score} out of {result.total} correct
              </div>
            </div>
            
            <p className="text-xl text-white/80 mb-8">
              {getScoreMessage()}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-green-500/20 backdrop-blur-sm p-4 rounded-xl border border-green-500/30"
              >
                <div className="text-3xl font-bold text-green-400">{result.score}</div>
                <div className="text-sm text-white/70">Correct Answers</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-red-500/30"
              >
                <div className="text-3xl font-bold text-red-400">{result.total - result.score}</div>
                <div className="text-sm text-white/70">Wrong Answers</div>
              </motion.div>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <AnimatedButton onClick={() => navigate("/")} variant="primary">
                <FaHome className="inline mr-2" />
                Back to Home
              </AnimatedButton>
              <AnimatedButton onClick={() => navigate("/join")} variant="outline">
                <FaRedo className="inline mr-2" />
                Try Another Quiz
              </AnimatedButton>
            </div>
          </motion.div>

          {/* Detailed Results */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <FaChartLine className="text-purple-400" />
              Detailed Analysis
            </h2>
            
            <div className="space-y-4">
              {result.detailedResults?.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-xl backdrop-blur-sm border-l-4 ${
                    item.isCorrect 
                      ? 'bg-green-500/10 border-green-500' 
                      : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.isCorrect ? (
                      <FaCheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                      <FaTimesCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-white/60">Question {idx + 1}</span>
                        {item.isCorrect && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            Correct
                          </span>
                        )}
                      </div>
                      <p className="text-white mb-2">{item.questionText}</p>
                      {!item.isCorrect && (
                        <div className="text-sm text-green-400 mt-2 p-2 bg-green-500/10 rounded-lg">
                          <strong>Correct Answer:</strong> {item.correctAnswer}
                        </div>
                      )}
                      {item.explanation && (
                        <div className="text-sm text-white/60 mt-2 flex items-start gap-1">
                          <span>📖</span>
                          <span>{item.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Performance Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="text-white/80 text-sm">Keep practicing!</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMedal className="text-purple-400" />
                <span className="text-white/80 text-sm">Try to beat your score!</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;