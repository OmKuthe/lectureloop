// components/UI/GradientCard.jsx
import { motion } from 'framer-motion';

const GradientCard = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GradientCard;