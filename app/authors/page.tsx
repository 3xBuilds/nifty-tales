"use client"

import { usePathname } from "next/navigation"
import { ethers } from "ethers";
import abi from "@/utils/abis/templateABI"
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdTrash } from "react-icons/io";
import { WalletConnectButton } from "@/components/buttons/WalletConnectButton";
import Navbar from "@/components/Home/Navbar";
import { useGlobalContext } from "@/context/MainContext";
import { useRouter } from "next/navigation";
import { FaEdit, FaEye, FaEyeSlash, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { IoClose, IoTrashBin } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import placeholder from "@/assets/books/NIFTYTALES.png"

export default function Home(){

   

    const router = useRouter()

    const {user, getUser} = useGlobalContext();

    const[profileImgLink, setProfileImgLink] = useState<string>("")
    const[bannerLink, setBannerLink] = useState<string>("")

    const[publishedBooks, setPublishedBooks] = useState([])
    const[draftBooks, setDraftBooks] = useState([])
    const[hiddenBooks, setHiddenBooks] = useState([])

    const[slicer, setSlicer] = useState<number>(4);

    const[name, setName] = useState<string>("")

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

            return contract;

            }

        }
        catch (err) {
            console.error(err);
        }
    }

    async function getContractDetails(){
        try{
            const contract = await contractSetup();
            console.log(contract?.address);
            const contractName = await contract?.name();

            console.log(contractName);

            setName(contractName);
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        if(user){
            setProfileImgLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + user.wallet + "/info/profileImage");
            setBannerLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + user.wallet + "/info/bannerImage");
            getContractDetails();

        }
    },[user])

    useEffect(()=>{
        if(user){

            var arr1:any= []
            var subArr1:any = []
            var arr2:any = []
            var subArr2:any = []

            var arr3: any = []
            var subArr3:any = []


            user.yourBooks.reverse().map((item:any, i)=>{
                if(item.isPublished && !item.isHidden){
                    
                    subArr1.push(item);
                }
                if(subArr1.length == slicer || i == user.yourBooks.length-1){
                    if(subArr1.length>0)
                    arr1.push(subArr1);
                    subArr1 = []
                }
                if(!item.isPublished){
                    subArr2.push(item);
                    console.log(item);
                }
                if(subArr2.length == slicer || i == user.yourBooks.length-1){
                    if(subArr2.length>0)
                    arr2.push(subArr2);
                    subArr2 = []
                }

                if(item.isPublished && item.isHidden){
                    subArr3.push(item);
                }
                if(subArr3.length == slicer || i == user.yourBooks.length-1){
                    if(subArr3.length>0)
                    arr3.push(subArr3);
                    subArr3 = []
                }
            })

            //@ts-ignore
            // if(arr1[0].length > 0)
            setPublishedBooks(arr1);

            setHiddenBooks(arr3);
            //@ts-ignore
            setDraftBooks(arr2);
        }
    },[slicer, user])

    useEffect(()=>{
        const screenWidth = window.innerWidth;

        if(screenWidth > 1200){
            setSlicer(5);
        }

    },[])

    function handleDraft(item:any){
        console.log(item);
        localStorage.setItem("name", item.name);
        localStorage.setItem("id", item._id);

        localStorage.setItem("price", item.price);
        localStorage.setItem("maxMint", item.maxMint);
        localStorage.setItem("cover", item.cover);
        localStorage.setItem("artist", item.artist);
        localStorage.setItem("isbn", item.ISBN);
        localStorage.setItem("description", item.description);
        localStorage.setItem("tags", JSON.stringify(item.tags));
        localStorage.setItem("pdf", item.pdf);

        router.push("/publish")
    }

    const [profileImg, setProfileImg] = useState<File | null>(null);
    const [bannerImg, setBannerImg] = useState<File | null>(null);

    const [imageModal, setImageModal] = useState<boolean>(false);
    const [bannerModal, setBannerModal] = useState<boolean>(false);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileImg(e.target.files[0]);
        }
    };
    
    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {

            setBannerImg(e.target.files[0]);
        }
    };

    const {address} = useAccount();


    async function handleSubmit(e:any) {
        e.preventDefault();

        if(!address){
            toast.error("Somwthing went wrong. Please try again");
            return;
        }

        try {

            // Create FormData object
            const formData = new FormData();

            //@ts-ignore
            if(!bannerImg && profileImg)
            formData.append("profileImage", profileImg);

            formData.append("wallet", String(address));

            //@ts-ignore
            if(bannerImg && !profileImg)
            formData.append("bannerImage", bannerImg);


            // Upload to S3 using the API route
            const response = await axios.patch('/api/profileCreate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            if (response.status !== 200) {
                toast.error("An error occurred while uploading.");
                return;
            }

            // Reset form fields
            if(response.status == 200){
                window.location.reload();
            }

            // alert("Collection created successfully!");
        } catch (error) {
            toast.error("An error occurred while creating the collection. Please try again.");
            console.log(error);
        }
    }

    async function deleteBook(id:string){
        try{
            console.log(id);
            await axios.delete("/api/book/"+id).then((res)=>{
                console.log(res.data.data);
                getUser();
            })
        }
        catch(err){
            console.log(err);
        }
    }

    async function unHide(id:string){
        try{
            console.log(id);
            await axios.patch("/api/book/"+id,{isHidden : false}).then((res)=>{
                console.log(res.data.data);
                getUser();
            })
        }
        catch(err){
            console.log(err);
        }
    }

    async function hide(id:string){
        try{
            console.log(id);
            await axios.patch("/api/book/"+id,{isHidden : true}).then((res)=>{
                console.log(res.data.data);
                getUser();
            })
        }
        catch(err){
            console.log(err);
        }
    }

    return(
        <div className="">
            <div className="h-16 w-screen relative z-[100000]">
                <Navbar/>
            </div>


            {/* Image Modal */}
            <div className={`h-screen w-screen backdrop-blur-xl z-[100] flex items-center justify-center fixed top-0 ${imageModal ? "translate-y-0": "-translate-y-[120rem]"} duration-300 ease-in-out left-0`}>
                <div className="bg-white gap-4 max-md:w-[90%] h-84 w-80 rounded-xl p-6 flex flex-col items-center justify-center" >
                    <div className="w-full items-end flex justify-end text-xl"><button className="text-black hover:text-red-500 duration-200" ><IoClose/></button></div>
                    <div>
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-48 h-48 border-2 border-jel-gray-3 border-dashed rounded-full cursor-pointer hover:bg-jel-gray-1">
                            <div className="flex flex-col items-center h-full w-full p-2 overflow-hidden justify-center rounded-lg">
                                {!profileImg ? <svg className="w-8 h-8 text-jel-gray-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg> :
                                    <Image alt="hello" className='w-full h-full object-cover rounded-full hover:scale-110 hover:opacity-30 duration-300' width={1000} height={1000} src={!profileImg ? "" : (profileImg instanceof File ? URL.createObjectURL(profileImg) : profileImg)} />}
                            </div>
                            <input id="dropzone-file" type="file" accept='image/*' onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>
                    <button onClick={handleSubmit} className="py-2 bg-black md:w-40 max-md:text-sm w-32 flex items-center justify-center text-white font-bold gap-2 rounded-lg hover:-translate-y-1 duration-200">Save</button>
                </div>
            </div>

            {/* Banner Modal */}
            <div className={`h-screen w-screen backdrop-blur-xl z-[100] flex items-center justify-center fixed top-0 ${bannerModal ? "translate-y-0": "-translate-y-[120rem]"} duration-300 ease-in-out left-0`}>
                <div className="bg-white gap-4 max-md:w-[90%] h-84 w-96 rounded-xl p-6 flex flex-col items-center justify-center" >
                    <div className="w-full items-end flex justify-end text-xl"><button className="text-black hover:text-red-500 duration-200" ><IoClose/></button></div>
                    <div className="w-full h-full" >
                        <label htmlFor="banner-dropzone-file" className="flex rounded-xl flex-col items-center justify-center w-full h-full border-2 border-jel-gray-3 border-dashed  cursor-pointer hover:bg-jel-gray-1">
                            <div className="flex flex-col items-center h-32 w-full p-2 overflow-hidden justify-center rounded-lg">
                                {!bannerImg ? <div className="w-full h-full bg-gray-200 rounded-xl flex flex-col items-center justify-center">
                                        <CiImageOn className="text-xl text-gray-400" />
                                        <h3 className="text-xs text-gray-400 font-semibold" >Upload a 1500x500 png image for best quality</h3>
                                    </div> :
                                    <Image alt="hello" className='w-full h-full object-cover rounded-lg hover:scale-110 hover:opacity-30 duration-300' width={1000} height={1000} src={!bannerImg ? "" : (bannerImg instanceof File ? URL.createObjectURL(bannerImg) : bannerImg)} />}
                            </div>
                            <input id="banner-dropzone-file" type="file" accept='image/*' onChange={handleBannerChange} className="hidden" />
                        </label>
                        {/* <button onClick={handleSubmit} disabled={uploading} className=' col-span-2 w-32 py-2 font-medium text-black rounded-xl hover:-translate-y-[0.3rem] duration-200 bg-jel-gray-3 hover:bg-jel-gray-2 text-nowrap mt-2'>{uploading ? "Uploading..." : "Upload"}</button> */}
                    </div>
                    <button onClick={handleSubmit} className="py-2 bg-black md:w-40 max-md:text-sm w-32 flex items-center justify-center text-white font-bold gap-2 rounded-lg hover:-translate-y-1 duration-200">Save</button>
                </div>
            </div>

            <div className="w-screen relative h-[15rem] md:h-[22rem] max-md:flex items-center justify-center overflow-hidden object-fill ">
                <div className="w-screen absolute h-full overflow-hidden">
                    <Image width={1080} height={1080} src={bannerLink || ""} alt="dp" className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 brightness-75 -translate-y-1/2"/>
                </div>
                <div className="flex gap-8 object-center items-center h-full md:px-10 w-screen justify-center md:justify-start my-auto absolute z-50 backdrop-blur-xl">
                    <Image width={1080} height={1080} src={profileImgLink || ""} alt="dp" className="md:w-[10rem] md:h-[10rem] h-[6rem] w-[6rem] border-4 border-white rounded-full" />
                    <div className="flex flex-col gap-2">
                        <h2 className="md:text-5xl text-xl font-bold text-white">{name}</h2>
                        <a href={`https://basescan.org/address/${user?.contractAdd}`} target="_blank" className="md:text-md text-sm underline font-semibold text-white">{user?.contractAdd.substring(0,7)}...{user?.contractAdd.substring(user.contractAdd.length-7, user.contractAdd.length)}</a>
                    </div>
                </div>

                <div className="absolute top-3 md:right-3 gap-4 flex items-center justify-center z-50">
                        <button onClick={()=>{setImageModal(true)}} className="py-2 bg-white/10 md:w-40 max-md:text-sm w-32 flex items-center justify-center text-white font-bold gap-2 rounded-lg hover:-translate-y-1 duration-200">Edit Image <FaEdit/></button>
                        <button onClick={()=>{setBannerModal(true)}} className="py-2 bg-white/10 md:w-40 max-md:text-sm w-32 flex items-center justify-center text-white font-bold gap-2 rounded-lg hover:-translate-y-1 duration-200">Edit Banner <FaEdit/></button>
                </div>
            </div>
            

            { user && user?.yourBooks?.length == 0 ? <div className="w-screen h-[25rem] flex items-center justify-center flex-col">
                <h2 className="text-xl font-bold">Publish your first book!</h2>
                <button onClick={()=>{router.push("/publish")}} className='bg-[#000000] rounded-lg hover:-translate-y-1 duration-200 text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-52 my-2 max-md:mx-auto'>Publish</button>
            </div>: 
            <>

                {/* PUBLISHED BOOKS */}
                <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
                    <div className="flex items-center justify-center w-full mb-5">
                        <div className="w-1/2 flex items-start justify-start ">
                            <h3 className="text-2xl font-bold">Your Books</h3>
                        </div>
                        <div className="w-1/2 flex justify-end">
                            <button onClick={()=>{router.push("/publish")}} className='bg-[#000000] rounded-lg hover:-translate-y-1 duration-200 text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-24 my-2 max-md:mx-auto'>+ New</button>
                        </div>
                    </div>

                    {publishedBooks.map((item:any)=>(
                        <div className="w-full mb-5">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item.map((item2:any)=>(<div className="flex group relative flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                            <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 w-[90%] text-white rounded-b-xl to-black/70 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name}</h2>
                            </div>
                            <div className="absolute z-50 top-1  right-8" >
                                <button onClick={()=>{hide(item2._id)}} className="bg-white text-black p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><FaEyeSlash/></button>
                            </div>
                            <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                                <div className="w-full h-52 overflow-hidden rounded-lg relative z-10">
                                    <Image src={item2.cover} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="w-full h-full shadow-xl shadow-black/40 absolute top-1 left-1 bg-gray-200 rounded-lg z-[9]" >
                                </div>
                            </button>
                        </div>
                        ))}
                        </div>
                            <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-black/20 relative z-10">
                            </div>
                        </div>
                    ))}

                    


                </div>

                {/* HIDDEN BOOKS */}
                { hiddenBooks.length > 0 && <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
                <div className="w-full mb-5">
                    
                        <h3 className="text-2xl font-bold ">Hidden</h3>
                </div>
                {hiddenBooks.map((item:any)=>(
                        <div className="w-full mb-5">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item.map((item2:any)=>(<div className="flex group relative flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                            <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 w-[90%] text-white rounded-b-xl to-black/70 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name}</h2>
                            </div>
                            <div className="absolute z-50 top-1  right-8" >
                                <button onClick={()=>{unHide(item2._id)}} className="bg-white text-black p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><FaEye/></button>
                            </div>
                            <button onClick={()=>{router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                                <div className="w-full h-52 overflow-hidden rounded-lg relative z-10">
                                    <Image src={item2.cover} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="w-full h-full shadow-xl shadow-black/40 absolute top-1 left-1 bg-gray-200 rounded-lg z-[9]" >
                                </div>
                            </button>
                        </div>
                        ))}
                        </div>
                            <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-black/20 relative z-10">
                            </div>
                        </div>
                    ))}
                </div>}

                {/* DRAFT BOOKS */}
               { draftBooks.length > 0 && <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
            <div className="w-full mb-4">
                
                    <h3 className="text-2xl font-bold ">Drafts</h3>
            </div>

            {draftBooks.map((item:any)=>(
                <div className="w-full mb-5">
                <div className="w-full max-md:flex max-md:flex-col max-md:gap-6 md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                {item.map((item2:any)=>(<div  className="flex group relative flex-col items-center px-10 mt-2 justify-center gap-4">
                    <div className="flex gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 w-[90%] text-white rounded-b-xl to-black/70 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name}</h2>
                            </div>
                            <div className="absolute z-50 top-1  right-8" >
                                <button onClick={()=>{deleteBook(item2._id)}} className="bg-white text-black p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><IoMdTrash/></button>
                            </div>

                    <button onClick={()=>{handleDraft(item2)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                        <div className="w-full h-52 overflow-hidden rounded-lg relative z-10">
                            
                            <Image src={item2.cover ? item2.cover : placeholder} alt="cover" width={1080} height={1080} className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="w-full h-full shadow-xl shadow-black/40 absolute top-1 left-1 bg-gray-200 rounded-lg z-[9]" >
                        </div>
                    </button>
                </div>
                ))}
                </div>
                    <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-black/20 relative z-10">
                    </div>
                </div>
            ))}


        </div>}
            </>
            }
        </div>
    )
}