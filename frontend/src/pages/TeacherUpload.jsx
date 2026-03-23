import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import { FaUpload, FaFileAlt, FaArrowLeft, FaChartLine, FaMagic, FaRocket } from "react-icons/fa";

function TeacherUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [quizCode, setQuizCode] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/api/quiz/create", formData);
      setQuizCode(res.data.quizCode);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
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
            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FaUpload className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Upload Lecture Notes
            </span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Upload your PDF lecture notes and let our AI generate smart questions automatically
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            
            {/* File Input Area */}
            <div className="mb-6">
              <label className="block text-white/80 mb-3 font-medium">Select PDF File</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-purple-400 transition-all duration-300 bg-white/5 hover:bg-white/10"
                >
                  <FaFileAlt className="w-12 h-12 text-white/60 mb-3" />
                  <span className="text-white/70 text-sm">
                    {file ? file.name : "Click or drag to upload PDF"}
                  </span>
                  {file && (
                    <span className="text-purple-300 text-xs mt-2">
                      ✓ File selected
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                !file || isUploading
                  ? "bg-gray-500/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg"
              }`}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <FaMagic className="w-5 h-5" />
                  Generate AI Quiz
                </>
              )}
            </motion.button>

            {/* Quiz Code Result */}
            {quizCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/50 text-center"
              >
                <p className="text-white/80 text-sm mb-2">🎉 Quiz Generated Successfully!</p>
                <p className="text-white/60 text-sm mb-3">Share this code with your students:</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  {quizCode}
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigator.clipboard.writeText(quizCode);
                      alert("Quiz code copied to clipboard!");
                    }}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-all duration-300 text-sm"
                  >
                    Copy Code
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/dashboard/${quizCode}`)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <FaChartLine className="w-4 h-4" />
                    View Dashboard
                  </motion.button>
                </div>
              </motion.div>
            )}
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
            <FaMagic className="text-purple-300 w-5 h-5" />
            <span className="text-white/80 text-sm">AI-Powered Questions</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 flex items-center gap-3 border border-white/20">
            <FaRocket className="text-pink-300 w-5 h-5" />
            <span className="text-white/80 text-sm">Instant Generation</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 flex items-center gap-3 border border-white/20">
            <FaChartLine className="text-blue-300 w-5 h-5" />
            <span className="text-white/80 text-sm">Real-time Analytics</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default TeacherUpload;