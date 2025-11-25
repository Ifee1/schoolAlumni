"use client";

import { About3 } from "@/components/about3";
import { Feature197 } from "@/components/feature197";
import { Footer2 } from "@/components/footer2";
import { Hero7 } from "@/components/hero7";
import { Navbar1 } from "@/components/navbar1";

export default function Home() {
  return (
    <div className="mx-auto bg-[#010128] overflow-hidden text-[#C5A028]">
      {/* <Navbar1 /> */}
      <div className="mx-auto">
        <Hero7 />
        <Feature197 />
        <About3 />
        <Footer2 />
      </div>
    </div>
  );
}
