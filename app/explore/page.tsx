import Highlights from '@/components/Explore/Highlights'
import PublicLibrary from '@/components/Explore/PublicLibrary'
import Navbar from '@/components/Home/Navbar'
import React from 'react'

const Explore = () => {
  return (
    <div className='pt-16'>
        <Navbar/>
        <Highlights/>
        <PublicLibrary/>
    </div>
  )
}

export default Explore