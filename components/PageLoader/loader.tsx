"use client"

// Loader.js
import { easeInOut, motion } from 'framer-motion';
import { useLoading } from './LoadingContext';
import { useEffect, useState } from 'react';


const Loader = () => {
  const { isLoading } = useLoading();

  const [length, setLength] = useState<number>(0);

   useEffect(()=>{
      setInterval(()=>{
        setLength((prev)=>prev+0.02);
      },100);

     if(!isLoading){
      setLength(0);
     }
   },[isLoading]);

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isLoading ? length : 0 }}
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