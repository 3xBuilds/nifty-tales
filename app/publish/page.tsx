"use client"
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton"
import OptionToggle from "@/components/Global/OptionToggle"
import Navbar from "@/components/Home/Navbar"
import { ethers } from "ethers"
import Image from "next/image"
import { useState, useEffect } from "react"
import { FaFilePdf } from "react-icons/fa"
import { FaSquareCheck } from "react-icons/fa6"
import { ImCross } from "react-icons/im"

export default function Home(){

    const[bookName, setBookName] = useState<string>("");
    const[bookDesc, setBookDesc] = useState<string>("");
    const[illustrationArtist, setIllustrationArtist] = useState<string>("")
    const [isbn, setIsbn] = useState<string>("");
    const [pdf, setPdf] = useState<File | null>(null);

    const [mintPrice, setMintPrice] = useState<number>(0);
    const [maxMints, setMaxMints] = useState<number>(0);

    const[option, setOption] = useState<string>("Upload PDF")

    const[tags, setTags] = useState<Array<string>>([]);
    const[currentTag, setCurrentTag] = useState<string>("");

    const[agree ,setAgree] = useState<boolean>(false);

    const removeTag = (indexToRemove: number) => {
        setTags(prevTags => prevTags.filter((_, index) => index !== indexToRemove));
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdf(e.target.files[0]);
        }
    };


    return(
        <div className="md:px-16 pt-24 max-md:px-4 w-screen h-screen flex flex-col items-start justify-start">
            <div className="flex w-screen justify-end absolute">
               <Navbar/>
            </div>

            <h3 className="text-3xl font-bold">Publish Your Book</h3>

            <OptionToggle options={["Upload PDF", "Write your Own"]} selectedOption={option} setOption={setOption} />

            <div className="md:w-[70%] flex max-md:flex-col gap-10 mt-5">
                <div className="relative w-36 max-md:hidden">
                    {/* Image Holder */}
                    <div className="h-44 absolute z-[2] w-32 mt-4 bg-gray-300 rounded-lg shadow-lg shadow-black/10">

                    </div>
                    <div className="absolute z-[1] h-44 w-32 top-1 left-1 mt-4 bg-white rounded-lg shadow-lg shadow-black/10">

                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-4">
                        <div className="w-full text-start flex flex-col">
                            <input placeholder="Enter Book Name..." onChange={(e) => { setBookName(e.target.value) }} value={bookName} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Book Name</h2>
                        </div>

                        <div className="w-full text-start flex flex-col">
                            <input placeholder="ISBN Number" onChange={(e) => { setIsbn(e.target.value) }} value={isbn} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">ISBN (Optional)</h2>
                        </div>

                    </div>

                    <div className="w-full text-start flex flex-col">
                        <textarea placeholder="Description..." onChange={(e) => { setBookDesc(e.target.value) }} value={bookDesc} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2 h-64 rounded-xl border-[1px] duration-200 border-gray-400"></textarea>
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Book Name</h2>
                    </div>

                    <div className="w-full text-start flex flex-col">
                        <input placeholder="Add tags to get noticed (Enter to create)" onKeyDown={(e)=>{if(e.key == "Enter" && tags.length<5){setTags((prev)=>[...prev, currentTag.toLowerCase()]); setCurrentTag("")};}} onChange={(e) => {if(tags.length<5)setCurrentTag(e.target.value) }} value={currentTag} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Tags (upto 5)</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((item, i)=>(
                                <div className="py-2 w-20 rounded-xl flex gap-2 items-center justify-center bg-gray-300 border-2 border-gray-500 font-semibold text-center text-gray-500 text-xs">
                                    {item}
                                    <button onClick={()=>{removeTag(i)}} className="hover:text-white duration-200" ><ImCross/></button>
                                    </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full text-start flex flex-col">
                        <input placeholder="Pablo Picasso" onChange={(e) => { setIllustrationArtist(e.target.value) }} value={illustrationArtist} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Illustration Artist (Optional)</h2>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-full text-start flex flex-col">
                            <input placeholder={`Leave ${0} if free mint`} min={0} type="number" onChange={(e) => { setMintPrice(Number(e.target.value)) }} value={mintPrice} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Mint Price (ETH)</h2>
                        </div>

                        <div className="w-full text-start flex flex-col">
                            <input type="number" min={0} placeholder={`Leave 0 if no max limit`} onChange={(e) => { setMaxMints(Number(e.target.value)) }} value={maxMints} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Max Mints (Optional)</h2>
                        </div>

                    </div>

                    <div className="flex flex-col items-start justify-center md:justify-start md:w-[40%]">
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Upload Pdf</h2>

                            <div>
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-48 h-48 border-2 border-jel-gray-3 border-dashed group rounded-xl mt-2 cursor-pointer hover:bg-jel-gray-1">
                                    <div className="flex flex-col items-center h-full w-full p-2 overflow-hidden justify-center rounded-lg">
                                        {!pdf ? <div className="bg-gray-300 text-gray-500 gap-2 flex flex-col items-center justify-center w-full h-full rounded-xl">
                                                <FaFilePdf className="text-xl" />
                                                <h3 className="w-[80%] text-xs text-center">Use .pdf files only with white background for best readability.</h3>
                                            </div> :
                                            <div className="text-sm font-bold group-hover:scale-105 duration-200">
                                                {pdf.name}
                                                </div>}
                                    </div>
                                    <input id="dropzone-file" type="file" accept='application/pdf' onChange={handleFileChange} className="hidden" />
                                </label>
                                {/* <button onClick={handleSubmit} disabled={uploading} className=' col-span-2 w-32 py-2 font-medium text-black rounded-xl hover:-translate-y-[0.3rem] duration-200 bg-jel-gray-3 hover:bg-jel-gray-2 text-nowrap mt-2'>{uploading ? "Uploading..." : "Upload"}</button> */}
                            </div>
                        </div>

                        
                    
                </div>
            </div>

            <div className="w-full flex max-md:flex-col gap-6 mt-20 pb-10 items-center justify-center md:justify-end">
                <div className="flex gap-2 items-center justify-end text-gray-400">
                    <button onClick={()=>{
                        setAgree((prev)=>(!prev));
                    }} className="border-[1px] h-8 w-8 flex items-center justify-center border-gray-400 rounded-md">
                        {agree && <FaSquareCheck className="h-7 w-7"/>}
                    </button>
                    I agree that have the rights of everything I am publishing
                </div>
                <button className='text-black bg-gray-200 h-10 w-48 font-bold rounded-lg hover:-translate-y-1 px-3 py-1 transform transition duration-200 ease-in-out flex items-center justify-center flex-col gap-0' >Save Draft</button>
                <button className='text-white bg-black h-10 w-48 font-bold rounded-lg hover:-translate-y-1 px-3 py-1 transform transition duration-200 ease-in-out flex items-center justify-center flex-col gap-0'>Publish</button>

            </div>

        </div>
    )
}