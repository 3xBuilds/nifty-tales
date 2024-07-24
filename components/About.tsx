import React from 'react'

const About = () => {
  return (
    <div className=' text-center mt-20'>
        <h2 className='text-4xl mt-5 font-bold'>About Us</h2>
        <h3 className='text-3xl mt-20 font-bold'>What is Nifty Tales?</h3>
        <h2 className='text-xl text-gray-500 font-light w-[60%] mx-auto mt-10'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi natus aliquid culpa reiciendis dolores facere rem nostrum nisi quasi magnam eveniet harum quo placeat atque nobis, modi iure ducimus incidunt. Odio recusandae quam eum, voluptates aut accusamus quae alias, ipsa magni nam error, inventore facere non temporibus tenetur dolor? Rerum.</h2>
        <h3 className='text-3xl mt-20 font-bold'>Our Vision</h3>
        <h2 className='text-xl text-gray-500 font-light w-[60%] mx-auto mt-10'>Lorem ipsum dolAnimi natus aliquid culpa reiciendis doloondae quam eum, voluptatenam error, inventore facere non temporibus tenetur dolor? Rerum.</h2>
        <h3 className='text-3xl mt-20 font-bold'>Our Team</h3>
        <div className='flex items-center justify-center my-20 gap-10'>
            <div className='w-72 hover:scale-110 duration-150 rounded-xl bg-[#fafafa] shadow-black/25 shadow-lg p-5 flex flex-col items-center justify-center'>
                <div className='w-[95%] bg-white overflow-hidden aspect-square rounded-full'></div>
                <h3 className='text-xl font-bold mt-8'>Member Name</h3>
                <h3 className='text-base text-[#a5a5a5]'>Member Position</h3>
            </div>
            <div className='w-72 hover:scale-110 duration-300 rounded-xl bg-[#fafafa] shadow-black/25 shadow-lg p-5 flex flex-col items-center justify-center'>
                <div className='w-[95%] bg-white overflow-hidden aspect-square rounded-full'></div>
                <h3 className='text-xl font-bold mt-8'>Member Name</h3>
                <h3 className='text-base text-[#a5a5a5]'>Member Position</h3>
            </div>
            <div className='w-72 hover:scale-110 duration-300 rounded-xl bg-[#fafafa] shadow-black/25 shadow-lg p-5 flex flex-col items-center justify-center'>
                <div className='w-[95%] bg-white overflow-hidden aspect-square rounded-full'></div>
                <h3 className='text-xl font-bold mt-8'>Member Name</h3>
                <h3 className='text-base text-[#a5a5a5]'>Member Position</h3>
            </div>
        </div>

    </div>
  )
}

export default About