// pages/Home.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedButton from '../components/UI/AnimatedButton';
import FloatingParticles from '../components/UI/FloatingParticles';
import { FaChalkboardTeacher, FaUserGraduate, FaBrain, FaRocket } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaBrain className="w-8 h-8" />,
      title: "AI-Powered Questions",
      description: "Smart questions generated from your lecture content"
    },
    {
      icon: <FaChalkboardTeacher className="w-8 h-8" />,
      title: "Instant Feedback",
      description: "Real-time analytics on student performance"
    },
    {
      icon: <FaUserGraduate className="w-8 h-8" />,
      title: "Student Engagement",
      description: "Timed quizzes to keep students focused"
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: "Fast & Easy",
      description: "Upload PDF, get quiz code, share with students"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold">
              ✨ AI-Powered Learning ✨
            </span>
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Turn Lectures into
            <br />
            Interactive Quizzes
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Upload your PDF, let AI generate smart questions, and get instant insights into student understanding
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/teacher">
              <AnimatedButton variant="primary" className="px-8 py-4 text-lg">
                🎓 I'm a Teacher
              </AnimatedButton>
            </Link>
            <Link to="/student">
              <AnimatedButton variant="outline" className="px-8 py-4 text-lg">
                👨‍🎓 I'm a Student
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-4xl font-bold text-blue-600">10s</div>
            <div className="text-gray-600">Questions Generated</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">100%</div>
            <div className="text-gray-600">AI Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-600">24/7</div>
            <div className="text-gray-600">Available</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;