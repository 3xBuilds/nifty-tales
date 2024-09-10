"use client";

import { WalletNotRegistered } from "@/components/popups/walletNotRegistered";
import axios from "axios";
import { ethers } from "ethers";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useEffect
} from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";


type GlobalContextType = {

  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  fetch: boolean | false;
  setFetch: Dispatch<SetStateAction<boolean | false>>;
  getUser: () => void;
  ensNameFetcher: () => boolean;
  ensImageFetcher: () => boolean;
  ensImg: string | "";
  setEnsImg: Dispatch<SetStateAction<string | "">>;
  userRaw: UserType | null;
  setUserRaw: Dispatch<SetStateAction<UserType | null>>;
  publishedBooks: Array<BookType> | null;
  setPublishedBooks: Dispatch<SetStateAction<any | "">>;
  recentBooks: Array<BookType> | null;
  setRecentBooks: Dispatch<SetStateAction<any | "">>;
  boosted: Array<BookType> | null;
  setBoosted: Dispatch<SetStateAction<any | "">>;
}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => { },
  fetch: false,
  setFetch: () => {},
  getUser: () => { },
  ensImageFetcher: () => false,
  ensNameFetcher: () => false,
  ensImg: "",
  setEnsImg: () => {},
  userRaw: null,
  setUserRaw: () =>{ },
  publishedBooks : [],
  setPublishedBooks: () =>{},
  recentBooks : [],
  setRecentBooks: () =>{},
  boosted : [],
  setBoosted: () =>{}
});

export const GlobalContextProvider = ({ children } : { children: ReactNode}) => {

  const {data: session} = useSession();

  const [publishedBooks, setPublishedBooks] = useState([])
  const [recentBooks, setRecentBooks] = useState([])
  const [boosted, setBoosted] = useState([])

  const[slicer, setSlicer] = useState(0);

  const[ensImg, setEnsImg] = useState<string>("");

  const {address} = useAccount();
  const pathname = usePathname();

  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null);

  async function ensImageFetcher(){
    try{
        //@ts-ignore
        const provider = new ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/2L082LzB4Kl82BLjvBpMBgEnz3eTuq1v");
        const ensName = await provider.lookupAddress(address);
        if(!ensName){
          return false;
        }
        const ensAvatar = await provider.getAvatar(ensName);

        if(ensAvatar){
          await axios.patch("/api/user/"+user?.email, {profileImage: ensAvatar}).then((res)=>{
            getUser()
            window.location.reload()

          });
        }
        else{return false};

      return true;
    }
    catch(err){
      console.log(err);
    }
  }

  async function ensNameFetcher(){
    try{
        
        //@ts-ignore
        const provider = new ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/2L082LzB4Kl82BLjvBpMBgEnz3eTuq1v");
        const ensName = await provider.lookupAddress(address);

        if(!ensName){
          return false;
        }

        if(ensName){
        await axios.patch("/api/user/"+user?.email, {username: ensName}).then((res)=>{
          window.location.reload();
        });
      }

    return true;
    }
    catch(err){
      console.log(err);
    }
  }

  async function getUser(){
    try{
      console.log("Getting for ", session?.user?.email)
      await axios.get(`/api/user/${session?.user?.email}`).then((res)=>{
        // console.log("user",res);
        setUser(res.data.user);
        setUserRaw(res.data.unPopulated);
      }).catch((err)=>{
        const user = {username: session?.user?.name, email:session?.user?.email, profileImage: "", wallet: ""}
        //@ts-ignore
        setUser(user);
        // console.log("user",err);
        // router.push("/connect");
      });

    }
    catch(err){
      console.error(err);
    }
  }

  const[fetch, setFetch] = useState(false);

  useEffect(()=>{
    if(session && !user)
    {
      getUser();
    }
  },[session])

  const [userRaw, setUserRaw] = useState<UserType | null>(null);
  const [walletNotRegistered, setWalletNotRegistered] = useState<boolean>(false);

  useEffect(()=>{
    if(user && user.wallet != "" && user.wallet != address){
      setWalletNotRegistered(true);
    }
    else if(user && user.wallet != "" && user.wallet == address){
      setWalletNotRegistered(false);
    }
  },[address])

  useEffect(()=>{
    // console.log(pathname.split("/")[1])
    if(pathname.split("/")[1] !== "publish"){
      localStorage.removeItem("name");
      localStorage.removeItem("id");

      localStorage.removeItem("price");
      localStorage.removeItem("maxMint");
      localStorage.removeItem("cover");
      localStorage.removeItem("artist");
      localStorage.removeItem("isbn");
      localStorage.removeItem("description");
      localStorage.removeItem("tags");
      localStorage.removeItem("pdf");
      localStorage.removeItem("maxMintsPerWallet");

      localStorage.removeItem("coverDate");
      localStorage.removeItem("pdfDate");


    }
  },[pathname])

  async function getAllBooks(){
    try{
      const books = await axios.get("/api/book/");

      var arr1:any= []
      var subArr1:any = []

      var arr4:any = [];
      var subArr4:any = [];

      var arr2:any= books.data.data

      books.data.data.reverse().map((item:any, i:number)=>{
        if(item.isPublished && !item.isHidden && !item.isAdminRemoved){
            subArr1.push(item);
        }

        if(item.isBoosted && Number(item.isBoosted) > Date.now() && !item.isAdminRemoved){
          subArr4.push(item);
        }

        if(subArr4.length == slicer || i == books.data.data.length-1){
          if(subArr4.length>0)
            arr4.push(subArr4);
          subArr4 = [];
        }

        if(subArr1.length == slicer || i == books.data.data.length-1){
          if(subArr1.length>0)
            arr1.push(subArr1);
            subArr1 = []
        }
    })

    //@ts-ignore
    arr2.sort((a:BookType, b:BookType) => b.readers - a.readers)
    var arr3:any= []
    var subArr3:any = []

      arr2.map((item:any, i:number)=>{
        if(item.isPublished && !item.isHidden && !item.isAdminRemoved){
            subArr3.push(item);
        }
        if(subArr3.length == slicer || i == books.data.data.length-1){
          if(subArr3.length>0)
            arr3.push(subArr3);
            subArr3 = []
        }
    })

    setRecentBooks(arr3);
    setBoosted(arr4);
      //@ts-ignore
      setPublishedBooks(arr1);

    }
    catch(err){
      console.log(err);
    }
  }


useEffect(()=>{
    const screenWidth = window.innerWidth;

    if(screenWidth > 1100){
        setSlicer(5);
    } else if(screenWidth <= 1100){
        setSlicer(4);
    }
  },[])

  useEffect(()=>{
    getAllBooks();
},[slicer])


  return (
    <GlobalContext.Provider value={{
      // @ts-ignore
      ensImg, setEnsImg, user, setUser, fetch, setFetch, getUser, ensImageFetcher, ensNameFetcher, userRaw, setUserRaw, publishedBooks, setPublishedBooks, recentBooks, setRecentBooks, boosted, setBoosted
    }}>
      {walletNotRegistered && (pathname.split("/")[2] == "makeCollection" || pathname.split("/")[pathname.split("/").length-1] == "authors") && <WalletNotRegistered/>}
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
