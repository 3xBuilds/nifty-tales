"use client"

// Loader.js
import { motion } from 'framer-motion';
import { useLoading } from './LoadingContext';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/MainContext';


const Loader = () => {
  const { isLoading } = useLoading();
  const {night} = useGlobalContext()
  const [color, setColor] = useState("");
  const [length, setLength] = useState<number>(0);

   useEffect(()=>{

    if(night){setColor("#FFFFFF")};
    if(!night){setColor("#000000")}

    if(isLoading){
      setLength(0);
      setInterval(()=>{
        setLength((prev)=>prev+0.015);
      },100);
    }

    if(!isLoading){
      setLength(0)
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
        background: color,
        transformOrigin: 'left',
        zIndex: 9999,
      }}
    />
  );
};

export default Loader;