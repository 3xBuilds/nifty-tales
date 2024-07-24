import About from "@/components/About";
import FooterComponent from "@/components/FooterComponent";
import Landing from "@/components/Landing";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navbar/>
      <Landing/>
      <About/>
      <FooterComponent/>
    </main>
  );
}
