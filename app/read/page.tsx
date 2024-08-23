"use client"

import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';


export default function Home(){
    return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={`https://nifty-tales.s3.ap-south-1.amazonaws.com/users/${localStorage.getItem('address')}/content/${localStorage.getItem('id')}/book`} />
    </Worker>    
    );

}