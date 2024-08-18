import React, { useState } from 'react'
import OptionToggle from '../Global/OptionToggle';

export const Analytics = () => {

  const [option, setOption] = useState<string>("Daily");

  const books = [
    {
      name: "Book1",
      revenue: "1.35 ETH",
      minted: "1350",
      readers: "14294",
    },
    {
      name: "Book2",
      revenue: "0.78 ETH",
      minted: "780",
      readers: "1217",
    }
  ]

  return (
    <div id="analytics" className='flex flex-col mx-4 md:mx-10 overflow-x-hidden items-start mt-5 pt-10 border-t-[1px] border-gray-300 justify-start'>
      <h2 className='text-2xl font-bold' >Analytics</h2>

      <OptionToggle options={["Daily", "Weekly", "Monthly", "All Time"]} selectedOption={option} setOption={setOption} />

      <div className='my-10 flex flex-wrap gap-2 items-center justify-center w-full' >
        <div className='p-6 flex items-start justify-center flex-col w-80 rounded-xl border-[1px] border-gray-300' >
          <h2 className='text-xl text-gray-400'>Total Revenue</h2>
          <h2 className='text-4xl font-bold'>12 ETH</h2>
        </div>

        <div className='p-6 flex items-start justify-center flex-col w-80 rounded-xl border-[1px] border-gray-300' >
          <h2 className='text-xl text-gray-400'>Books Minted</h2>
          <h2 className='text-4xl font-bold'>1,316</h2>
        </div>

        <div className='p-6 flex items-start justify-center flex-col w-80 rounded-xl border-[1px] border-gray-300' >
          <h2 className='text-xl text-gray-400'>Total Readers</h2>
          <h2 className='text-4xl font-bold'>6,316</h2>
        </div>
      </div>

      <div className='w-full max-w-full overflow-x-auto md:w-[90%] mx-auto mb-10'>
        <div className='overflow-x-auto'>
          <div className='min-w-[800px]'> {/* Set a minimum width for the table */}
            <div className='border-[1px] rounded-t-lg border-gray-300'>
              <div className='flex text-center py-2'>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-gray-400'>
                  <h2>ID</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-gray-400'>
                  <h2>Book</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-gray-400'>
                  <h2>Revenue</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-gray-400'>
                  <h2>Minted</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-gray-400'>
                  <h2>Readers</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-gray-400'>
                  <h2></h2>
                </div>
              </div>
            </div>

            <div className='border-x-[1px] border-b-[1px] rounded-b-lg border-gray-300'>
              {books.map((item, i) => (
                <div key={i} className='flex text-center py-2'>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{i + 1}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.name}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.revenue}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.minted}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.readers}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <button className='text-sm font-bold text-black bg-gray-300 py-1 w-24 rounded-md'>
                      Boost
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
