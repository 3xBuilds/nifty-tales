"use client"

import { Worker } from '@react-pdf-viewer/core';
import { Viewer, SpecialZoomLevel, } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import { useEffect, useState } from 'react';
import { ScrollMode } from '@react-pdf-viewer/core';
import { ProgressBar } from '@react-pdf-viewer/core';

import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function Home() {

    const [wallet, setWallet] = useState("")
    const router = useRouter();
    const [id, setId] = useState<string>("")
    const [currentPage, setCurrentPage] = useState(0);

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

    async function tokenChecker(){
        await axios.get("/api/tokenChecker").then((res)=>{
            console.log(res);
        });
      }
      
      useEffect(()=>{
        tokenChecker();
      },[])

      const{data:session} = useSession()

      if(session)
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.2.146/build/pdf.worker.min.js">
            <div className='relative flex items-center justify-center w-screen h-screen pt-20'>
                <div className='fixed top-20 z-50 backdrop-blur-2xl h-16 px-4 flex items-center justify-center rounded-lg w-[80%] '>
                    <Toolbar />
                </div>
                {/* <div className='mt-20'> */}
                    <Viewer onPageChange={(e)=>{console.log(e.currentPage)}} renderLoader={(percentages: number) => (
                    <div style={{ width: '300px', margin: "50px" }}>
                        <ProgressBar progress={Math.round(percentages)} />
                    </div>
                )} plugins={[
                    toolbarPluginInstance,
                ]} initialPage={0} defaultScale={0.9} fileUrl={`https://nifty-tales.s3.ap-south-1.amazonaws.com/users/${wallet}/content/${id}/book`} />
                {/* </div> */}
            </div>
            
        </Worker>
    );

}