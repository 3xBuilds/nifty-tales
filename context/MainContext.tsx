"use client";

import { WalletNotRegistered } from "@/components/popups/walletNotRegistered";
import axios from "axios";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
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
  
}

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => { },
  
});



type UserType = {
  id: string;
  wallet: string;
  email: string;
  username: string;
  contractAdd: string;
  profileImage: string;
  readlist: Array<string>;
  yourBooks: Array<string>;
  role: string
}

export const GlobalContextProvider = ({ children } : { children: ReactNode}) => {

  const {data: session} = useSession();

  const {address} = useAccount();
  const pathname = usePathname();


  async function getUser(){
    try{
      const res = await axios.get(`/api/user/${session?.user?.email}`);
      setUser(res.data.user);
    }
    catch(err){
      console.error(err);
    }
  }

  useEffect(()=>{
    if(session && !user)
    {getUser();}
  },[session])


  const [user, setUser] = useState<UserType | null>(null);
  const [walletNotRegistered, setWalletNotRegistered] = useState<boolean>(false);

  useEffect(()=>{
    if(user && user.wallet != address){
      setWalletNotRegistered(true);
    }
    else if(user && user.wallet == address){
      setWalletNotRegistered(false);
    }
  })

  return (
    <GlobalContext.Provider value={{
      user, setUser
    }}>
      {walletNotRegistered && (pathname.split("/")[2] == "makeAuthor" || pathname.split("/")[pathname.split("/").length-1] == "authors") && <WalletNotRegistered/>}
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
