import React, { useEffect, useState } from 'react'
import OptionToggle from '../Global/OptionToggle';
import axios from 'axios';
import User from '@/schemas/userSchema';
import { useSession } from 'next-auth/react';
import { useGlobalContext } from '@/context/MainContext';

type StatsType = {
  totalRev: number;
  totalMinted: number;
  totalReaders: number;
}

export const Analytics = () => {

  const [option, setOption] = useState<string>("Daily");

  const [dailyArr, setDailyArr] = useState<Array<any>>([]);
  const [weeklyArr, setWeeklyArr] = useState<Array<any>>([]);
  const [monthlyArr, setMonthlyArr] = useState<Array<any>>([]);
  const [allTimeArr, setAllTimeArr] = useState<Array<any>>([]);

  const[dailyStats, setDailyStats] = useState<StatsType>();
  const[weeklyStats, setWeeklyStats] = useState<StatsType>();
  const[monthlyStats, setMonthlyStats] = useState<StatsType>();
  const[allTimeStats, setAllTimeStats] = useState<StatsType>();

  const { data: session } = useSession();
  const { user } = useGlobalContext();


  async function fetchDailyAnalytics() {
    try {
      setDailyArr([]);
      //@ts-ignore
      const res = await axios.get("/api/transaction/get/" + user._id);
      var totalRev = 0;
      var totalMinted = 0;
      var totalReaders = 0;
      res.data.allBooks.map((item: any) => {
        console.log(item)
        const dayFiltered = item.transactions.filter((obj: any) => {
          const date = new Date(obj.createdAt);
          const milliseconds = date.getTime();
          const difference = Date.now() - milliseconds;

          return difference < 86400000;
        })

        const dayFilteredReaders = item.readlists.filter((obj: any) => {
          const date = new Date(obj.createdAt);
          const milliseconds = date.getTime();
          const difference = Date.now() - milliseconds;

          return difference < 86400000;
        })

        const name = dayFiltered[0].book.name;
        const id = dayFiltered[0].book._id;
        const revenue = dayFiltered[0].value * dayFiltered.length;
        totalRev += revenue;
        const minted = dayFiltered.length;
        totalMinted += minted;
        const readers = dayFilteredReaders.length
        totalReaders += readers
        setDailyArr((prev) => [...prev, { name, revenue, minted, readers, id }])
      })
      setDailyStats({totalRev, totalMinted, totalReaders});
    }
    catch (err) {
      console.log(err);
    }
  }

  async function fetchWeeklyAnalytics() {
    try {
      setWeeklyArr([]);
      //@ts-ignore
      const res = await axios.get("/api/transaction/get/" + user._id);
      var totalRev = 0;
      var totalMinted = 0;
      var totalReaders = 0;
      res.data.allBooks.map((item: any) => {

        const weekFiltered = item.transactions.filter((obj: any) => {
          const date = new Date(obj.createdAt);
          const milliseconds = date.getTime();
          const difference = Date.now() - milliseconds;

          return difference < 86400000 * 7;

        })

        const weekFilteredReaders = item.readlists.filter((obj: any) => {
          const date = new Date(obj.createdAt);
          const milliseconds = date.getTime();
          const difference = Date.now() - milliseconds;

          return difference < 86400000 * 7;

        })

        const name = weekFiltered[0].book.name;
        const id = weekFiltered[0].book._id;
        const revenue = weekFiltered[0].value * weekFiltered.length;
        totalRev += revenue;
        const minted = weekFiltered.length;
        totalMinted += minted;
        const readers = weekFilteredReaders.length
        totalReaders += readers
        setWeeklyArr((prev) => [...prev, { name, revenue, minted, readers, id }])
      })
      setWeeklyStats({totalRev, totalMinted, totalReaders});

    }
    catch (err) {
      console.log(err);
    }
  }

  async function fetchMonthlyAnalytics() {
    try {
      setMonthlyArr([]);
      //@ts-ignore
      const res = await axios.get("/api/transaction/get/" + user._id);
      var totalRev = 0;
      var totalMinted = 0;
      var totalReaders = 0;
      res.data.allBooks.map((item: any) => {

        const monthFiltered = item.transactions.filter((obj: any) => {
          const date = new Date(obj.createdAt);
          const milliseconds = date.getTime();
          const difference = Date.now() - milliseconds;

          return difference < 86400000 * 28;

        })

        const monthFilteredReaders = item.readlists.filter((obj: any) => {
          const date = new Date(obj.createdAt);
          const milliseconds = date.getTime();
          const difference = Date.now() - milliseconds;

          return difference < 86400000 * 28;

        })

        const name = monthFiltered[0].book.name;
        const id = monthFiltered[0].book._id;
        const revenue = monthFiltered[0].value * monthFiltered.length;
        totalRev += revenue;
        const minted = monthFiltered.length;
        totalMinted += minted;
        const readers = monthFilteredReaders.length
        totalReaders += readers;
        setMonthlyArr((prev) => [...prev, { name, revenue, minted, readers, id }])
      })
      setMonthlyStats({totalRev, totalMinted, totalReaders});

    }
    catch (err) {
      console.log(err);
    }
  }

  async function fetchAllTimeAnalytics() {
    try {
      setAllTimeArr([]);
      //@ts-ignore
      const res = await axios.get("/api/transaction/get/" + user._id);
      var totalRev = 0;
      var totalMinted = 0;
      var totalReaders = 0;
      res.data.allBooks.map((item: any) => {

        const name = item.transactions[0].book.name;
        const id = item.transactions[0].book._id;
        const revenue = item.transactions[0].value * item.transactions.length;
        totalRev += revenue
        const minted = item.transactions.length;
        totalMinted += minted;
        const readers = item.readlists.length
        totalReaders += readers;
        setAllTimeArr((prev) => [...prev, { name, revenue, minted, readers, id }])
      })
      setAllTimeStats({totalRev, totalMinted, totalReaders});

    }
    catch (err) {
      console.log(err);
    }
  }

  async function handleBoost(id:string){
    try{
      console.log("Boosting", id);
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    if (user) {
      setDailyArr([]);
      setWeeklyArr([]);
      setMonthlyArr([]);
      setAllTimeArr([]);
      fetchDailyAnalytics()
      fetchWeeklyAnalytics()
      fetchMonthlyAnalytics()
      fetchAllTimeAnalytics()
    }
  }, [user])

  return (
    <div id="analytics" className='flex flex-col mx-4 md:mx-10 overflow-x-hidden items-start mt-5 pt-10 border-t-[1px] border-gray-300 justify-start'>
      <h2 className='text-2xl font-bold' >Analytics</h2>

      <OptionToggle options={["Daily", "Weekly", "Monthly", "All Time"]} selectedOption={option} setOption={setOption} />

      <div className='my-10 flex flex-wrap gap-2 items-center justify-center w-full' >
        <div className='p-6 flex items-start justify-center flex-col md:w-[30%] w-80 rounded-xl border-[1px] border-gray-300' >
          <h2 className='text-xl text-nifty-gray'>Total Revenue</h2>
          <h2 className='text-4xl font-bold flex gap-2 items-center'>{option == "Daily" && dailyStats?.totalRev}{option == "Weekly" && weeklyStats?.totalRev}{option == "Monthly" && monthlyStats?.totalRev}{option == "All Time" && allTimeStats?.totalRev} {!dailyStats && !weeklyStats && !monthlyStats && !allTimeStats && <div className='h-12 rounded-lg bg-nifty-gray-1/60 animate-pulse w-24'></div>} ETH</h2>
        </div>

        <div className='p-6 flex items-start justify-center flex-col md:w-[30%] w-80 rounded-xl border-[1px] border-gray-300' >
          <h2 className='text-xl text-nifty-gray'>Books Minted</h2>
          <h2 className='text-4xl font-bold flex gap-2 items-center'>{option == "Daily" && dailyStats?.totalMinted}{option == "Weekly" && weeklyStats?.totalMinted}{option == "Monthly" && monthlyStats?.totalMinted}{option == "All Time" && allTimeStats?.totalMinted} {!dailyStats && !weeklyStats && !monthlyStats && !allTimeStats && <div className='h-12 rounded-lg bg-nifty-gray-1/60 animate-pulse w-24'></div>}</h2>
        </div>

        <div className='p-6 flex items-start justify-center flex-col md:w-[30%] w-80 rounded-xl border-[1px] border-gray-300' >
          <h2 className='text-xl text-nifty-gray'>Total Readers</h2>
          <h2 className='text-4xl font-bold flex gap-2 items-center'>{option == "Daily" && dailyStats?.totalReaders}{option == "Weekly" && weeklyStats?.totalReaders}{option == "Monthly" && monthlyStats?.totalReaders}{option == "All Time" && allTimeStats?.totalReaders} {!dailyStats && !weeklyStats && !monthlyStats && !allTimeStats && <div className='h-12 rounded-lg bg-nifty-gray-1/60 animate-pulse w-24'></div>}</h2>
        </div>
      </div>

      <div className='w-full max-w-full overflow-x-auto mx-auto mb-10'>
        <div className='overflow-x-auto '>
          <div className='min-w-[800px] w-[100%]'> {/* Set a minimum width for the table */}
            <div className='border-[1px] rounded-t-lg border-gray-300'>
              <div className='flex text-center py-2'>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-nifty-gray'>
                  <h2>ID</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-nifty-gray'>
                  <h2>Book</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-nifty-gray'>
                  <h2>Revenue</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-nifty-gray'>
                  <h2>Minted</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-nifty-gray'>
                  <h2>Readers</h2>
                </div>
                <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-nifty-gray'>
                  <h2></h2>
                </div>
              </div>
            </div>

            <div className='border-x-[1px] border-b-[1px] rounded-b-lg border-gray-300'>
              {option == "Daily" && dailyArr.length > 0 ? dailyArr.map((item, i) => (
                <div key={i} className='flex text-center py-2'>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{i + 1}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.name}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.revenue} ETH</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.minted}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.readers}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <button onClick={()=>{handleBoost(item.id)}} className='text-sm font-bold text-black bg-gray-300 py-1 w-24 rounded-md'>
                      Boost
                    </button>
                  </div>
                </div>
              )) : <>{option == "Daily" && <div className='flex flex-col h-20 font-bold items-center justify-center w-full text-nifty-gray-1'>No data to display</div>}</>}

              {option == "Weekly" && weeklyArr.length > 0 ? weeklyArr.map((item, i) => (
                <div key={i} className='flex text-center py-2'>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{i + 1}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.name}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.revenue} ETH</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.minted}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.readers}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <button onClick={()=>{handleBoost(item.id)}} className='text-sm font-bold text-black bg-gray-300 py-1 w-24 rounded-md'>
                      Boost
                    </button>
                  </div>
                </div>
              )):<>{option == "Weekly" && <div className='flex flex-col h-20 font-bold items-center justify-center w-full text-nifty-gray-1'>No data to display</div>}</>}

              {option == "Monthly" && monthlyArr.length > 0 ? monthlyArr.map((item, i) => (
                <div key={i} className='flex text-center py-2'>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{i + 1}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.name}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.revenue} ETH</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.minted}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.readers}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <button onClick={()=>{handleBoost(item.id)}} className='text-sm font-bold text-black bg-gray-300 py-1 w-24 rounded-md'>
                      Boost
                    </button>
                  </div>
                </div>
              )): <>{option == "Monthly" && <div className='flex flex-col h-20 font-bold items-center justify-center w-full text-nifty-gray-1'>No data to display</div>}</>}

              {option == "All Time" && allTimeArr.length> 0 ? allTimeArr.map((item, i) => (
                <div key={i} className='flex text-center py-2'>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{i + 1}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.name}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.revenue} ETH</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.minted}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <h2>{item.readers}</h2>
                  </div>
                  <div className='flex-shrink-0 min-w-32 w-[16.6%] font-medium text-md text-black'>
                    <button onClick={()=>{handleBoost(item.id)}} className='text-sm font-bold text-black bg-gray-300 py-1 w-24 rounded-md'>
                      Boost
                    </button>
                  </div>
                </div>
              )): <>{option == "All Time" && <div className='flex flex-col h-20 font-bold items-center justify-center w-full text-nifty-gray-1'>No data to display</div>}</>}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
