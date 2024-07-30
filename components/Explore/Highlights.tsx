"use client"
import React, { useEffect, useState } from 'react'
import { book1, book2, book3, book4, book5 } from '@/assets/assets';
import Image from 'next/image';
import Icon from '../Global/Icon';
import { openSans } from '@/utils/font';
import { useRouter } from 'next/navigation';

const Highlights = () => {

    const router = useRouter();

    const [highlights, setHighlights] = useState([
        {
            id: 1,
            title: 'Mollie',
            cover: book3,
            description: 'This is a test description for this book or any book that is going to be displayed in a card in this format on the highlights section of the home page.'
        },
        {
            id: 2,
            title: 'Five Feet Apart',
            cover: book4,
            description: 'This is a test description for this book or any book that is going to be displayed in a card in this format on the highlights section of the home page.'
        },
        {
            id: 3,
            title: 'Spring Book',
            cover: book5,
            description: 'This is a test description for this book or any book that is going to be displayed in a card in this format on the highlights section of the home page.'
        },
        {
            id: 4,
            title: 'Mollie',
            cover: book3,
            description: 'This is a test description for this book or any book that is going to be displayed in a card in this format on the highlights section of the home page.'
        }
    ]);

    const fetchHighlgihts = async () => {
        console.log('fetching highlights');
    }

    const addToReadList = () => {
        console.log('add to read list');
    }

    useEffect(() => {
        fetchHighlgihts();
    }, [])

  return (
    <div className='w-full p-5 flex items-center justify-start noscr'>
        <div className='grid grid-rows-1 grid-flow-col gap-2'>
            {highlights.map((highlight, index)=>(
                <div className='w-[450px] p-8 bg-gray-200 flex flex-row items-center justify-start overflow-hidden relative rounded-xl'>
                    <div className='w-56 h-full grow-1 overflow-hidden rounded shadow-black/50 shadow-lg relative z-20'>
                        <Image src={highlight.cover} alt="bookcover" className='w-full h-full object-cover'/>
                    </div>
                    <div className='w-fit relative z-20 pl-5 pt-5 text-white flex flex-col items-start justify-start h-full'>
                        <h1 className='text-2xl font-bold'>{highlight.title}</h1>
                        <p className={ openSans.className + ' text-xs font-normal mt-2'}>{highlight.description}</p>
                    </div>
                    <div className='w-full h-full absolute top-0 left-0 z-10 bg-black/30 backdrop-blur'></div>
                    <div className='w-full h-full absolute top-0 left-0 z-0'>
                        <Image src={highlight.cover} alt="" className=' object-cover w-full flex items-center justify-center'/>
                    </div>
                    <div className='flex flex-row gap-2 absolute bottom-8 right-8 z-20'>
                        <button onClick={()=>{router.push(`/${highlight.id}`)}} className='text-nifty-black text-sm font-semibold bg-white hover:bg-nifty-white rounded-lg px-4 py-1'>View</button>
                        <button onClick={()=>{addToReadList()}} className='text-nifty-black text-sm font-semibold bg-nifty-black rounded-lg w-8 h-8 flex items-center justify-center'>
                            <Icon name='addread' className='w-5 pl-1 mt-1' color='white'/>
                        </button>
                    </div>
                </div>))}
        </div>
    </div>
  )
}

export default Highlights