"use client";
import React, { useState } from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { FileUpload } from "@/components/ui/file-upload";
import TextArea from "@/components/ui/textarea";
import { useSearchParams } from 'next/navigation';

export default function ShootingStarsAndStarsBackgroundDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const srn = searchParams.get('srn');
  

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    console.log(uploadedFiles);
  };

  const ErrorMessageBox = ({ onClose }: { onClose: () => void }) => {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{errorMessage}</p>
        </div>
      </div>
    );
  };

  const handleCloseErrorBox = () => {
    setShowErrorBox(false);
  };

  const handleSubmit = async () => {
    console.log("SRN IS!!",srn)
    if (files.length > 0) {
      const formData = new FormData();
      formData.append("file", files[0]);
  
    if (srn) {
      formData.append("srn", srn);
    } else {
      console.error("SRN is missing.");
      alert("Error: SRN is missing.");
      return;
    }
      try {
        const response = await fetch("http://localhost:5001/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log("File saved as text:", result);
          setUploadSuccess(true);
        } else {
          // console.log(response)
          const result = await response.json();
          alert(result.error)
          console.log(result.error);
          // console.error("Failed to upload the file.");
        }
      } catch (error) {
        console.error("Error:", error);
        console.log("other error")
      }
    } else {
      alert("Please upload a file before submitting.");
    }
  };
  

  const SuccessMessageBox = ({ onClose }: { onClose: () => void }) => { // 
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-green-500 mb-4">Success!</h2>
          <p className="text-gray-700 dark:text-gray-300">The file has been successfully uploaded.</p>
        </div>
      </div>
    );
  };

  const handleCloseSuccessBox = () => {
    setUploadSuccess(false);
  };

  return (
    <div>
      <div className="h-screen rounded-md bg-neutral-900 flex flex-col items-center relative w-full">
        <h2 className="mt-16 relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
          <span>Welcome Student!</span>
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
        <button
          onClick={handleSubmit}
          className="relative z-20 mt-8 inline-flex items-center justify-center p-0.5 mb-2 me-2 text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-green-500 active:to-blue-700 active:scale-95"
        >
          <span className="relative px-8 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 dark:text-white hover:text-white active:bg-opacity-10">
            Submit
          </span>
        </button>
        <ShootingStars />
        <StarsBackground />
        
      </div>
      {showErrorBox && (
        <div className="fixed top-0 left-0 w-full h-full z-40 bg-black bg-opacity-50 flex items-center justify-center">
          <ErrorMessageBox onClose={handleCloseErrorBox} />
        </div>
      )}
      {uploadSuccess && <SuccessMessageBox onClose={handleCloseSuccessBox} />}
    </div>
  );
}
