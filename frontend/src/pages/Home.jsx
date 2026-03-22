  // pages/Home.jsx
  import { useNavigate } from "react-router-dom";
  import { motion } from "framer-motion";
  import { useState } from "react";
  import { 
    FaChalkboardTeacher, 
    FaUserGraduate, 
    FaBrain, 
    FaRocket, 
    FaArrowRight, 
    FaMagic, 
    FaChartLine 
  } from "react-icons/fa";

  function Home() {
    const navigate = useNavigate();

    const features = [
      {
        icon: <FaBrain className="w-6 h-6" />,
        title: "AI-Powered",
        description: "Smart questions from your lectures",
        color: "from-purple-400 to-pink-400"
      },
      {
        icon: <FaChartLine className="w-6 h-6" />,
        title: "Instant Results",
        description: "Real-time student analytics",
        color: "from-blue-400 to-cyan-400"
      },
      {
        icon: <FaMagic className="w-6 h-6" />,
        title: "Easy Setup",
        description: "Upload PDF, get quiz code",
        color: "from-orange-400 to-red-400"
      }
    ];

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
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 min-h-screen flex flex-col items-center justify-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 md:mb-8"
          >
            <span className="inline-block px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-white/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              ✨ AI-Powered Learning Platform ✨
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-4 md:mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
              LectureLoop
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 text-center max-w-2xl mb-10 md:mb-16 leading-relaxed px-4"
          >
            Transform your lectures into interactive quizzes with AI. 
            Upload your notes, generate questions, and track student understanding instantly.
          </motion.p>

          {/* Features Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 md:mb-20"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                className="group relative bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 md:px-6 md:py-4 flex items-center gap-3 border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className={`text-transparent bg-gradient-to-r ${feature.color} bg-clip-text group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm md:text-base">{feature.title}</div>
                  <div className="text-xs md:text-sm text-white/70">{feature.description}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-5xl px-4"
          >
            {/* Create Quiz Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => navigate("/create")}
              className="flex-1 bg-white rounded-2xl p-6 md:p-8 cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-300 group"
            >
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaChalkboardTeacher className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </motion.div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Create Quiz</h2>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">
                  Upload your lecture notes (PDF) and let AI generate smart questions automatically
                </p>
                <div className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all duration-300 text-sm md:text-base">
                  Get Started <FaArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>
            </motion.div>

            {/* Join Quiz Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => navigate("/join")}
              className="flex-1 bg-white rounded-2xl p-6 md:p-8 cursor-pointer shadow-2xl hover:shadow-3xl transition-all duration-300 group"
            >
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaUserGraduate className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </motion.div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Join Quiz</h2>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">
                  Enter the quiz code from your teacher and test your understanding
                </p>
                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300 text-sm md:text-base">
                  Enter Code <FaArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 md:mt-20 pt-6 md:pt-8 border-t border-white/20 text-center"
          >
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-white/60">
              <span className="flex items-center gap-2">🚀 10,000+ Quizzes Created</span>
              <span className="flex items-center gap-2">⚡ 2 Second Generation</span>
              <span className="flex items-center gap-2">📊 Real-time Analytics</span>
              <span className="flex items-center gap-2">🎯 98% Accuracy</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  export default Home;