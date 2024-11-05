"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
// import TextArea from "@/components/ui/textarea"
import TextArea from "@/components/ui/textarea"
// import {Textarea} from "@nextui-org/react";


export default function ShootingStarsAndStarsBackgroundDemo() {
    const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };
  

  return (
    <div>
        <ShootingStars />
        <StarsBackground />
         <div className="h-screen rounded-md bg-neutral-900 flex flex-col items-center relative w-full">
      <h2 className=" mt-16 relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
        <span>Welcome Student !</span>
      </h2>

      <h3 className="mt-4 text-xl md:text-xl text-neutral-300 text-center">
        Your journey to knowledge begins here.
      </h3>
      <h6 className="mt-4 text-lg md:text-xl text-neutral-300 text-center">
        You can either upload your C file or type it out!
      </h6>
      <div className="w-2/5 mt-6 ml-8 max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      <div>
      <h1>Text Area Example</h1>
      <TextArea />
    </div>
      
    </div>
    </div>
   
    
    

     
    </div>
  );
}
