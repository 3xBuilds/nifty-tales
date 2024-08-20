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

type GlobalContextType = {

  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  fetch: boolean | false;
  setFetch: Dispatch<SetStateAction<boolean | false>>;
  getUser: () => void;
  userRaw: UserType | null;
  setUserRaw: Dispatch<SetStateAction<UserType | null>>;

}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => { },
  fetch: false,
  setFetch: () => {},
  getUser: () => { },
  userRaw: null,
  setUserRaw: () =>{ }

});

export const GlobalContextProvider = ({ children } : { children: ReactNode}) => {

  const {data: session} = useSession();

  const {address} = useAccount();
  const pathname = usePathname();

  const router = useRouter()

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
    {getUser();}
  },[session])


  const [user, setUser] = useState<UserType | null>(null);
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

  const [walletExists, setWalletExists] = useState<boolean>(false)

  async function checkAndUpdateWallet(){
    try{
      const res = await axios.get("/api/user/checkExistingWallet/"+address);
      //@ts-ignore
      setWalletExists(false);

      //@ts-ignore
      if(res.status == 200){
        await axios.patch("/api/user/"+user?.email, {wallet: address});
      }
    }
    catch(err){
      console.log(err);
      setWalletExists(true);

    }
  }

  useEffect(()=>{
    if(address && user?.wallet == ""){
        // console.log(address);
        checkAndUpdateWallet()
    }
},[address, user])

  return (
    <GlobalContext.Provider value={{
      user, setUser, fetch, setFetch, getUser, userRaw, setUserRaw
    }}>
      {walletExists && <div className="w-screen h-screen text-sm backdrop-blur-xl flex flex-col items-center justify-center fixed top-0 left-0 z-[1000000000]"><div className="p-4 bg-white w-96 rounded-lg shadow-xl shadow-black/30">Wallet address you're trying to connect is linked to another account. <b className="block">Go to your wallet and connect a different wallet.</b> </div></div>}

      {walletNotRegistered && (pathname.split("/")[2] == "makeAuthor" || pathname.split("/")[pathname.split("/").length-1] == "authors") && <WalletNotRegistered/>}
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
