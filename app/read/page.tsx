"use client"

import { Worker } from '@react-pdf-viewer/core';
import { Viewer,SpecialZoomLevel } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import { useEffect, useState } from 'react';


export default function Home(){

    const[wallet, setWallet] = useState("")
    const[id, setId] = useState<string>("")

    useEffect(()=>{
        setWallet(localStorage.getItem('address') || "");
        setId(localStorage.getItem('id') || "")
    },[])

    return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer defaultScale={0.8} fileUrl={`https://nifty-tales.s3.ap-south-1.amazonaws.com/users/${wallet}/content/${id}/book`} />
    </Worker>    
    );

}