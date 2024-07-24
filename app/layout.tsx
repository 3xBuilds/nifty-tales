import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/utils/provider/Providers"

const poppins = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900' ] });

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
      <body className={poppins.className}>
        <Providers>
          {children}
        </Providers>
        </body>
    </html>
  );
}
