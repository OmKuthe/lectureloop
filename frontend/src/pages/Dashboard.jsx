// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUsers, 
  FaChartLine, 
  FaArrowLeft, 
  FaTrophy, 
  FaUserGraduate,
  FaMedal,
  FaStar,
  FaDownload,
  FaShare,
  FaBrain,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import API from "../services/api";

function Dashboard() {
  const { quizCode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const calculatePercentage = (score, totalQuestions) => {
    if (!totalQuestions || totalQuestions === 0) return 0;
    return Math.round((score / totalQuestions) * 100);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/quiz/${quizCode}/analytics`);
        
        const processedData = {
          ...res.data,
          attempts: (res.data.attempts || res.data.recentAttempts || []).map(attempt => ({
            ...attempt,
            percentage: attempt.percentage || calculatePercentage(attempt.score, res.data.totalQuestions || 10)
          }))
        };
        
        setData(processedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Poll for updates every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [quizCode]);

  const copyQuizCode = () => {
    navigator.clipboard.writeText(quizCode);
    alert("Quiz code copied to clipboard!");
  };

  const downloadReport = () => {
    if (!data?.attempts?.length) {
      alert("No data to download");
      return;
    }
    
    // Create a report in CSV format
    const headers = ["Student Name", "Score", "Total Questions", "Percentage", "Passed"];
    const rows = data.attempts.map(student => [
      student.studentName,
      student.score,
      data.totalQuestions || 10,
      `${student.percentage}%`,
      student.passed ? "Yes" : "No"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${quizCode}-results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          <p className="text-white mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 max-w-md">
          <FaTimesCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return "text-green-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 70) return "bg-green-500/20 border-green-500/30";
    if (percentage >= 50) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  const attempts = data.attempts || data.recentAttempts || [];

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
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </motion.button>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyQuizCode}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <FaShare className="w-4 h-4" />
                <span className="text-sm">Share Code: {quizCode}</span>
              </motion.button>
              
              {attempts.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadReport}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <FaDownload className="w-4 h-4" />
                  <span className="text-sm">Download Report</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Teacher Dashboard
              </span>
            </h1>
            <p className="text-white/80">Quiz Code: <span className="font-mono font-bold text-purple-300">{quizCode}</span></p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <FaUsers className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-white">{data.totalStudents || 0}</span>
              </div>
              <h3 className="text-white/70 text-sm">Total Students</h3>
              <p className="text-white/40 text-xs mt-2">Students who attempted the quiz</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <FaChartLine className="w-8 h-8 text-blue-400" />
                <span className={`text-3xl font-bold ${getScoreColor(data.averageScore || 0)}`}>
                  {data.averageScore || 0}%
                </span>
              </div>
              <h3 className="text-white/70 text-sm">Average Score</h3>
              <p className="text-white/40 text-xs mt-2">Class performance average</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <FaTrophy className="w-8 h-8 text-yellow-400" />
                <span className={`text-3xl font-bold ${getScoreColor(data.topScore || data.highestScore || 0)}`}>
                  {data.topScore || data.highestScore || 0}/{data.totalQuestions || 10}
                </span>
              </div>
              <h3 className="text-white/70 text-sm">Top Score</h3>
              <p className="text-white/40 text-xs mt-2">Highest score in the class</p>
            </motion.div>
          </div>

          {/* Student Results Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaUserGraduate className="text-purple-400" />
              Student Performance
            </h2>
            
            {attempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Student Name</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Score</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Percentage</th>
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {attempts.map((student, idx) => {
                        // Calculate percentage if not already present
                        const percentage = student.percentage || 
                          calculatePercentage(student.score, data.totalQuestions || 10);
                        const passed = percentage >= 70;
                        
                        return (
                          <motion.tr
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-white/10 hover:bg-white/5 transition-all duration-300"
                          >
                            <td className="py-3 px-4">
                              {idx === 0 && <FaMedal className="text-yellow-400 w-5 h-5" />}
                              {idx === 1 && <FaMedal className="text-gray-400 w-5 h-5" />}
                              {idx === 2 && <FaMedal className="text-amber-600 w-5 h-5" />}
                              {idx > 2 && <span className="text-white/40">{idx + 1}</span>}
                            </td>
                            <td className="py-3 px-4 text-white font-medium">{student.studentName}</td>
                            <td className="py-3 px-4 text-white">{student.score}/{data.totalQuestions || 10}</td>
                            <td className="py-3 px-4">
                              <span className={`font-bold ${getScoreColor(percentage)}`}>
                                {percentage}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getScoreBgColor(percentage)}`}>
                                {passed ? (
                                  <>
                                    <FaCheckCircle className="w-3 h-3" />
                                    Passed
                                  </>
                                ) : (
                                  <>
                                    <FaTimesCircle className="w-3 h-3" />
                                    Needs Improvement
                                  </>
                                )}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUserGraduate className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50">No students have attempted this quiz yet</p>
                <p className="text-white/40 text-sm mt-2">Share the quiz code to get started!</p>
              </div>
            )}
          </motion.div>

          {/* Question Analysis (if available) */}
          {data.questionAnalysis && data.questionAnalysis.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FaBrain className="text-purple-400" />
                Question Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.questionAnalysis.map((q, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70 text-sm">Question {q.questionIndex + 1}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        q.difficultyLevel === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        q.difficultyLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {q.difficultyLevel}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                        style={{ width: `${q.successRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-white/40 text-xs">Success Rate</span>
                      <span className="text-white/60 text-xs">{q.successRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaBrain className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Questions</div>
              <div className="text-white font-bold">{data.totalQuestions || 10}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaClock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Pass Rate</div>
              <div className="text-white font-bold">{data.passRate || 0}%</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaStar className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Avg. Score</div>
              <div className="text-white font-bold">{data.averageScore || 0}%</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaMedal className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Top Performer</div>
              <div className="text-white font-bold truncate">
                {attempts[0]?.studentName || "N/A"}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;