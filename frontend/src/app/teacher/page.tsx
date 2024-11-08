"use client";
import React, { useState, useEffect } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function TeacherDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [studentIds, setStudentIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // const [codeContent, setCodeContent] = useState(null);
  const [codeContent, setCodeContent] = useState<string | null>(null);
  const [submissionView, setSubmissionView] = useState(null);
  const [submissionTime, setSubmissionTime] = useState<string>("");
  const [isTimeSet, setIsTimeSet] = useState(false);





  const fetchStudentIds = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/studentlist');
      if (!response.ok) {
        throw new Error('Failed to fetch student IDs');
      }
      const data = await response.json();
      setStudentIds(data.student_ids);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = async (id: any) => {
    try {
      // Update graded status
      const response = await fetch(`http://localhost:5001/api/students/${id}/grade`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update graded status');
      }
      
      // Update selected student in state
      setSelectedStudent(id);
      setCodeContent(null);
      setIsOpen(false);
    } catch (err) {
      console.error('Error updating graded status:', err);
      // You might want to show this error to the user
    }
  };

  const handleViewCode = async (): Promise<void> => {
    if (!selectedStudent) {
        alert("Please select a student first.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5001/api/students/${selectedStudent}/code`);
        if (!response.ok) {
            throw new Error("Failed to fetch code content.");
        }

        const data: { file_content: string } = await response.json();
        setCodeContent(data.file_content);
    } catch (err) {
        console.error("Error fetching code content:", err);
        setCodeContent("Error loading code!");
    }
};

const handleStudentDeleteRecord = async () => {
  if (!selectedStudent) {
      alert("Please select a student first.");
      return;
  }

  try {
      const response = await fetch(`http://localhost:5001/api/students/${selectedStudent}/delete`);
      if (!response.ok) {
        throw new Error("Failed to fetch code content.");
    }
    const data: { file_content: string } = await response.json();

      if (response.ok) {
          alert("Deleted Record.");
      } else {
          alert("Not able to delete due to some error.");
      }
  } catch (err) {
      console.error("Error regarding db:", err);
  }
};



const handleViewNoSubmission = async (): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:5001/api/no-submission`);
    if (!response.ok) {
      throw new Error("Failed to fetch code content");
    }
    const data = await response.json();
    if (data.file_content.length > 0) {
      setSubmissionView(data.file_content.join("\n"));
    } else {
      setSubmissionView("All students have submitted their code!");
    }
  } catch (err) {
    console.error("Error fetching code content:", err);
    setSubmissionView("Error loading code");
  }
};



const handleSetTime = async () => {
  if (!submissionTime) {
    alert("Please select a valid submission time");
    return;
  }
console.log("submission tiem",submissionTime );
  try {
    const response = await fetch('http://localhost:5001/api/set-submission-time', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ submissionTime }),
    });

    if (!response.ok) {
      throw new Error('Failed to set submission time');
    }

    setIsTimeSet(true);
    alert("Submission time set successfully!");
  } catch (err) {
    console.error('Error setting submission time:', err);
    alert("Failed to set submission time. Please try again.");
  }
};


  useEffect(() => {
    if (isOpen) {
      fetchStudentIds();
    }
  }, [isOpen]);


  return (
    <BackgroundLines className="flex items-center w-full flex-col px-4 min-h-screen">
      <div className="absolute top-8 right-10 w-64">
        <div className="relative">
          <input
            type="datetime-local"
            id="submission_time"
            value={submissionTime}
            onChange={(e) => setSubmissionTime(e.target.value)}
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
            Set Submission Deadline
          </label>
        </div>
        <Button
          onClick={handleSetTime}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-110 transition-all duration-300 ease-in-out"
          disabled={isTimeSet}
        >
          {isTimeSet ? "Deadline Set" : "Set Deadline"}
        </Button>
      </div>
      <div className="absolute top-10 left-10 w-64">
      <button type="button" onClick={ handleStudentDeleteRecord} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-8 py-4 text-center me-2 mb-2">Delete Record</button>


      </div>
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Welcome, Teacher!
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mb-8">
        Here you can view the student's codes, or specific parts of the codes!
      </p>
      

      



      <div className="w-full max-w-7xl flex gap-8 px-8">
        {/* Left column buttons */}
        <div className="flex flex-col gap-16 mt-20 w-64 mr-10">
          {/* <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-purple-600 active:to-blue-500 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Choose Student
            </span>
          </button> */}
          <button 
            onClick={() => setIsOpen(true)}
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-purple-600 active:to-blue-500 active:scale-95"
          >
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Choose Student
            </span>
          </button>




          <button onClick={handleViewCode} className="relative inline-flex items-center justify-center p-0.5 text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-green-500 active:to-blue-700 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Code
            </span>
          </button>
          
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-purple-500 active:to-pink-500 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Variables with Datatypes
            </span>
          </button>
        </div>

        {/* Center display card */}
        <Card className="flex-1 min-h-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    {selectedStudent && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Chosen: Student {selectedStudent}
            </h3>
        </div>
    )}
    <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-xl">
        {codeContent ? (
            <pre className="whitespace-pre-wrap text-left">
                {codeContent}
            </pre>
        ) : (
            "Select a student to view code"
        )}
        {submissionView ? (
            <pre className="mt-10 whitespace-pre-wrap text-left">
              <p className="mb-5">Missing Submissions: </p>
                {submissionView}
            </pre>
        ) : (
            " "
        )}
    </div>
</Card>


        {/* Right column buttons */}
        <div className="flex flex-col gap-16 mt-20 w-64 ml-10">
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-pink-500 active:to-orange-400 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Functions
            </span>
          </button>
          
          <button onClick={handleViewNoSubmission} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-teal-300 active:to-lime-300 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Students with no submissions
            </span>
          </button>
          
          <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-red-200 active:to-yellow-200 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Errors
            </span>
          </button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Student</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">{error}</div>
            ) : (
              <div className="grid gap-4">
                {studentIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      handleStudentSelect(id)
                    }}
                    className="w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Student SRN: {id}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </BackgroundLines>
  );
}