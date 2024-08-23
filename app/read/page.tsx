"use client"

import { Worker } from '@react-pdf-viewer/core';
import { Viewer, SpecialZoomLevel, } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import { useEffect, useState } from 'react';
import { ScrollMode } from '@react-pdf-viewer/core';
import { ProgressBar } from '@react-pdf-viewer/core';

import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';


export default function Home() {

    const [wallet, setWallet] = useState("")
    const [id, setId] = useState<string>("")

    const toolbarPluginInstance = toolbarPlugin({
        searchPlugin: {
            keyword: 'PDF'
        },
    });

    const { Toolbar } = toolbarPluginInstance;

    useEffect(() => {
        setWallet(localStorage.getItem('address') || "");
        setId(localStorage.getItem('id') || "")
    }, [])

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.2.146/build/pdf.worker.min.js">
            <div className='relative flex items-center justify-center w-screen'>
                <div className='fixed top-20 z-50 backdrop-blur-2xl p-2 flex items-center justify-center rounded-full w-[80%] border-2 border-black'>
                    <Toolbar />
                </div>
                <Viewer renderLoader={(percentages: number) => (
                <div style={{ width: '240px' }}>
                    <ProgressBar progress={Math.round(percentages)} />
                </div>
            )} plugins={[
                toolbarPluginInstance,
            ]} initialPage={2} defaultScale={0.9} fileUrl={`https://nifty-tales.s3.ap-south-1.amazonaws.com/users/${wallet}/content/${id}/book`} />
            </div>
            
        </Worker>
    );

}