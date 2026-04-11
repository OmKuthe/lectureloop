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
  FaTimesCircle,
  FaChartBar,
  FaChartPie,
  FaChartArea,
  FaFilter,
  FaSortAmountDown,
  FaExclamationTriangle,
  FaLightbulb,
  FaPercentage,
  FaHistory
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import API from "../services/api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

function Dashboard() {
  const { quizCode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filterPassing, setFilterPassing] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [timeRange, setTimeRange] = useState('all'); // all, week, month

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
        
        // Process the data to add calculated fields
        const totalQuestions = res.data.questionAnalysis?.length || 10;
        const processedAttempts = (res.data.attempts || []).map(attempt => ({
          ...attempt,
          percentage: attempt.percentage || calculatePercentage(attempt.score, totalQuestions)
        }));
        
        // Calculate additional stats
        const sortedAttempts = [...processedAttempts].sort((a, b) => b.percentage - a.percentage);
        const medianScore = processedAttempts.length > 0 
          ? processedAttempts[Math.floor(processedAttempts.length / 2)]?.percentage || 0
          : 0;
        
        // Calculate score distribution
        const scoreDistribution = {
          '0-20': 0,
          '21-40': 0,
          '41-60': 0,
          '61-80': 0,
          '81-100': 0
        };
        
        processedAttempts.forEach(student => {
          const percentage = student.percentage;
          if (percentage <= 20) scoreDistribution['0-20']++;
          else if (percentage <= 40) scoreDistribution['21-40']++;
          else if (percentage <= 60) scoreDistribution['41-60']++;
          else if (percentage <= 80) scoreDistribution['61-80']++;
          else scoreDistribution['81-100']++;
        });
        
        setData({
          ...res.data,
          totalQuestions,
          attempts: processedAttempts,
          sortedAttempts,
          medianScore,
          scoreDistribution,
          totalStudents: res.data.totalStudents || processedAttempts.length
        });
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
    
    // Create detailed HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quiz Report - ${quizCode}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          h1 { color: #333; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #7c3aed; color: white; }
          .passed { color: #10b981; font-weight: bold; }
          .failed { color: #ef4444; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Quiz Report - Code: ${quizCode}</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          
          <div class="stats">
            <div class="stat-card">
              <h3>Total Students</h3>
              <p style="font-size: 24px; margin: 10px 0;">${data.totalStudents}</p>
            </div>
            <div class="stat-card">
              <h3>Average Score</h3>
              <p style="font-size: 24px; margin: 10px 0;">${data.averageScore}%</p>
            </div>
            <div class="stat-card">
              <h3>Pass Rate</h3>
              <p style="font-size: 24px; margin: 10px 0;">${data.passRate}%</p>
            </div>
            <div class="stat-card">
              <h3>Top Score</h3>
              <p style="font-size: 24px; margin: 10px 0;">${data.topScore}/${data.totalQuestions}</p>
            </div>
          </div>
          
          <h2>Student Results</h2>
          <table>
            <thead>
              <tr><th>Rank</th><th>Student Name</th><th>Score</th><th>Percentage</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${data.attempts.map((student, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${student.studentName}</td>
                  <td>${student.score}/${data.totalQuestions}</td>
                  <td>${student.percentage}%</td>
                  <td class="${student.percentage >= 70 ? 'passed' : 'failed'}">${student.percentage >= 70 ? 'Passed' : 'Failed'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${data.questionAnalysis ? `
            <h2>Question Analysis</h2>
            <table>
              <thead>
                <tr><th>Question</th><th>Type</th><th>Difficulty</th><th>Success Rate</th></tr>
              </thead>
              <tbody>
                ${data.questionAnalysis.map((q, idx) => `
                  <tr>
                    <td>Question ${idx + 1}</td>
                    <td>${q.type}</td>
                    <td>${q.difficulty || q.difficultyLevel}</td>
                    <td>${q.successRate}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${quizCode}-report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!data?.attempts?.length) return;
    
    const headers = ["Rank", "Student Name", "Score", "Total Questions", "Percentage", "Passed", "Completed At"];
    const rows = data.attempts.map((student, idx) => [
      idx + 1,
      student.studentName,
      student.score,
      data.totalQuestions,
      `${student.percentage}%`,
      student.percentage >= 70 ? "Yes" : "No",
      new Date(student.completedAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
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

  // Prepare chart data for score distribution
  const getScoreDistributionData = () => {
    if (!data?.scoreDistribution) return null;
    
    return {
      labels: Object.keys(data.scoreDistribution),
      datasets: [
        {
          label: 'Number of Students',
          data: Object.values(data.scoreDistribution),
          backgroundColor: 'rgba(139, 92, 246, 0.6)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 2,
          borderRadius: 10,
        },
      ],
    };
  };

  // Prepare chart data for question difficulty
  const getDifficultyData = () => {
    if (!data?.questionAnalysis?.length) return null;
    
    const difficultyCount = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };
    
    data.questionAnalysis.forEach(q => {
      const level = q.difficultyLevel || (q.successRate > 70 ? 'Easy' : q.successRate > 40 ? 'Medium' : 'Hard');
      if (level === 'Easy') difficultyCount.Easy++;
      else if (level === 'Medium') difficultyCount.Medium++;
      else if (level === 'Hard') difficultyCount.Hard++;
    });
    
    return {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          data: [difficultyCount.Easy, difficultyCount.Medium, difficultyCount.Hard],
          backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(234, 179, 8, 0.6)', 'rgba(239, 68, 68, 0.6)'],
          borderColor: ['rgb(34, 197, 94)', 'rgb(234, 179, 8)', 'rgb(239, 68, 68)'],
          borderWidth: 2,
        },
      ],
    };
  };

  // Prepare chart data for question success rates
  const getQuestionSuccessData = () => {
    if (!data?.questionAnalysis?.length) return null;
    
    return {
      labels: data.questionAnalysis.map((_, idx) => `Q${idx + 1}`),
      datasets: [
        {
          label: 'Success Rate (%)',
          data: data.questionAnalysis.map(q => parseFloat(q.successRate)),
          backgroundColor: 'rgba(168, 85, 247, 0.6)',
          borderColor: 'rgba(168, 85, 247, 1)',
          borderWidth: 2,
          borderRadius: 10,
        },
      ],
    };
  };

  // Prepare chart data for performance trend
  const getPerformanceTrendData = () => {
    if (!data?.sortedAttempts?.length) return null;
    
    return {
      labels: data.sortedAttempts.map((_, idx) => `Student ${idx + 1}`),
      datasets: [
        {
          label: 'Score Percentage',
          data: data.sortedAttempts.map(s => s.percentage),
          borderColor: 'rgba(139, 92, 246, 1)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(139, 92, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverRadius: 8,
        },
      ],
    };
  };

  // Filter and sort attempts
  const getFilteredAndSortedAttempts = () => {
    if (!data?.attempts) return [];
    
    let filtered = [...data.attempts];
    
    if (filterPassing === 'passed') {
      filtered = filtered.filter(s => s.percentage >= 70);
    } else if (filterPassing === 'failed') {
      filtered = filtered.filter(s => s.percentage < 70);
    }
    
    if (timeRange !== 'all') {
      const now = new Date();
      const rangeDays = timeRange === 'week' ? 7 : 30;
      const cutoffDate = new Date(now.setDate(now.getDate() - rangeDays));
      filtered = filtered.filter(s => new Date(s.completedAt) >= cutoffDate);
    }
    
    switch(sortBy) {
      case 'name':
        filtered.sort((a, b) => a.studentName.localeCompare(b.studentName));
        break;
      case 'score':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'percentage':
        filtered.sort((a, b) => b.percentage - a.percentage);
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        break;
      default:
        filtered.sort((a, b) => b.percentage - a.percentage);
    }
    
    return filtered;
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

  const attempts = getFilteredAndSortedAttempts();
  const scoreDistributionData = getScoreDistributionData();
  const difficultyData = getDifficultyData();
  const questionSuccessData = getQuestionSuccessData();
  const performanceTrendData = getPerformanceTrendData();

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
            
            <div className="flex gap-3 flex-wrap">
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
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span className="text-sm">Export CSV</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadReport}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <FaChartLine className="w-4 h-4" />
                    <span className="text-sm">HTML Report</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-white/40 text-xs mt-2">Students who attempted</p>
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
                <span className={`text-3xl font-bold ${getScoreColor(parseFloat(data.averageScore))}`}>
                  {data.averageScore}%
                </span>
              </div>
              <h3 className="text-white/70 text-sm">Average Score</h3>
              <p className="text-white/40 text-xs mt-2">Class average</p>
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
                <span className="text-3xl font-bold text-white">
                  {data.topScore}/{data.totalQuestions}
                </span>
              </div>
              <h3 className="text-white/70 text-sm">Top Score</h3>
              <p className="text-white/40 text-xs mt-2">Highest in class</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <FaStar className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-white">{data.passRate}%</span>
              </div>
              <h3 className="text-white/70 text-sm">Pass Rate</h3>
              <p className="text-white/40 text-xs mt-2">Above 70% score</p>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Score Distribution Chart */}
            {scoreDistributionData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaChartBar className="text-purple-400" />
                  Score Distribution
                </h3>
                <Bar 
                  data={scoreDistributionData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { labels: { color: 'white' } },
                      tooltip: { backgroundColor: 'rgba(0,0,0,0.8)' }
                    },
                    scales: {
                      y: { 
                        ticks: { color: 'white' }, 
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        title: { display: true, text: 'Number of Students', color: 'white' }
                      },
                      x: { 
                        ticks: { color: 'white' }, 
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        title: { display: true, text: 'Score Range (%)', color: 'white' }
                      }
                    }
                  }}
                />
              </motion.div>
            )}

            {/* Question Difficulty Breakdown */}
            {difficultyData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaChartPie className="text-purple-400" />
                  Question Difficulty
                </h3>
                <Pie 
                  data={difficultyData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { labels: { color: 'white' } },
                      tooltip: { backgroundColor: 'rgba(0,0,0,0.8)' }
                    }
                  }}
                />
              </motion.div>
            )}

            {/* Question Success Rates */}
            {questionSuccessData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 lg:col-span-2"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaChartArea className="text-purple-400" />
                  Question-wise Success Rates
                </h3>
                <Bar 
                  data={questionSuccessData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { labels: { color: 'white' } },
                      tooltip: { backgroundColor: 'rgba(0,0,0,0.8)' }
                    },
                    scales: {
                      y: { 
                        ticks: { color: 'white' }, 
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        max: 100,
                        title: { display: true, text: 'Success Rate (%)', color: 'white' }
                      },
                      x: { 
                        ticks: { color: 'white' }, 
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        title: { display: true, text: 'Question Number', color: 'white' }
                      }
                    }
                  }}
                />
              </motion.div>
            )}

            {/* Performance Trend */}
            {performanceTrendData && data.attempts.length > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 lg:col-span-2"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaChartLine className="text-purple-400" />
                  Performance Distribution Trend
                </h3>
                <Line 
                  data={performanceTrendData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { labels: { color: 'white' } },
                      tooltip: { backgroundColor: 'rgba(0,0,0,0.8)' }
                    },
                    scales: {
                      y: { 
                        ticks: { color: 'white' }, 
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        max: 100,
                        title: { display: true, text: 'Score (%)', color: 'white' }
                      },
                      x: { 
                        ticks: { color: 'white' }, 
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        title: { display: true, text: 'Students (Sorted by Performance)', color: 'white' }
                      }
                    }
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* Student Results with Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaUserGraduate className="text-purple-400" />
                Student Performance
                <span className="text-sm font-normal text-white/60">
                  ({attempts.length} students)
                </span>
              </h2>
              
              <div className="flex gap-3 flex-wrap">
                {/* Time Range Filter */}
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <FaHistory className="text-white/60 w-4 h-4" />
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-transparent text-white text-sm outline-none"
                  >
                    <option value="all" className="text-gray-900">All Time</option>
                    <option value="week" className="text-gray-900">Last 7 Days</option>
                    <option value="month" className="text-gray-900">Last 30 Days</option>
                  </select>
                </div>
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <FaFilter className="text-white/60 w-4 h-4" />
                  <select 
                    value={filterPassing}
                    onChange={(e) => setFilterPassing(e.target.value)}
                    className="bg-transparent text-white text-sm outline-none"
                  >
                    <option value="all" className="text-gray-900">All Students</option>
                    <option value="passed" className="text-gray-900">Passed Only</option>
                    <option value="failed" className="text-gray-900">Failed Only</option>
                  </select>
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <FaSortAmountDown className="text-white/60 w-4 h-4" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-white text-sm outline-none"
                  >
                    <option value="rank">Sort by Rank</option>
                    <option value="name">Sort by Name</option>
                    <option value="score">Sort by Score</option>
                    <option value="percentage">Sort by Percentage</option>
                    <option value="date">Sort by Date</option>
                  </select>
                </div>
              </div>
            </div>
            
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
                      <th className="text-left py-3 px-4 text-white/60 font-medium">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {attempts.map((student, idx) => {
                        const percentage = student.percentage;
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
                            <td className="py-3 px-4 text-white">{student.score}/{data.totalQuestions}</td>
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
                            <td className="py-3 px-4 text-white/60 text-sm">
                              {new Date(student.completedAt).toLocaleDateString()}
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
                <p className="text-white/50">No students match the selected filters</p>
                <button 
                  onClick={() => {
                    setFilterPassing('all');
                    setTimeRange('all');
                  }}
                  className="mt-3 text-purple-400 hover:text-purple-300 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>

          {/* Detailed Question Analysis */}
          {data.questionAnalysis && data.questionAnalysis.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaBrain className="text-purple-400" />
                  Detailed Question Analysis
                </h2>
                <button
                  onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {showDetailedAnalysis ? 'Show Less' : 'Show More'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.questionAnalysis.slice(0, showDetailedAnalysis ? undefined : 4).map((q, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/15 transition-all"
                    onClick={() => setSelectedQuestion({...q, index: idx})}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-semibold">Question {idx + 1}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        q.difficultyLevel === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        q.difficultyLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {q.difficultyLevel || (q.successRate > 70 ? 'Easy' : q.successRate > 40 ? 'Medium' : 'Hard')}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-white/60 text-xs">Question Type: {q.type}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>Success Rate</span>
                          <span>{q.successRate}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                            style={{ width: `${q.successRate}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-purple-400 font-bold">{q.successRate}%</div>
                          <div className="text-white/40">Success Rate</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2">
                          <div className="text-blue-400 font-bold">{q.difficulty || 'N/A'}</div>
                          <div className="text-white/40">Difficulty</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10 text-center text-purple-400 text-xs">
                      Click for more details
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Stats Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaBrain className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Total Questions</div>
              <div className="text-white font-bold">{data.totalQuestions}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaPercentage className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Median Score</div>
              <div className="text-white font-bold">{data.medianScore}%</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaLightbulb className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Passing Score</div>
              <div className="text-white font-bold">70%</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaMedal className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Top Performer</div>
              <div className="text-white font-bold truncate">
                {attempts[0]?.studentName || "N/A"}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <FaHistory className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <div className="text-white/60 text-xs">Total Attempts</div>
              <div className="text-white font-bold">{data.totalStudents}</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedQuestion(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">Question {selectedQuestion.index + 1} Analysis</h3>
              <button onClick={() => setSelectedQuestion(null)} className="text-white/60 hover:text-white">
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-sm">Question Type</div>
                    <div className="text-white font-semibold">{selectedQuestion.type}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Difficulty Level</div>
                    <div className={`font-semibold ${
                      selectedQuestion.difficultyLevel === 'Easy' ? 'text-green-400' :
                      selectedQuestion.difficultyLevel === 'Medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {selectedQuestion.difficultyLevel || (selectedQuestion.successRate > 70 ? 'Easy' : selectedQuestion.successRate > 40 ? 'Medium' : 'Hard')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-white/60 mb-1">
                      <span>Success Rate</span>
                      <span>{selectedQuestion.successRate}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                        style={{ width: `${selectedQuestion.successRate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {Math.round((selectedQuestion.successRate / 100) * data.totalStudents)}
                      </div>
                      <div className="text-white/60 text-xs">Students Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">
                        {Math.round(((100 - selectedQuestion.successRate) / 100) * data.totalStudents)}
                      </div>
                      <div className="text-white/60 text-xs">Students Incorrect</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4" />
                  Insights
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-white/80">
                    • This question was {selectedQuestion.successRate > 70 ? 'easy' : selectedQuestion.successRate > 40 ? 'moderately challenging' : 'difficult'} for students
                  </li>
                  <li className="text-white/80">
                    • {selectedQuestion.successRate > 70 ? 'Most students understood this concept well' : 
                       selectedQuestion.successRate > 40 ? 'About half the students struggled with this concept' : 
                       'Majority of students struggled with this concept -可能需要重新教学'}
                  </li>
                  <li className="text-white/80">
                    • Consider {selectedQuestion.successRate < 60 ? 'reviewing this topic in class' : 'using this as a benchmark question'}
                  </li>
                </ul>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;