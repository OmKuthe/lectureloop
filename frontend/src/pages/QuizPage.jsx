// pages/QuizPage.jsx - Enhanced with animations
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiXCircle, FiArrowLeft, FiUser } from 'react-icons/fi';
import API from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";

function QuizPage() {
  const { quizCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const studentName = location.state?.studentName;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeUp, setTimeUp] = useState(false);

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
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/api/quiz/${quizCode}`);
        setQuestions(res.data.questions || []);
        setAnswers(new Array(res.data.questions?.length || 0).fill(null));
      } catch (error) {
        toast.error("Failed to load quiz");
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizCode, navigate]);

  useEffect(() => {
    if (timer === 0 && !loading && selectedAnswer === null) {
      setTimeUp(true);
      toast.error("Time's up! Moving to next question");
      setTimeout(() => {
        handleNext(null);
        setTimeUp(false);
      }, 1500);
      return;
    }

    if (selectedAnswer !== null) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, loading, selectedAnswer]);

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    toast.success("Answer saved!", { 
      duration: 1000,
      icon: '✓'
    });
    
    setTimeout(() => {
      handleNext(answerIndex);
    }, 800);
  };

  const handleNext = (answerIndex) => {
    const newAnswers = [...answers];
    if (answerIndex !== null) {
      newAnswers[current] = answerIndex;
    }
    setAnswers(newAnswers);
    
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelectedAnswer(null);
      setTimer(15);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const res = await API.post(`/api/quiz/${quizCode}/submit`, {
        studentName,
        answers: finalAnswers
      });
      navigate("/result", { state: res.data });
    } catch (error) {
      toast.error("Failed to submit quiz");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your quiz..." />;
  }

  const currentQuestion = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

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

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm">Exit Quiz</span>
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            >
              <FiUser className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/80">{studentName}</span>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between text-white mb-2">
              <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                Question {current + 1} of {questions.length}
              </span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm ${
                timer <= 5 ? 'bg-red-500/30 animate-pulse' : 'bg-white/10'
              }`}>
                <FiClock className="w-4 h-4" />
                <span className="font-mono font-bold">{timer}s</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                initial={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Timer Bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors ${
                  timer <= 5 ? 'bg-red-500' : 'bg-yellow-400'
                }`}
                initial={{ width: "100%" }}
                animate={{ width: `${(timer / 15) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
            >
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
                  Multiple Choice Question
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options?.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const letter = String.fromCharCode(65 + idx);
                  
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: isSelected ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 text-left rounded-xl transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                          : 'bg-white/5 hover:bg-white/20 border border-white/20 text-white'
                      } ${selectedAnswer !== null && !isSelected ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-bold w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected 
                            ? 'bg-white/20' 
                            : 'bg-white/10'
                        }`}>
                          {letter}
                        </span>
                        <span className="flex-1">{option}</span>
                        {isSelected && (
                          <FiCheckCircle className="w-5 h-5" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Time up indicator */}
              <AnimatePresence>
                {timeUp && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-center"
                  >
                    <FiXCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <p className="text-white">Time's up! Moving to next question...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
          
          {/* Progress Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === current
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 w-4'
                      : answers[idx] !== null
                      ? 'bg-green-400'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;