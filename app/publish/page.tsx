"use client"
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton"
import Navbar from "@/components/Home/Navbar"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

export default function Home(){

    const[bookName, setBookName] = useState<string>("");
    const[bookDesc, setBookDesc] = useState<string>("");


    return(
        <div className="md:px-16 pt-24 max-md:px-4 w-screen h-screen flex flex-col items-start justify-start">
            <div className="flex w-screen justify-end absolute">
               <Navbar/>
            </div>

            <h3 className="text-3xl font-bold">Publish Your Book</h3>

            <div className="w-[90%] flex gap-4">
                <div className="relative w-36">
                    {/* Image Holder */}
                    <div className="h-44 absolute z-[2] w-32 mt-4 bg-gray-300 rounded-lg shadow-lg shadow-black/10">

                    </div>
                    <div className="absolute z-[1] h-44 w-32 top-1 left-1 mt-4 bg-white rounded-lg shadow-lg shadow-black/10">

                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex gap-4">
                        <div className="w-full text-start flex flex-col">
                            <input placeholder="Enter Book Name..." onChange={(e) => { setBookName(e.target.value) }} value={bookName} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Book Name</h2>
                        </div>

                        <div className="w-full text-start flex flex-col">
                            <input placeholder="ISBN Number" onChange={(e) => { setBookName(e.target.value) }} value={bookName} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">ISBN (Optional)</h2>
                        </div>

                    </div>

                    <div className="w-full text-start flex flex-col">
                        <textarea placeholder="Description..." onChange={(e) => { setBookDesc(e.target.value) }} value={bookDesc} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2 h-64 rounded-xl border-[1px] duration-200 border-gray-400"></textarea>
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Book Name</h2>
                    </div>
                </div>
            </div>

        </div>
    )
}