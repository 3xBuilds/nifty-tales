import React from 'react'
import {book2} from '@/assets/assets'
import Image from 'next/image'

const Book = () => {
  return (
    <div className='w-fit h-fit relative'>
        <div className='bg-nifty-gray-1 overflow-hidden rounded w-36 h-48 shadow-black/50 shadow relative z-10'>
            <Image src={book2} alt="bookcover" className='w-full h-full object-cover'/>
        </div>
        <div className='bg-white rounded w-36 h-48 shadow-black/20 shadow-md absolute top-1 left-1 z-0'>
            
        </div>
        <div className='bg-white rounded w-36 h-48 shadow-book absolute top-1 left-1 z-0'>
            
        </div>
    </div>
  )
}

export default Book