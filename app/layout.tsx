import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/utils/provider/Providers"
import Navbar from "@/components/Home/Navbar";
import { poppins } from "@/utils/font";
import { Bounce, Slide, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import { GlobalContextProvider, useGlobalContext } from "@/context/MainContext";


export const metadata: Metadata = {
  title: "NiftyTales",
  description: "Own the story. Publish onchain.",
  openGraph: {
    title: "NiftyTales",
  description: "Own the story. Publish onchain.",
    url: 'https://niftytales.xyz',
    siteName: 'Nifty Tales',
    images: [
      {
        url: 'https://niftytales.xyz/og.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://niftytales.xyz/og.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark:bg-nifty-black bg-nifty-white">
     
      <body className={poppins.className + " overflow-x-hidden w-screen "}>
                  {/* <GlobalContextProvider> */}
        
            <div className="">
              {children}
            </div>
{/* </GlobalContextProvider> */}
        </body>
    </html>
  );
}
