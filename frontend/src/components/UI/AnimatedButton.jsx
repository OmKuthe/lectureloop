// components/UI/AnimatedButton.jsx
import { motion } from 'framer-motion';

const AnimatedButton = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;