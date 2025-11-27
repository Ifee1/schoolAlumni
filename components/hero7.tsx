"use client";

import { Star } from "lucide-react";
import React, { useEffect } from "react";
import gsap from "gsap";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Navbar1 } from "./navbar1";

interface Hero7Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero7 = ({
  heading = "Connecting Our Graduates, Empowering the Future",
  description = "Join a vibrant network of alumni, share experiences, access resources, and create opportunities together. Create meaningful connections and opportunities together",
  button = {
    text: "Join the community",
    url: "/register",
  },
  reviews = {
    count: 200,
    // rating: 5.0,
    avatars: [
      {
        src: "/genZlady.jpeg",
        alt: "Avatar 1",
      },
      {
        src: "/olderGuy.jpeg",
        alt: "Avatar 2",
      },
      {
        src: "/whiteLady.jpeg",
        alt: "Avatar 3",
      },
      {
        src: "/blackGuy.jpeg",
        alt: "Avatar 4",
      },
      {
        src: "/mixedRaceLady.jpeg",
        alt: "Avatar 5",
      },
    ],
  },
}: Hero7Props) => {
  useEffect(() => {
    gsap.from(".hero-line", {
      y: 70, // start 50px below
      opacity: 0, // start invisible
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.5, // each element appears 0.3s after the previous
    });
  }, []);
  useEffect(() => {
    gsap.from(".hero-tinyImages", {
      x: -70, // start 50px below
      opacity: 0, // start invisible
      duration: 1.2,
      ease: "power3.out",
      delay: 3,
    });
  }, []);

  useEffect(() => {
    gsap.from(".hero-tinyText", {
      x: 70, // start 50px below
      opacity: 0, // start invisible
      duration: 1.2,
      ease: "power3.out",
      delay: 2,
    });
  }, []);
  return (
    <section className="relative sm:py-16 lg:py-26 bg-cover bg-center h-screen text-white">
      <div className="absolute top-0 left-0 w-full z-30">
        <Navbar1 />
      </div>
      <Image
        src="/alumni_hero_image.png"
        alt="Alumni Hero"
        fill
        sizes="100vw"
        className="object-cover  object-[50%_70%]      
    sm:object-[50%_60%]   
    md:object-center "
        // className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[#120920]/30 z-20"></div>

      <div className="mx-auto container text-center flex items-center justify-center flex-col gap-4 py-24 z-50 relative">
        <div className="flex max-w-5xl items-center justify-center flex-col gap-6">
          <h1 className="text-2xl font-semibold lg:text-6xl mt-2 hero-line md:text-4xl">
            {heading}
          </h1>
          <p className="text-balance lg:text-lg hero-line">{description}</p>
        </div>
        <div className="hero-line">
          <Button
            asChild
            size="lg"
            className="mt-10 hover:scale-120 duration-500 hover:bg-[#D5FFF3] hover:text-black"
          >
            <a className="align-center text-2xl" href={button.url}>
              {button.text}
            </a>
          </Button>
        </div>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4 hero-tinyImages">
            {reviews.avatars.map((avatar, index) => (
              <Avatar key={index} className="size-14 border">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>
          <div>
            <div className="flex items-center gap-1 ">
              {/* {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))} */}
              <span className="mr-1 font-semibold">
                {reviews.rating?.toFixed(1)}
              </span>
            </div>
            <p className="text-white text-base text-left font-medium hero-tinyText">
              Meet over 200 of our Alumni
              {/* from {reviews.count}+ reviews */}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero7 };
