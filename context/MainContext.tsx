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
        router.push("/register");
      });

    }
    catch(err){
      console.error(err);
    }
  }

  const[fetch, setFetch] = useState(false);

  useEffect(()=>{
    if(session)
    getUser();
  },[session])

  // useEffect(()=>{
  //   if(session && !user)
  //   {getUser();}
  // },[session])


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
    console.log(pathname.split("/")[1])
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
      user, setUser, fetch, setFetch, getUser, userRaw, setUserRaw
    }}>
      {walletNotRegistered && (pathname.split("/")[2] == "makeAuthor" || pathname.split("/")[pathname.split("/").length-1] == "authors") && <WalletNotRegistered/>}
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
