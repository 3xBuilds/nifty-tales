import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/utils/provider/Providers"
import Navbar from "@/components/Home/Navbar";
import { poppins } from "@/utils/font";
import { ToastContainer } from 'react-toastify';

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
        <ToastContainer />
        <Providers>
          {children}
        </Providers>
        </body>
    </html>
  );
}
