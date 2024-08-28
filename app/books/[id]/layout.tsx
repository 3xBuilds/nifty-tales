import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/utils/provider/Providers"
import Navbar from "@/components/Home/Navbar";
import { poppins } from "@/utils/font";
import { Bounce, Slide, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import { useGlobalContext } from "@/context/MainContext";


export const metadata: Metadata = {
  title: "Absolute",
  description: "Bullshit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
     
      <body className={poppins.className + " bg-white overflow-x-hidden w-screen "}>
        {/* <Navbar/> */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
            />
        <Providers>
          <div className="flex w-screen z-[1000] justify-end fixed top-0">
               <Navbar/>
            </div> 
            <div className="mt-16">
              
              {children}
            </div>
        </Providers>
        </body>
    </html>
  );
}
