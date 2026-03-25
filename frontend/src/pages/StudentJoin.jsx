import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserGraduate, FaArrowLeft, FaPlay, FaQrcode, FaUsers } from "react-icons/fa";

function StudentJoin() {
  const [quizCode, setQuizCode] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

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

  const handleJoin = () => {
    if (!quizCode || !name) {
      alert("Please enter both quiz code and your name");
      return;
    }
    navigate(`/quiz/${quizCode}`, {
      state: { studentName: name }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && quizCode && name) {
      handleJoin();
    }
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

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FaUserGraduate className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Join a Quiz
            </span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Enter your quiz code and name to start testing your knowledge
          </p>
        </motion.div>

        {/* Join Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            
            {/* Quiz Code Input */}
            <div className="mb-6">
              <label className="block text-white/80 mb-3 font-medium flex items-center gap-2">
                <FaQrcode className="w-4 h-4" />
                Quiz Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-300"
                maxLength={6}
                autoFocus
              />
              <p className="text-white/40 text-xs mt-2">Example: ABC123</p>
            </div>

            {/* Student Name Input */}
            <div className="mb-8">
              <label className="block text-white/80 mb-3 font-medium flex items-center gap-2">
                <FaUsers className="w-4 h-4" />
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-300"
              />
              <p className="text-white/40 text-xs mt-2">This is how you'll appear in the quiz</p>
            </div>

            {/* Join Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              disabled={!quizCode || !name}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                !quizCode || !name
                  ? "bg-gray-500/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg"
              }`}
            >
              <FaPlay className="w-4 h-4" />
              Join Quiz
            </motion.button>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-white/40 text-xs">
                Don't have a quiz code? Ask your teacher to create one
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 flex items-center gap-3 border border-white/20">
            <FaPlay className="text-blue-300 w-5 h-5" />
            <span className="text-white/80 text-sm">Real-time Questions</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 flex items-center gap-3 border border-white/20">
            <FaUsers className="text-purple-300 w-5 h-5" />
            <span className="text-white/80 text-sm">Live Leaderboard</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 flex items-center gap-3 border border-white/20">
            <FaQrcode className="text-pink-300 w-5 h-5" />
            <span className="text-white/80 text-sm">Instant Results</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentJoin;