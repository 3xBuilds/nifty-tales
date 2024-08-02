import React from 'react'
import { FaTwitter } from 'react-icons/fa'

const FooterComponent = () => {
  return (
    <div className='bg-[#1a1a1a] w-screen px-20 pt-20 max-md:px-5 max-md:pt-10 text-white'>
        <h2 className='text-2xl font-bold'> Nifty Tales </h2>
        <div className='grid grid-cols-3 max-md:grid-cols-2 max-md:text-sm max-md:mt-5 mt-10'>
            <ul className='flex flex-col'>
                <li className='max-md:hidden'><a href="mailto:helloniftytales@gmail.com" target='_blank'>helloniftytales@gmail.com</a></li>
                <li className='md:hidden'><a href="mailto:helloniftytales@gmail.com" target='_blank'>Email</a></li>
                {/* <li>Instagram</li> */}
                <li><a href="https://x.com/niftytales" className='flex items-center justify-center gap-2 w-fit' target='_blank'> <FaTwitter className='text-white'/> Twitter</a></li>
                {/* <li>Discord</li> */}
            </ul>
            {/* <ul className='flex flex-col'>
                <li className='font-bold'>Links</li>
                <li>Publish Books</li>
            </ul> */}
        </div>
        <h2 className='text-sm text-center mx-auto text-[#b4b4b4] max-md:pt-10 pt-16 pb-5'> All Rights Reserved by NiftyTales © </h2>
    </div>
  )
}

export default FooterComponent