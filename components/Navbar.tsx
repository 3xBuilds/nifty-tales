import Image from 'next/image'
import React from 'react'
import logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <div className='bg-white w-screen flex items-center justify-between h-16 fixed top-0 left-0  px-10'>
        <div className='flex items-center'>
            <Image src={logo} alt='logo' className='w-10 h-10 ml-4' />
            <h1 className='text-2xl font-bold ml-2'>Nifty Tales</h1>
        </div>
        <div className='flex items-center gap-2'>
            <button className='bg-[#171717] rounded-lg text-[#eeeeee] h-10 font-semibold px-5'> Publish Book </button>
            <button className='bg-[#eeeeee] hover:bg-[#d3d3d3] rounded-lg text-[#171717] h-10 font-semibold px-5'> Wallet Connect </button>
        </div>
    </div>
  )
}

export default Navbar