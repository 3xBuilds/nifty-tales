"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useEffect
} from "react";

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
}

export const GlobalContextProvider = ({ children } : { children: ReactNode}) => {

  const {data: session} = useSession();

  async function getUser(){
    try{
      console.log("EMAIL",session?.user?.email);
      const res = await axios.get(`/api/user/${session?.user?.email}`);
      console.log(res);
      setUser(res.data.user);
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    if(session)
    getUser();
  },[session])


  const [user, setUser] = useState<UserType | null>(null);

  return (
    <GlobalContext.Provider value={{
      user, setUser
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
