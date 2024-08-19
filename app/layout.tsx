import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/utils/provider/Providers"
import Navbar from "@/components/Home/Navbar";
import { poppins } from "@/utils/font";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "NiftyTales",
  description: "Empowering Authors, Engaging Readers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className + " bg-white  "}>
        {/* <Navbar/> */}
        <ToastContainer />
        <Providers>
          <div className="flex w-screen z-[1000000] justify-end absolute">
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
