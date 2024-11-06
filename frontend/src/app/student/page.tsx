"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import TextArea from "@/components/ui/textarea";

export default function ShootingStarsAndStarsBackgroundDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div>
      <div className="h-screen rounded-md bg-neutral-900 flex flex-col items-center relative w-full">
        <h2 className="mt-16 relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
          <span>Welcome Student !</span>
        </h2>
        <h3 className="mt-4 text-xl md:text-xl text-neutral-300 text-center">
          Your journey to knowledge begins here.
        </h3>
        <h6 className="mt-4 text-lg md:text-xl text-neutral-300 text-center">
          You can either upload your C file or type it out!
        </h6>
        <div className="flex flex-col md:flex-row w-full gap-4 justify-center items-start mt-6">
          <div className="mt-4 ml-4 pl-1 relative z-20 w-2/5 md:w-3/5 max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={handleFileUpload} />
          </div>
          <div className="z-20 w-full md:w-3/5 max-w-4xl mx-auto mt-6 md:mt-0">
            <TextArea />
          </div>
        </div>
        <button className="relative z-20 mt-8 inline-flex items-center justify-center p-0.5 mb-2 me-2 text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-green-500 active:to-blue-700 active:scale-95">
          <span className="relative px-8 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 dark:text-white hover:text-white active:bg-opacity-10">
            Submit
          </span>
        </button>
        <ShootingStars />
        <StarsBackground />
      </div>
    </div>
  );
}