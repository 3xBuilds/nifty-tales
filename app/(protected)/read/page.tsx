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
import { CiBookmarkPlus } from 'react-icons/ci';
import { useLoading } from '@/components/PageLoader/LoadingContext';
import { toast } from 'react-toastify';
import { useGlobalContext } from '@/context/MainContext';
import { IoIosBookmark } from 'react-icons/io';

import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { initializeTheme, toggleDarkMode } from '@/toggleDarkMode';

export default function Home() {

    const{data:session} = useSession()
    const [wallet, setWallet] = useState("")
    const router = useRouter();
    const [id, setId] = useState<string>("")
    const [currentPage, setCurrentPage] = useState(0);
    const [bookId, setBookId] = useState<string>("");
    const[pdf, setPdf] = useState<string>("")

    const {user, night, setNight} = useGlobalContext();

    let theme = "dark"

    if(typeof window !== 'undefined'){
      theme = window?.localStorage?.getItem('theme') || 'light';
    }
    
    const [page, setPage] = useState<number>(0);

    const toolbarPluginInstance = toolbarPlugin({
        searchPlugin: {
            keyword: 'PDF'
        },
    });

    const { Toolbar } = toolbarPluginInstance;

    useEffect(() => {
      if(window){
        setWallet(localStorage?.getItem('address') || "");
        const book = JSON.parse(localStorage?.getItem('book') as string);
        setPdf(book.pdf);
        setBookId(book._id);
      }
    }, [])


      useEffect(()=>{
        if(bookId != "" && user)
        getBookMark();
      },[bookId, user])

    
      async function addBookmark(){
        try{
            await axios.post("/api/bookmark", {email: session?.user?.email, bookId: bookId, page: currentPage}).then((res)=>{
                toast.success("Bookmark added at page "+Number(currentPage+1))
            })
        }
        catch(err:any){
            console.log(err);
            if(err.response.status == 501){
                toast.error(err.response.data.error);
              }
              else{
                toast.error("Error while adding Bookmark. Try again!")
              }
        }
      }

      async function getBookMark(){
        try{
            await axios.get("/api/bookmark/"+bookId+"-"+user?._id).then((res)=>{
                console.log(res.data.data)
                setPage(res.data.data.page);
            })
        }
        catch(err){
            setPage(0);
            console.log(err);
        }
      }
    if(page!= undefined)
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <div className={`w-screen h-screen fixed top-0 left-0 z-[-1] dark:bg-nifty-black bg-white`}></div>

      <div className={`relative flex items-center justify-center w-screen h-screen pt-20 dark:bg-nifty-black bg-white`}>
        <div className="fixed top-20 z-50 bg-white h-16 px-4 flex items-center justify-center rounded-lg w-[80%]">
          <Toolbar />
          {session && <button 
            onClick={addBookmark} 
            className='bg-white hover:bg-gray-100 text-black rounded-md duration-100 flex items-center justify-center w-8 h-8 -translate-y-[0.25rem]'
          >
            <IoIosBookmark/>
          </button>}
        </div>

          <Viewer theme={theme}
            onPageChange={(e) => setCurrentPage(e.currentPage || 0)}
            renderLoader={(percentages: number) => (
              <div style={{ width: '300px', margin: "50px" }}>
                <ProgressBar progress={Math.round(percentages)} />
              </div>
            )}
            plugins={[toolbarPluginInstance]}
            initialPage={page || 0}
            defaultScale={0.9}
            fileUrl={pdf}
          />
        
      </div>
    </Worker>


    );

}