"use client"

import { usePathname } from "next/navigation"
import { ethers } from "ethers";
import abi from "@/utils/abis/templateABI"
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosRocket, IoMdTrash } from "react-icons/io";

import { useGlobalContext } from "@/context/MainContext";
import { useRouter } from "next/navigation";
import { FaChartLine, FaEdit, FaEye, FaEyeSlash, FaPen, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { IoClose, IoTrashBin } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import Book from "@/components/Global/Book";
import { Analytics } from "@/components/Author/Analytics";
import Link from "next/link";
import { useLoading } from "@/components/PageLoader/LoadingContext";
import { useSession } from "next-auth/react";
import { useExitAlert } from "@/components/alert/alert";
import { RiLoader5Line } from "react-icons/ri";
import { MdContentCopy } from "react-icons/md";

export default function Home(){

    const router = useRouter()
    const {setIsLoading} = useLoading()
    const {user, getUser} = useGlobalContext();

    const pathname = usePathname()

    const[profileImgLink, setProfileImgLink] = useState<string>("")
    const[bannerLink, setBannerLink] = useState<string>("")

    const[publishedBooks, setPublishedBooks] = useState([])
    const[draftBooks, setDraftBooks] = useState([])
    const[hiddenBooks, setHiddenBooks] = useState([])

    const[slicer, setSlicer] = useState<number>(4);

    const[addtime, setAddtime] = useState("");

    const[loading, setLoading] = useState(false);
  
    const[id, setId] = useState("");
    const[price, setPrice] = useState("");
  
    const[boostModal, setBoostModal] = useState(false);

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
            // console.log(contract?.address);
            const contractName = await contract?.name();

            // console.log(contractName);

            setName(contractName);
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        // console.log(user)

        if(user){
            // console.log("checking");
            if( user?.contractAdd == ""){
                setIsLoading(true);
                router.push("/makeCollection");
            }
            setProfileImgLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + user.wallet + "/info/profileImage?v="+Date.now());
            setBannerLink("https://nifty-tales.s3.ap-south-1.amazonaws.com/users/" + user.wallet + "/info/bannerImage?v="+Date.now());
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
                    // console.log(item);
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

        if(screenWidth > 1100){
            setSlicer(5);
        }

    },[])

    function handleDraft(item:any){
        setIsLoading(true);
        // console.log(item.cover, item.pdf, item.name, item.tags);
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

    const {data:session} = useSession();


    async function handleSubmit(e:any) {
        e.preventDefault();

        if(!user?.wallet){
            toast.error("Somwthing went wrong. Please try again");
            return;
        }

        try {

            // Create FormData object
            const formData = new FormData();

            //@ts-ignore
            if(!bannerImg && profileImg && user){
                formData.append("profileImage", profileImg);
                formData.append("wallet", user?.wallet);

            }

            //@ts-ignore
            if(bannerImg && !profileImg && user){
                // console.log("brooo")
                formData.append("bannerImage", bannerImg);
                formData.append("wallet", user?.wallet);
            }

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
            // console.log(session);
        }
    }

    async function deleteBook(id:string){
        try{
            // console.log(id);
            await axios.delete("/api/book/"+id).then((res)=>{
                // console.log(res.data.data);
                getUser();
            })
        }
        catch(err){
            // console.log(err);
        }
    }

    async function unHide(id:string){
        try{
            // console.log(id);
            await axios.patch("/api/book/"+id,{isHidden : false}).then((res)=>{
                // console.log(res.data.data);
                getUser();
            })
        }
        catch(err){
            // console.log(err);
        }
    }

    async function hide(id:string){
        try{
            // console.log(id);
            await axios.patch("/api/book/"+id,{isHidden : true}).then((res)=>{
                // console.log(res.data.data);
                getUser();
            })
        }
        catch(err){
            // console.log(err);
        }
    }

   
  useEffect(()=>{
    setIsLoading(false);
    getUser();
  },[])

  async function handleBoost() {
    try {
      setLoading(true);
      if (typeof window.ethereum !== 'undefined') {
        useExitAlert("Are you sure you want to leave this page? Your progress will be lost. IF A TRANSACTION HAS BEEN CONFIRMED, GOING BACK WILL CAUSE PROBLEMS.");

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
  
        const totalPrice = ethers.BigNumber.from(price);
        const amount1 = totalPrice.mul(80).div(100); // 80%
        const amount2 = totalPrice.mul(20).div(100); // 20%
  
        console.log("PRICE", ethers.utils.formatEther(totalPrice));
  
        const tx1 = await signer.sendTransaction({
          to: "0x1DbCE30361C2cb8445d02b67A75A97f1700D90A9",
          value: amount1
        });
  
        await tx1.wait();
  
        const tx2 = await signer.sendTransaction({
          to: "0x705b8f77d90Ebab24C1934B49724686b8ee27f5F",
          value: amount2
        });
  
        await tx2.wait();
  
        await axios.patch("/api/book/"+id, {isBoosted: String(Date.now()+Number(addtime))});
        toast.success("Book boosted");
        setLoading(false);
        setBoostModal(false);
      } 
    } catch (err) {
      setLoading(false);
    //   await axios.patch("/api/book/"+id, {isBoosted: null});
      toast.error("An error occured")
      console.error(err);
    }
  }


  async function tokenChecker() {
    try {
      const res = await axios.get("/api/tokenChecker");
      console.log(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/connect');
      } else {
        console.error("An error occurred:", error);
      }
    }
  }

  useEffect(() => {
    tokenChecker();
  }, []);

  


    return(
        <div className="">
            {/* <div className="h-16 w-screen relative z-[1000]">
                <Navbar/>
            </div> */}

        {/* BOOST MODAL */}
        <div className={`w-screen h-screen fixed top-0 left-0 ${boostModal ? "translate-y-0" : "-translate-y-[100rem]"} backdrop-blur-xl duration-200 flex z-[100] items-center justify-center`}>
          <div className='bg-white shadow-xl shadow-black/30 w-80 rounded-xl p-4 '>
            <h2 className='text-2xl font-bold mb-5'>Duration</h2>
              <div className='flex gap-2 flex-wrap items-center justify-center'>
                    <button onClick={()=>{setPrice("1000000000000000"); setAddtime("86400000")}} className={`flex flex-col ${price == "1000000000000000" && " brightness-125 border-black border-2 "} items-center justify-center w-32 bg-nifty-gray-1/30 hover:scale-105 p-2 rounded-lg duration-200 text-nifty-gray-1-2/80`}>
                      <h2 className='font-bold text-md'>1 Day</h2>
                      <h2 className='font-bold text-sm'>0.001 ETH</h2>
                    </button>
                    <button onClick={()=>{setPrice("2500000000000000"); setAddtime("259200000")}} className={`flex flex-col ${price == "2500000000000000" && " brightness-125 border-black border-2 "} items-center justify-center w-32 bg-nifty-gray-1/30 hover:brightness-110 p-2 rounded-lg duration-200 hover:scale-105 text-nifty-gray-1-2/80`}>
                      <h2 className='font-bold text-md'>3 Days</h2>
                      <h2 className='font-bold text-sm'>0.0025 ETH</h2>
                    </button>
                    <button onClick={()=>{setPrice("5000000000000000"); setAddtime("604800000")}} className={`flex flex-col ${price == "5000000000000000" && " brightness-125 border-black border-2 "} items-center justify-center w-32 bg-nifty-gray-1/30 hover:brightness-110 p-2 rounded-lg duration-200 hover:scale-105 text-nifty-gray-1-2/80`}>
                      <h2 className='font-bold text-md'>1 Week</h2>
                      <h2 className='font-bold text-sm'>0.005 ETH</h2>
                    </button>
                    <button onClick={()=>{setPrice("15000000000000000"); setAddtime("2419200000")}} className={`flex flex-col ${price == "15000000000000000" && " brightness-125 border-black border-2 "} items-center justify-center w-32 bg-nifty-gray-1/30 hover:brightness-110 p-2 rounded-lg duration-200 hover:scale-105 text-nifty-gray-1-2/80`}>
                      <h2 className='font-bold text-md'>1 Month</h2>
                      <h2 className='font-bold text-sm'>0.015 ETH</h2>
                    </button>
              </div>

              <div className='w-full flex gap-2 items-center justify-center mt-5'>
                <button onClick={handleBoost} className="bg-black text-white font-semibold  h-10 w-1/2 rounded-lg hover:-translate-y-1 duration-200" >{loading ?<div className='w-full flex items-center justify-center'><RiLoader5Line className="animate-spin text-xl" /></div> : "Confirm"}</button>
                <button onClick={()=>{setBoostModal(false)}} className="bg-gray-200 font-semibold  text-black h-10 w-1/2 rounded-lg hover:-translate-y-1 duration-200" >Cancel</button>
              </div>
          </div>
        </div>


            {/* Image Modal */}
            <div className={`h-screen w-screen backdrop-blur-xl z-[100] flex items-center justify-center fixed top-0 ${imageModal ? "translate-y-0": "-translate-y-[120rem]"} duration-300 ease-in-out left-0`}>
                <div className="bg-white gap-4 max-md:w-[90%] h-84 w-80 rounded-xl p-6 flex flex-col items-center justify-center" >
                    <div className="w-full items-end flex justify-end text-xl"><button onClick={()=>{setImageModal(false)}} className="text-black hover:text-red-500 duration-200" ><IoClose/></button></div>
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
                    <div className="w-full items-end flex justify-end text-xl"><button onClick={()=>{setBannerModal(false)}} className="text-black hover:text-red-500 duration-200" ><IoClose/></button></div>
                    <div className="w-full h-full" >
                        <label htmlFor="banner-dropzone-file" className="flex rounded-xl flex-col items-center justify-center w-full h-full border-2 border-jel-gray-3 border-dashed  cursor-pointer hover:bg-jel-gray-1">
                            <div className="flex flex-col items-center h-32 w-full p-2 overflow-hidden justify-center rounded-lg">
                                {!bannerImg ? <div className="w-full h-full bg-gray-200 rounded-xl flex flex-col items-center justify-center">
                                        <CiImageOn className="text-xl text-nifty-gray-1" />
                                        <h3 className="text-xs text-nifty-gray-1 text-center font-semibold" >Upload a 1500x500 png image for best quality</h3>
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
                

                <div className="w-screen flex item-center justify-center group absolute h-full overflow-hidden">
                    <button onClick={()=>{setBannerModal(true)}} className="py-2 bg-black/30 h-12 w-12 relative z-[70] mt-4 max-md:text-sm flex items-center justify-center text-white font-bold gap-2 rounded-full hover:-translate-y-1 duration-200"><FaEdit/></button>

                    <Image width={1080} height={1080} src={bannerLink || ""} alt="dp" className="w-full h-full object-cover object-center absolute top-1/2 left-1/2 transform -translate-x-1/2 brightness-75 -translate-y-1/2"/>
                </div>
                <button onClick={()=>{navigator.clipboard.writeText("https://niftytales.xyz/authors/"+address); toast.success("Successfully copied link!")}} className='absolute bottom-0 right-0 bg-white/10 px-4 py-2 z-[100] text-white font-semibold md:right-0 rounded-tl-xl border-t-[1px] hover:bg-white/20 duration-200 border-l-[1px] border-white'>
                    <MdContentCopy/>
                </button>
                <div className="flex gap-8 object-center items-center h-full md:px-10 w-screen justify-center md:justify-start my-auto relative z-50 backdrop-blur-xl">
                    
                    <button onClick={()=>{setImageModal(true)}} className="rounded-full group relative duration-200 flex items-center justify-center">
                        <FaPen className="group-hover:opacity-100 opacity-0 duration-200 absolute z-50 text-xl text-white brightness-200" />
                        <Image width={1080} height={1080} src={profileImgLink || ""} alt="dp" className="md:w-[10rem] group-hover:brightness-50 duration-200 md:h-[10rem] h-[6rem] w-[6rem] border-4 border-white rounded-xl" />
                    </button>
                    <div className="flex flex-col gap-2 relative z-50">
                        <h2 className="md:text-5xl text-xl font-bold text-white">{user?.collectionName}</h2>
                        <a href={`https://basescan.org/address/${user?.contractAdd}`} target="_blank" className="md:text-md text-sm underline font-semibold text-white">{user?.contractAdd.substring(0,7)}...{user?.contractAdd.substring(user.contractAdd.length-7, user.contractAdd.length)}</a>
                    </div>
                </div>

                <div className="absolute right-3 top-3 md:right-3 gap-4 flex items-end justify-end z-50">
                        <Link href="#analytics" className="py-2 bg-white/10 md:w-40 max-md:text-sm w-12 h-10 border-[1px] border-white flex items-center justify-center text-white font-bold gap-2 rounded-lg hover:-translate-y-1 duration-200" ><span className="max-md:hidden" >Analytics</span> <FaChartLine/></Link>                
                        </div>
            </div>
            

            { user && user?.yourBooks?.length == 0 && user?.contractAdd !== "" ? <div className="w-screen h-[25rem] flex items-center justify-center flex-col">
                <h2 className="text-xl font-bold">Publish your first book!</h2>
                <button onClick={()=>{setIsLoading(true);router.push("/publish")}} className='bg-[#000000] rounded-lg hover:-translate-y-1 duration-200 text-[#eeeeee] h-10 font-semibold flex items-center justify-center gap-2 px-5 w-52 my-2 max-md:mx-auto'>Publish</button>
            </div>: 
            <>

                {/* PUBLISHED BOOKS */}
                {user && user?.contractAdd !== "" && <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
                    <div className="flex items-center justify-center w-full mb-5">
                        <div className="w-1/2 flex items-start justify-start ">
                            <h3 className="text-2xl font-bold">Your Books</h3>
                        </div>
                        <div className="w-1/2 flex justify-end">
                            <button onClick={()=>{setIsLoading(true);router.push("/publish")}} className='bg-[#000000] rounded-lg hover:-translate-y-1 duration-200 text-[#eeeeee] h-10 font-semibold flex items-center max-md:-mr-2 justify-center gap-2 px-5 w-24 my-2 max-md:mx-auto'>+ New</button>
                        </div>
                    </div>

                    {publishedBooks.map((item:any)=>(
                        <div className="w-full mb-5">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item.map((item2:any)=>(<div className="flex group relative flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                            <div onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="flex cursor-pointer gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-md:w-[110%] max-md:translate-y-3 w-[80%]  text-white rounded-b-xl to-black/50 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name.slice(0,15)}</h2>
                            </div>
                            <div className="absolute z-50 top-1 flex gap-2 " >
                                <button onClick={()=>{hide(item2._id)}} className="bg-black text-white p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><FaEyeSlash/></button>
                                <button onClick={()=>{setId(item2._id);setBoostModal(true)}} className="bg-gray-200 text-nifty-gray-1-2 p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><IoIosRocket/></button>
                            </div>
                            <button onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:-translate-y-2 duration-200 justify-center " >
                                <Book img={item2.cover} />
                            </button>
                        </div>
                        ))}
                        </div>
                            <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-gray-300 relative z-10">
                            </div>
                        </div>
                    ))}

                    


                </div>}

                {/* HIDDEN BOOKS */}
                { hiddenBooks.length > 0 && <div className="flex flex-col items-start mt-8 justify-center md:px-10 px-4">
                <div className="w-full mb-5">
                    
                        <h3 className="text-2xl font-bold ">Hidden</h3>
                </div>
                {hiddenBooks.map((item:any)=>(
                        <div className="w-full mb-5">
                        <div className="w-full max-md:flex max-md:flex-wrap max-md:gap-6 items-center max-sm:justify-center sm:justify-start md:gap-2 md:grid md:grid-flow-col min-[1100px]:grid-cols-5 md:grid-cols-4 " >
                        {item.map((item2:any)=>(<div className="flex group relative flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                            <div onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="flex cursor-pointer gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-md:w-[110%] max-md:translate-y-3 w-[80%]  text-white rounded-b-xl to-black/50 items-center justify-center"> 
                                <h2 className="font-semibold text-sm mt-5" >{item2.name.slice(0,15)}</h2>
                            </div>
                            <div className="absolute z-50 top-1  " >
                                <button onClick={()=>{unHide(item2._id)}} className="bg-black text-white p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><FaEye/></button>
                            </div>
                            <button onClick={()=>{setIsLoading(true);router.push("/books/"+item2._id)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                                <Book img={item2.cover} />
                            </button>
                        </div>
                        ))}
                        </div>
                            <div className="w-full h-5 max-md:hidden rounded-md shadow-xl shadow-black/30 bg-gradient-to-b from-white to-gray-300 relative z-10">
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
                {item.map((item2:any)=>(<div className="flex group relative flex-col items-center px-2 md:px-10 mt-2 justify-center gap-4">
                    <div onClick={()=>{handleDraft(item2)}} className="flex cursor-pointer gap-2 absolute bottom-0 pb-2 group-hover:opacity-100 opacity-0 h-20 duration-200 bg-gradient-to-b from-transparent z-50 max-md:w-[110%] max-md:translate-y-3 w-[80%]  text-white rounded-b-xl to-black/50 items-center justify-center"> 
                    <h2 className="font-semibold text-sm mt-5" >{item2.name.slice(0,15)}</h2>
                            </div>
                            <div className="absolute z-50 top-1  " >
                                <button onClick={()=>{deleteBook(item2._id)}} className="bg-black text-white p-2 text-xl rounded-lg opacity-0 group-hover:opacity-100 duration-200" ><IoMdTrash/></button>
                            </div>

                    <button onClick={()=>{handleDraft(item2)}} className="md:w-40 md:h-68 w-32 max-md:h-44 flex flex-col cursor-pointer relative items-center hover:scale-105 hover:-translate-y-2 duration-200 justify-center " >
                        <Book img={item2.cover} />
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

            <Analytics/>
        </div>
    )

}