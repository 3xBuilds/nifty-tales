"use client"
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton"
import OptionToggle from "@/components/Global/OptionToggle"
import Navbar from "@/components/Home/Navbar"
import { useGlobalContext } from "@/context/MainContext"
import axios from "axios"
import { ethers } from "ethers"
import Image from "next/image"
import { useState, useEffect } from "react"
import { FaFilePdf, FaImage } from "react-icons/fa"
import { FaArrowPointer, FaSquareCheck } from "react-icons/fa6"
import { ImCross } from "react-icons/im"
import { useAccount } from "wagmi"
import abi from "@/utils/abis/templateABI"
import { Loader } from "@/components/Global/Loader"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function Home(){

    const {address} = useAccount();
    const {user, setUser} = useGlobalContext();

    const[loading, setLoading] = useState<boolean>(false);

    const[bookName, setBookName] = useState<string>("");
    const[bookDesc, setBookDesc] = useState<string>("");
    const[illustrationArtist, setIllustrationArtist] = useState<string>("")
    const [isbn, setIsbn] = useState<string>("");
    const [pdf, setPdf] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);

    const[requiredName, setRequiredName] = useState(false);
    const[requiredTags, setRequiredTags] = useState(false);
    const[requiredPdf, setRequiredPdf] = useState(false);


    const[id, setId] = useState("");

    const[characterDesc, setCharacterDesc] = useState(0)
    const[characterName, setCharacterName] = useState(0)
    const[characterArtist, setCharacterArtist] = useState(0)

    const[coverLink, setCoverLink] = useState("");
    const[fileLink, setFileLink] = useState("");

    const [mintPrice, setMintPrice] = useState<number>(0);
    const [maxMints, setMaxMints] = useState<number>(0);

    const [tokenId, setTokenId] = useState<string>("");

    const[option, setOption] = useState<string>("Upload PDF")

    const[tags, setTags] = useState<Array<string>>([]);
    const[currentTag, setCurrentTag] = useState<string>("");

    const[agree, setAgree] = useState<boolean>(false);

    const router = useRouter()

    async function contractSetup(){
        try {
            //@ts-ignore
            if (typeof window.ethereum !== 'undefined') {

                //@ts-ignore
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                //@ts-ignore
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                //@ts-ignore
                const contract = new ethers.Contract(user?.contractAdd, abi, signer);
                console.log("llulululul::",contract);

            return contract;

            }

        }
        catch (err) {
            console.error(err);
        }
    }

    async function getContractDetails(type:string){
        try{
            const contract = await contractSetup();
            console.log('contract is here broooo: ', contract);
            const id = await contract?.BOOK();
            console.log("heheh id: ", id);
            setTokenId(Number(id).toString());
            if(id){
                handleSubmit(type, id.toString());
            }
        }
        catch(err){

            console.error(err);
        }
    }

    async function contractPublishBook(){
        try{
            const contract = await contractSetup();

            const txn = await contract?.publishBook(Number(tokenId), ethers.utils.parseEther(String(mintPrice)), maxMints);
            
            txn.wait().then(async (res:any)=>{
                console.log("THIS IS ID",id);
                // await axios.patch("/api/book/"+id, {
                //     isPublshed: true
                // }).then((res)=>{
                    setLoading(false);
                    router.push("/authors")
                // })
            })
        }
        catch(err){
            setLoading(false);
            console.log(err);
        }
    }

    // useEffect(()=>{
    //     getContractDetails();
    // }, [user])

    const removeTag = (indexToRemove: number) => {
        setTags(prevTags => prevTags.filter((_, index) => index !== indexToRemove));
    };

    function delay(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdf(e.target.files[0]);
        }
    }

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCover(e.target.files[0]);
        }
    }
    

    const handleSubmit = async (publish:string, tokenId:string) => {

        try{

            if(bookName == ""){
                setRequiredName(true);
                setLoading(false);
                return;
            }

            if(tags.length == 0){
                setRequiredTags(true);
                setLoading(false);
                return;
            }

            if(!pdf && fileLink == ""){
                setRequiredPdf(true);
                setLoading(false);
                return;
            }

            if(!agree){
                toast.error("Please agree to the terms");
                setLoading(false);
                return;
            }
    
            if(!tokenId){
                toast.error("Token ID not found");
                setLoading(false);
                return;
            }
    
            if(!address){
                toast.error("Please connect wallet");
                setLoading(false);
                return;
            }
            
            if(cover && pdf){
                const formData = new FormData();
                formData.append('name', bookName);
                formData.append('isbn', isbn);
                formData.append('description', bookDesc);
                tags.forEach(element => {
                    formData.append('tags', element);
                });
                formData.append('artist', illustrationArtist);
                formData.append('price', mintPrice.toString());
                formData.append('maxMint', maxMints.toString());
                formData.append('content', pdf as Blob);
                formData.append('cover', cover as Blob);
                formData.append('contractAdd', String(user?.contractAdd) as string);
                formData.append('tokenId', tokenId);
                formData.append('wallet', address.toString() as string);
                formData.append('publishStatus', publish)
                formData.append("id", id);

                console.log("TRIGGER NORMAL DRAFT", cover, pdf);
        
                const response = await axios.post("/api/uploadBook", formData);
                console.log(response.data);
            }

            if(!cover && !pdf && id !== ""){
                const formData = new FormData();
                formData.append('name', bookName);
                formData.append('isbn', isbn);
                formData.append('description', bookDesc);
                tags.forEach(element => {
                    formData.append('tags', element);
                });
                formData.append('artist', illustrationArtist);
                formData.append('price', mintPrice.toString());
                formData.append('maxMint', maxMints.toString());
                formData.append('id', id.toString());
                formData.append('contractAdd', String(user?.contractAdd) as string);
                formData.append('tokenId', tokenId);
                formData.append('wallet', address.toString() as string);
                formData.append('publishStatus', publish);
        
                const response = await axios.patch("/api/uploadBook", formData);
                console.log(response.data);
            }

            if(!cover && !pdf && id == ""){
                const formData = new FormData();
                formData.append('name', bookName);
                formData.append('isbn', isbn);
                formData.append('description', bookDesc);
                tags.forEach(element => {
                    formData.append('tags', element);
                });
                formData.append('artist', illustrationArtist);
                formData.append('price', mintPrice.toString());
                formData.append('maxMint', maxMints.toString());
                formData.append('id', id.toString());
                formData.append('contractAdd', String(user?.contractAdd) as string);
                formData.append('tokenId', tokenId);
                formData.append('wallet', address.toString() as string);
                formData.append('publishStatus', publish);
        
                const response = await axios.post("/api/uploadBook", formData);
                console.log(response.data);
            }

            if(cover && !pdf){
                const formData = new FormData();
                formData.append('name', bookName);
                formData.append('isbn', isbn);
                formData.append('description', bookDesc);
                tags.forEach(element => {
                    formData.append('tags', element);
                });
                formData.append('artist', illustrationArtist);
                formData.append('price', mintPrice.toString());
                formData.append('maxMint', maxMints.toString());
                formData.append('id', id);
                formData.append('cover', cover as Blob);
                formData.append('contractAdd', String(user?.contractAdd) as string);
                formData.append('tokenId', tokenId);
                formData.append('wallet', address.toString() as string);
                formData.append('publishStatus', publish);
        
                const response = await axios.post("/api/uploadBook", formData);
                console.log(response.data);
            }

            if(!cover && pdf){
                const formData = new FormData();
                formData.append('name', bookName);
                formData.append('isbn', isbn);
                formData.append('description', bookDesc);
                tags.forEach(element => {
                    formData.append('tags', element);
                });
                formData.append('artist', illustrationArtist);
                formData.append('price', mintPrice.toString());
                formData.append('maxMint', maxMints.toString());
                formData.append('id', id);
                formData.append('content', pdf as Blob);
                formData.append('contractAdd', String(user?.contractAdd) as string);
                formData.append('tokenId', tokenId);
                formData.append('wallet', address.toString() as string);
                formData.append('publishStatus', publish);
        
                const response = await axios.post("/api/uploadBook", formData);
                console.log(response.data);
            }

            if(publish == "publish"){
                
                contractPublishBook();
                
            }
            else{
                router.push("/authors")
            }
        }

        catch(err){
            toast.error("Failed Interaction")

            axios.patch("/api/book/"+id,{isPublished: false});
            console.log(err);
            setLoading(false);

        }

    }


    useEffect(()=>{
        setBookName(localStorage.getItem('name') || "");
        setBookDesc(localStorage.getItem("description") || "")
        setIllustrationArtist(localStorage.getItem("artist") || "")
        setCoverLink(localStorage.getItem("cover") || "");
        setFileLink(localStorage.getItem("pdf") || "")
        console.log("THIS IS ID",localStorage.getItem("id"))
        setId(localStorage.getItem("id") || "")
        //@ts-ignore
        setTags(JSON.parse(localStorage.getItem("tags")) || [])

        //@ts-ignore
        setIsbn(localStorage.getItem("isbn") || "")

        //@ts-ignore
        setMintPrice(localStorage.getItem("price") || 0)

        //@ts-ignore
        setMaxMints(localStorage.getItem("maxMints") || 0);


    },[])


    return(
        <div className="md:px-16 pt-24 max-md:px-4 w-screen h-screen flex flex-col items-start justify-start">
            <div className="flex w-screen justify-end absolute">
               <Navbar/>
            </div>

            {loading && <Loader/>}

            <h3 className="text-3xl font-bold">Publish Your Book</h3>

            <OptionToggle options={["Upload PDF", "Write your Own"]} selectedOption={option} setOption={setOption} />

            <div className="md:w-[100%] flex max-md:items-center max-md:justify-center max-md:flex-col gap-10 mt-5">
                <div className="relative w-44">
                    {/* Image Holder */}
                    <div className="h-44 md:absolute relative z-[2] w-32 mt-4 bg-gray-500 rounded-lg shadow-lg shadow-black/10">

                            <label htmlFor="dropzone-file2" className=" w-full h-full bg-red-600 group rounded-xl cursor-pointer ">
                                <div className="flex flex-col items-center h-full w-full overflow-hidden justify-center rounded-lg">
                                    {!cover ? <div className=" flex flex-col items-center justify-center w-full h-full rounded-md hover:bg-white/20 duration-200">
                                            
                                            {coverLink !== "" ? <div className=" flex flex-col items-center justify-center w-full h-full rounded-md hover:bg-white/20 duration-200">
                                                <Image width={1080} height={1080} src={coverLink} alt="nothing" className=" object-cover w-full h-full hover:scale-110 hover:opacity-50 duration-150 " />
                                            </div>:
                                            <>
                                            <FaImage className=" text-xl text-white mb-2 " />
                                            <h3 className="w-[80%] font-bold text-base text-center text-white">Upload Cover Image</h3>
                                            </>
                                            }
                                            
                                        </div> :
                                        <div className=" flex flex-col items-center justify-center w-full h-full rounded-md hover:bg-white/20 duration-200">
                                            <Image width={500} height={500} className=" object-cover w-full h-full hover:scale-110 hover:opacity-50 duration-150 " src={!cover ? "" : (cover instanceof File ? URL.createObjectURL(cover) : cover)} alt=""/>
                                        </div>
                                    }
                                </div>
                                <input id="dropzone-file2" type="file" accept='image/*' onChange={handleCoverChange} className="hidden" />
                            </label>
                    </div>
                    <div className="absolute z-[1] h-44 w-32 top-1 left-1 mt-4 bg-white rounded-lg shadow-lg shadow-black/10">
                        
                    </div>

                    
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-4">
                        <div className="w-full text-start flex flex-col">
                            <input onKeyDown={(e)=>{if(characterName == 20 && e.key == "Backspace"){setCharacterName((prev)=>(prev-1))}}} placeholder="Enter Book Name..." onChange={(e) => { setRequiredName(false); if(characterName < 20){setBookName(e.target.value); setCharacterName(e.target.value.length) }}} value={bookName} className={`p-2 placeholder:text-gray-300 w-full peer focus:outline-none ${requiredName ? "border-red-500" : "border-gray-400"} focus:border-black focus:border-2 rounded-xl border-[1px] duration-200 `}></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Book Name <span className="text-xs">{characterName}/20 chars</span><span className="text-red-500 ml-1" >*</span></h2>
                        </div>

                        <div className="w-full text-start flex flex-col">
                            <input placeholder="ISBN Number" onChange={(e) => { setIsbn(e.target.value) }} value={isbn} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">ISBN</h2>
                        </div>

                    </div>

                    <div className="w-full text-start flex flex-col">
                        <textarea onKeyDown={(e)=>{if(characterDesc == 200 && e.key == "Backspace"){setCharacterDesc((prev)=>(prev-1))}}} placeholder="Description..." onChange={(e) => { if(characterDesc < 200){setBookDesc(e.target.value); setCharacterDesc(e.target.value.length) }}} value={bookDesc} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2 h-64 rounded-xl border-[1px] duration-200 border-gray-400"></textarea>
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Book Description <span className="text-xs">{characterDesc}/200 chars</span></h2>
                    </div>

                    <div className="w-full text-start flex flex-col">
                        <input placeholder="Add tags to get noticed (Enter to create)" onKeyDown={(e)=>{if(e.key == "Enter" && tags.length<5){setTags((prev)=>[...prev, currentTag.toLowerCase()]); setCurrentTag("")};}} onChange={(e) => {setRequiredTags(false);if(tags.length<5)setCurrentTag(e.target.value) }} value={currentTag} className={`p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 ${requiredTags ? "border-red-500" : "border-gray-400"}`}></input>
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Tags (upto 5)<span className="text-red-500 ml-1" >*</span></h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((item, i)=>(
                                <div className="py-2 min-w-20 px-2 rounded-xl flex gap-2 items-center justify-center bg-gray-300 border-2 border-gray-500 font-semibold text-center text-gray-500 text-xs">
                                    {item}
                                    <button onClick={()=>{removeTag(i)}} className="hover:text-white duration-200" ><ImCross/></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full text-start flex flex-col">
                        <input placeholder="Pablo Picasso" onKeyDown={(e)=>{if(characterArtist == 20 && e.key == "Backspace"){setCharacterArtist((prev)=>(prev-1))}}} onChange={(e) => { if(characterArtist < 20){setIllustrationArtist(e.target.value); setCharacterArtist(e.target.value.length) }}} value={illustrationArtist} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Illustration Artist <span className="text-xs">{characterArtist}/20 chars</span></h2>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-full text-start flex flex-col">
                            <input placeholder={`Leave ${0} if free mint`} min={0} type="number" onChange={(e) => { setMintPrice(Number(e.target.value)) }} value={mintPrice} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Mint Price (Leave 0 for free mint)</h2>
                        </div>

                        <div className="w-full text-start flex flex-col">
                            <input type="number" min={0} placeholder={`Leave 0 if no max limit`} onChange={(e) => { setMaxMints(Number(e.target.value)) }} value={maxMints} className="p-2 placeholder:text-gray-300 w-full peer focus:outline-none focus:border-black focus:border-2  rounded-xl border-[1px] duration-200 border-gray-400"></input>
                            <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Max Mints (Leave 0 for no limit)</h2>
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-center md:justify-start md:w-[40%]">
                        <h2 className="text-sm text-semibold text-gray-400 order-first mt-4 peer-focus:text-black peer-focus:font-semibold duration-200">Upload Pdf<span className="text-red-500 ml-1" >*</span></h2>

                            <div>
                                <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-48 h-48 border-2 ${requiredPdf ? "border-red-500"  : "border-jel-gray-3" } border-dashed group rounded-xl mt-2 cursor-pointer hover:bg-jel-gray-1`}>
                                    <div className="flex flex-col items-center h-full w-full p-2 overflow-hidden justify-center rounded-lg">
                                        {!pdf ? <div className="bg-gray-300 text-gray-500 gap-2 flex flex-col items-center justify-center w-full h-full rounded-xl">
                                                <FaFilePdf className="text-xl" />
                                                <h3 className="w-[80%] text-xs text-center">Use .pdf files only with white background for best readability.</h3>
                                            </div> :
                                            <div className="text-sm font-bold group-hover:scale-105 duration-200">
                                                {pdf.name}
                                            </div>
                                        }
                                    </div>
                                    <input id="dropzone-file" type="file" accept='application/pdf' onChange={(e)=>{handlePdfChange(e); setRequiredPdf(false)}} className="hidden" />
                                </label>
                                {/* <button onClick={handleSubmit} disabled={uploading} className=' col-span-2 w-32 py-2 font-medium text-black rounded-xl hover:-translate-y-[0.3rem] duration-200 bg-jel-gray-3 hover:bg-jel-gray-2 text-nowrap mt-2'>{uploading ? "Uploading..." : "Upload"}</button> */}
                            </div>
                        {fileLink!=="" && <a href={fileLink} target="_blank" className="text-md mt-5 ml-4 font-bold flex items-center justify-center h-10 w-40 rounded-lg gap-2 bg-black text-white hover:-translate-y-1 duration-200" >Uploaded <FaArrowPointer/> </a>}
                        </div> 
                </div>

                <div className=" w-[23rem] h-full border-l-2 border-dashed border-gray-300 text-gray-400 text-sm pl-6">
                    <ul className="list-disc flex flex-col gap-10">
                        <li>
                            <h2><b>Creating</b> a draft requires a pdf</h2>
                        </li>
                        <li>
                            <h2>After creating a draft you can edit it as many times you want</h2>
                        </li>
                    </ul>
                 
                </div>
            </div>

            <div className="w-full flex max-md:flex-col max-md:items-center max-md:justify-center gap-6 mt-20 pb-10 items-center justify-center md:justify-end">
                <div className="flex gap-2 items-center justify-center text-gray-400">
                    <button onClick={()=>{
                        setAgree((prev)=>(!prev));
                    }} className="border-[1px] h-8 w-8 flex items-center justify-center border-gray-400 rounded-md">
                        {agree && <FaSquareCheck className="h-7 w-7"/>}
                    </button>
                    <h2 className="text-start max-md:w-full" >I agree that have the rights of everything I am publishing</h2>
                </div>
                <button onClick={()=>{setLoading(true); getContractDetails("draft")}} className='text-black bg-gray-200 h-10 w-48 font-bold rounded-lg hover:-translate-y-1 px-3 py-1 transform transition duration-200 ease-in-out flex items-center justify-center flex-col gap-0' >Save Draft</button>
                <button onClick={()=>{setLoading(true); getContractDetails("publish")}} className='text-white bg-black h-10 w-48 font-bold rounded-lg hover:-translate-y-1 px-3 py-1 transform transition duration-200 ease-in-out flex items-center justify-center flex-col gap-0'>Publish</button>
            </div>

            

        </div>
    )
}