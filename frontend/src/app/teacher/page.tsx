"use client";
import React, { useState, useEffect } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function TeacherDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [studentIds, setStudentIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // const [codeContent, setCodeContent] = useState(null);
  const [codeContent, setCodeContent] = useState<string | null>(null);
  const [submissionView, setSubmissionView] = useState<string | null>(null);

  // const [submissionView, setSubmissionView] = useState(null);
  const [notGraded, setNotGradedView] = useState<string | null>(null);

  const [statsView, setStatsView] = useState(null);

  const [submissionTime, setSubmissionTime] = useState<string>("");
  const [isTimeSet, setIsTimeSet] = useState(false);

  const [isMarksDialogOpen, setIsMarksDialogOpen] = useState(false);
  const [marks, setMarks] = useState("");
  const [marksError, setMarksError] = useState("");
  const [stats, setStats] = useState<{
    below5: number;
    between5and8: number;
    above8: number;
  } | null>(null);





  const fetchStudentIds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5001/api/studentlist');
      if (!response.ok) {
        throw new Error('Failed to fetch student IDs');
      }
      const data = await response.json();
      console.log("data is: ",data)
      setStudentIds(data.student_ids);
    } catch (err: any) {
      console.log("there is an error");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = async (id: any) => {
      
      // Update selected student in state
      setSelectedStudent(id);
      setCodeContent(null);
      setIsOpen(false);
    
  };

  const handleViewCode = async (): Promise<void> => {
    setCodeContent(null);
    setSubmissionView(null);
    setStatsView(null);
    setStats(null);
    setNotGradedView(null);

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
  setCodeContent(null);
  setSubmissionView(null);
  setStatsView(null);
  setStats(null);
  setNotGradedView(null);

  try {
      const response = await fetch(`http://localhost:5001/api/no-submission`);
      if (!response.ok) {
          throw new Error("Failed to fetch students with no submission");
      }
      const data = await response.json();
      const noSubmissionStudents = data.no_submission_students || [];  // Fallback to empty array
      if (noSubmissionStudents.length > 0) {
          setSubmissionView("The following students have not submitted their code: " + noSubmissionStudents.join(", "));
      } else {
          setSubmissionView("Every student has submitted their code!");
      }
  } catch (err) {
      console.error("Error fetching students with no submission:", err);
      setSubmissionView("Error loading data");
  }
};


const handleNotGraded = async (): Promise<void> => {
  setCodeContent(null);
  setSubmissionView(null);
  setStatsView(null)
  setStats(null) 
  setNotGradedView(null);

  try {
    const response = await fetch(`http://localhost:5001/api/notGraded`);
    if (!response.ok) {
      throw new Error("Failed to fetch ungraded student data");
    }
    const data = await response.json();
    const ungradedStudents = data.ungraded_students || [];  // Fallback to empty array
    if (ungradedStudents.length > 0) {
      setNotGradedView("The following students have not been graded: " + ungradedStudents.join(", "));
    } else {
      setNotGradedView("All students have been graded!"); 
    }
  } catch (err) {
    console.error("Error fetching ungraded student data:", err);
    setNotGradedView("Error loading data");
  }
};


// const gradedNongraded = async(): Promise<void> =>{
//   setCodeContent(null);
//     setSubmissionView(null);
//     setStatsView(null)
//   try {
//     const response = await fetch(`http://localhost:5001/api/gradedStats`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch code content");
//     }
//     const data = await response.json();
//     if (data.file_content.length > 0) {
//       setStatsView(data.file_content.join("\n"));
//     }
//   } catch (err) {
//     console.error("Error fetching code content:", err);
    
//   }
// }

const gradeDistribution = async(): Promise<void> => {
  setCodeContent(null);
  setSubmissionView(null);
  setStatsView(null);
  setStats(null)
  setNotGradedView(null);
    
  try {
    const response = await fetch(`http://localhost:5001/api/gradedStats`);
    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }
    const data = await response.json();
    if (data.stats) {
      const [below5, between5and8, above8] = data.stats.split(',').map((num: string)  => parseInt(num));
      setStats({ below5, between5and8, above8 });
    }
  } catch (err) {
    console.error("Error fetching statistics:", err);
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


const handleMarksSubmit = async () => {
  if (!selectedStudent) {
    alert("Please select a student first");
    return;
  }
  setIsMarksDialogOpen(true);
  // Validate marks
  const marksNum = Number(marks);
  if (isNaN(marksNum) || marksNum < 0 || marksNum > 10) {
    setMarksError("Please enter valid marks between 0 and 10");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5001/api/students/${selectedStudent}/marks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ marks: marksNum }),
    });

    if (!response.ok) {
      throw new Error('Failed to update marks');
    }

    alert('Marks updated successfully!');
    setIsMarksDialogOpen(false);
    setMarks("");
    setMarksError("");
  } catch (err) {
    console.error('Error updating marks:', err);
    alert('Failed to update marks. Please try again.');
  }
};


  useEffect(() => {
    if (isOpen) {
      fetchStudentIds();
    }
  }, [isOpen]);

  const clearDisplay =()=>{
    setCodeContent(null);
    setSubmissionView(null);
    setStatsView(null)
    setStats(null)
    setNotGradedView(null);
  }
  
  return (
    <BackgroundLines className="flex items-center w-full h-full flex-col px-4 min-h-screen">
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
      {/* <div className="absolute top-10 left-10 w-64">
      <button type="button" onClick={ handleStudentDeleteRecord} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-8 py-4 text-center me-2 mb-2">Delete Record</button>


      </div> */}
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Welcome, Teacher!
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center mb-8">
        Here you can view the student's codes, or specific parts of the codes!
      </p>
      

      



      <div className="w-full max-w-7xl flex gap-8 px-8">
        {/* Left column buttons */}
        <div className="flex flex-col gap-10 mt-20 w-64 mr-10">
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
          
          <button onClick={gradeDistribution} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-purple-500 active:to-pink-500 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Grade Distribution
            </span>
          </button>

          <button onClick={handleNotGraded} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-red-200 active:to-yellow-200 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              List of ungraded students
            </span>
          </button>

        </div>

        {/* Center display card */}
        {/* <Card className="flex-1 min-h-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
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
</Card> */}
<Card className="flex-1 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          {selectedStudent && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Chosen: Student {selectedStudent}
              </h3>
            </div>
          )}
          <div className="flex-1 p-6 overflow-auto">
            <div className="text-center text-gray-500 dark:text-gray-400 text-xl">
              {codeContent ? (
                <pre className="whitespace-pre-wrap text-left">
                  {codeContent}
                </pre>
              ) : (
                ""
              )}
              {submissionView ? (
                <pre className="mt-10 whitespace-pre-wrap text-left">
                  <p className="mb-5">Missing Submissions: </p>
                  {submissionView}
                </pre>
              ) : (
                " "
              )}
              {notGraded ? (
                <pre className="mt-10 whitespace-pre-wrap text-left">
                  <p className="mb-5">Students who have not been graded yet: </p>
                  {notGraded}
                </pre>
              ) : (
                " "
              )}
              {stats && (
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Grade Distribution
              </h2>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 className="font-medium text-red-800 dark:text-red-200">
                  Students with marks below 5:
                </h3>
                <p className="mt-1 text-xl font-bold text-red-900 dark:text-red-100">
                  {stats.below5} students
                </p>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Students with marks between 5 and 8:
                </h3>
                <p className="mt-1 text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  {stats.between5and8} students
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-200">
                  Students with marks above 8:
                </h3>
                <p className="mt-1 text-xl font-bold text-green-900 dark:text-green-100">
                  {stats.above8} students
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Total Students:
                </h3>
                <p className="mt-1 text-xl font-bold text-blue-900 dark:text-blue-100">
                  {stats.below5 + stats.between5and8 + stats.above8} students
                </p>
              </div>
            </div>
          )}
            </div>
          </div>
        </Card>


        {/* Right column buttons */}
        <div className="flex flex-col gap-8 mt-20 w-64 ml-10">
          <button onClick={() => { if (!selectedStudent) {alert("Please select a student first"); return} setIsMarksDialogOpen(true);}} 
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-pink-500 active:to-orange-400 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Enter Marks for Student 
            </span>
          </button>
          
          <button onClick={handleViewNoSubmission}  
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-teal-300 active:to-lime-300 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              View Students with no submissions
            </span>
          </button>
          
          <button onClick={clearDisplay} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-red-200 active:to-yellow-200 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Clear Display
            </span>
          </button>

          <button onClick={handleStudentDeleteRecord} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 transform hover:scale-110 transition-all duration-300 ease-in-out active:from-purple-500 active:to-pink-500 active:scale-95">
            <span className="relative w-full px-10 py-8 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Delete Record
            </span>
          </button>

          
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen} >
        <DialogContent className="sm:max-w-md" aria-describedby="student-select-description">
          <DialogHeader>
            <DialogTitle>Select Student</DialogTitle>
            <DialogDescription id="student-select-description">
              Choose a student from the list below to view their details.
            </DialogDescription>
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
      
    <Dialog open={isMarksDialogOpen} onOpenChange={setIsMarksDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Marks for Student {selectedStudent}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="marks">Marks (0-10)</Label>
            <Input
              id="marks"
              type="number"
              min="0"
              max="10"
              value={marks}
              onChange={(e) => {
                setMarks(e.target.value);
                setMarksError("");
              }}
              placeholder="Enter marks"
            />
            {marksError && (
              <p className="text-sm text-red-500">{marksError}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsMarksDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleMarksSubmit}>
            Submit Marks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  
    </BackgroundLines>
  );
}