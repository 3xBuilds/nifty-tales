"use client"

// Loader.js
import { motion } from 'framer-motion';
import { useLoading } from './LoadingContext';

const Loader = () => {
  const { isLoading } = useLoading();

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isLoading ? 1 : 0 }}
      transition={{ duration: 1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: '#000',
        transformOrigin: 'left',
        zIndex: 9999,
      }}
    />
  );
};

export default Loader;