"use client"

import { useLoading } from "@/components/PageLoader/LoadingContext"
import Quill from "@/components/Quill/quill"
import { useEffect } from "react"

export default function Home(){
    const {setIsLoading} = useLoading()

  useEffect(()=>{
    setIsLoading(false)
  },[])
    return(
        <div className="mt-20">
            <Quill/>
        </div>
    )
}