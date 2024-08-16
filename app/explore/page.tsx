"use client"

import Highlights from '@/components/Explore/Highlights'
import PublicLibrary from '@/components/Explore/PublicLibrary'
import Navbar from '@/components/Home/Navbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Explore = () => {
  const {data:session} = useSession();
  const router = useRouter();

  return (
    <div className='pt-16'>
      <div className='relative z-[100]'>
        <Navbar/>
      </div>
        <Highlights/>
        <PublicLibrary/>
    </div>
  )
}

export default Explore