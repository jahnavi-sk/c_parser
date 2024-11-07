import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Card } from "@/components/ui/card";

export default function TeacherDashboard() {
  return (
    <BackgroundLines className="flex items-center w-full flex-col px-4 min-h-screen">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Welcome, Teacher!
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mb-8">
        Here you can view the student's codes, or specific parts of the codes!
      </p>
      
      <div className="w-full max-w-7xl flex gap-8 px-8">
        {/* Left column buttons */}
        <div className="flex flex-col gap-8 w-64">
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span className="relative w-full px-8 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Choose Student
            </span>
          </button>
          
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
            <span className="relative w-full px-8 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Code
            </span>
          </button>
          
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
            <span className="relative w-full px-8 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Variables
            </span>
          </button>
        </div>

        {/* Center display card */}
        <Card className="flex-1 min-h-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-xl">
            Display
          </div>
        </Card>

        {/* Right column buttons */}
        <div className="flex flex-col gap-8 w-64">
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
            <span className="relative w-full px-8 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Functions
            </span>
          </button>
          
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
            <span className="relative w-full px-8 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Datatypes
            </span>
          </button>
          
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
            <span className="relative w-full px-8 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Errors
            </span>
          </button>
        </div>
      </div>
    </BackgroundLines>
  );
}