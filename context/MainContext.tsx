"use client";

import { WalletNotRegistered } from "@/components/popups/walletNotRegistered";
import axios from "axios";
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
import { useAccount } from "wagmi";
import { useEnsAvatar } from 'wagmi'
import { normalize } from 'viem/ens'
import { getEnsName } from '@wagmi/core'

import {config} from "@/components/userChecker/config"

type GlobalContextType = {

  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  fetch: boolean | false;
  setFetch: Dispatch<SetStateAction<boolean | false>>;
  getUser: () => void;
  userRaw: UserType | null;
  setUserRaw: Dispatch<SetStateAction<UserType | null>>;
  ensImg: string | "";
  setEnsImg: Dispatch<SetStateAction<string | "">>;
  ens: string | "";
  setEns: Dispatch<SetStateAction<string | "">>;
}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => { },
  fetch: false,
  setFetch: () => {},
  getUser: () => { },
  userRaw: null,
  setUserRaw: () =>{ },
  ensImg: "",
  setEnsImg: () =>{ },
  ens: "",
  setEns: () =>{ }

});

export const GlobalContextProvider = ({ children } : { children: ReactNode}) => {

  const {data: session} = useSession();

  const [ensImg, setEnsImg] = useState<string>("")

  const {address} = useAccount();
  const pathname = usePathname();

  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null);
  const [ens, setEns] = useState<string>("")


  // getEnsName(config, { address: address as `0x${string}`}).then((ensName) => {
  //   console.log("ENS NAMEEEE", ensName)
  //   setEns(ensName as string);
  // })
  // .catch((error) => {
  //   console.error(`Error getting ENS name: ${error}`);
  // });


  // async function getEnsData(){
  

  // }


  // useEffect(()=>{
  //   if(user)
  //   getEnsData()
  // },[user])


  async function getUser(){
    try{
      await axios.get(`/api/user/${session?.user?.email}`).then((res)=>{
        // console.log("user",res);
        setUser(res.data.user);
        setUserRaw(res.data.unPopulated);
      }).catch((err)=>{
        // console.log("user",err);
        // router.push("/register");
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
    }
  },[pathname])


  return (
    <GlobalContext.Provider value={{
      user, setUser, fetch, setFetch, getUser, userRaw, setUserRaw, ensImg, setEnsImg, ens, setEns
    }}>

      {walletNotRegistered && (pathname.split("/")[2] == "makeAuthor" || pathname.split("/")[pathname.split("/").length-1] == "authors") && <WalletNotRegistered/>}
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
