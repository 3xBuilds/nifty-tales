import React from 'react'

const FooterComponent = () => {
  return (
    <div className='bg-[#1a1a1a] w-screen px-20 pt-20 text-white'>
        <h2 className='text-2xl font-bold'> Nifty Tales </h2>
        <div className='grid grid-cols-5 mt-10'>
            <ul className='flex flex-col'>
                <li>niftytales@gmail.com</li>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Discord</li>
            </ul>
            <ul className='flex flex-col'>
                <li className='font-bold'>Links</li>
                <li>Publish Books</li>
                <li>Explore Books</li>
                <li>Opensea</li>
            </ul>
        </div>
        <h2 className='text-sm text-center mx-auto text-[#b4b4b4] pt-16 pb-5'> All Rights Reserved by NiftyTales © </h2>
    </div>
  )
}

export default FooterComponent