import React from 'react'
import banner from '../assets/banner.png'
import Image from 'next/image'

const Landing = () => {
  return (
    <div className='w-screen h-screen grid grid-cols-2'>
        <div className=' pl-12 flex flex-col items-start justify-center h-full'>
            <h1 className='text-6xl font-bold'>Nifty Tales</h1>
            <h2 className='text-3xl mt-5'>Empowering Authors, Engaging Readers</h2>
            <h2 className='text-xl text-gray-500 font-light mt-5'>Discover, read, and publish illustrated stories on the blockchain. Our platform connects authors with readers in a unique, interactive way, transforming traditional storytelling into an innovative digital experience.</h2>

        </div>
        <div className='flex h-full'>
            <Image src={banner} alt="banner" className='w-full h-full object-contain'/>
        </div>

    </div>
  )
}

export default Landing