"use client"

// Loader.js
import { motion } from 'framer-motion';
import { useLoading } from './LoadingContext';
import { useEffect, useState } from 'react';


const Loader = () => {
  const { isLoading } = useLoading();

  const [length, setLength] = useState<number>(0);

   useEffect(()=>{

    if(isLoading){
      const interval = setInterval(()=>{
        setLength((prev)=>prev+0.03);
      },100);

      // clearInterval(interval);
    }

   },[isLoading]);

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isLoading ? length : 0 }}
      // transition={{ duration: 2 }}
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