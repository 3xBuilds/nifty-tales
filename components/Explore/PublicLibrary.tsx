"use client"
import { openSans } from '@/utils/font'
import React, { useState } from 'react'
import Icon from '../Global/Icon';
import OptionToggle from '../Global/OptionToggle';
import Book from '../Global/Book';

const PublicLibrary = () => {

    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState<string>('');

    const [type, setType] = useState('Trending');

  return (
    <div className='px-5 pt-5'>
        <div className='flex flex-row items-center justify-between'>
            <div className=''>
              <h1 className='font-bold text-2xl mb-4'>Public Library</h1>
              <OptionToggle options={['Trending', 'Latest', 'Upcoming']} selectedOption={type} setOption={setType} />

            </div>
            <div className={openSans.className + ` w-96 relative overflow-hidden shadow-search h-12 text-nifty-black text-lg ${isFocused? " border-[1px] ": ""}  rounded-full items-center justify-start `}>
                <input value={value} type='text' onChange={(e)=>{setValue(e.target.value)}} placeholder={'Search Your Favourite Books'} onFocus={()=>{setIsFocused(true)}} onBlur={()=>{setIsFocused(false)}} className={ ` relative peer z-20 w-full h-full bg-transparent outline-none px-4 pl-12`}/>
                <Icon name='search'  className={ ` absolute top-1/2 left-4 -translate-y-1/2 z-10`}/>
            </div>      
        </div>
        <div className='mt-20 flex flex-row gap-10 items-center justify-center'>
              
              <div className=''></div>
        </div>
    </div>
  )
}

export default PublicLibrary