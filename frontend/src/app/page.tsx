"use client";

import React, { useState, useEffect } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BackgroundBeamsWithCollisionDemo() {
  const [message, setMessage] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [error, setError] = useState("");
  const [errorlog, setErrorLog] = useState("");
  const [errortlog, setErrorTLog] = useState("");
  const [studentData, setStudentData] = useState(null);


  const router = useRouter();

  const handleStudentLogin = async (e: any) => {
    e.preventDefault();
    setErrorLog("");

    const formDataLog = new FormData(e.target);
    const data = {
      srn: formDataLog.get("srn"),
      password: formDataLog.get("password"),
    };

    try {
      const response = await fetch("http://localhost:5001/api/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        credentials: "include", // Add this if you're using sessions
        body: JSON.stringify({
          srn: data.srn,
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log("Login response:", result); 
      if (response.ok) {
        console.log("hey!! it works!")
        // console.log("Student SRN:", result.data.srn);
        setStudentData(result.data);
        // router.push('/student')
        router.push(`/student?srn=${encodeURIComponent(result.srn)}`);
        // router.push(`/student?srn=${result.data.srn}`);
        
      } else {
        setErrorLog("Login failed");
      }
    } catch (err) {
      console.log("err: ", err);
      setErrorLog("Connection error. Please try again.");
    }

    // Add your student login logic here
  };
  const handleStudentSignup = async (e: any) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);
    const data = {
      srn: formData.get("srn"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (data.password !== data.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/student/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        credentials: "include", // Add this if you're using sessions
        body: JSON.stringify({
          srn: data.srn,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStudentData(result.data);
        //router.push("/student");
        router.push(`/student?srn=${encodeURIComponent(result.srn)}`);
        // router.push(`/student?name=${result.data.srn}`);
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      console.log("err: ", err);
      setError("Connection error. Please try again.");
    }
  };
  const handleTeacherLogin = async(e:any) => {
    e.preventDefault();
    
    setErrorTLog("");

    const formDataLog = new FormData(e.target);
    const data = {
      name: formDataLog.get("name"),
      password: formDataLog.get("password"),
    };

    try {
      const response = await fetch("http://localhost:5001/api/teacher/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        credentials: "include", // Add this if you're using sessions
        body: JSON.stringify({
          name: data.name,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/teacher");
      } else {
        setErrorTLog("Login failed");
      }
    } catch (err) {
      console.log("err: ", err);
      setErrorTLog("Connection error. Please try again.");
    }
    
  };

  return (
    <BackgroundBeamsWithCollision>
      <div className="absolute left-1/2 top-8 mt-5 transform -translate-x-1/2 bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 text-3xl from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
        <div className="text-6xl pb-3">who are you?</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-14">
        {/* Student Card */}
        <div
          onClick={() => setShowStudentModal(true)}
          className="cursor-pointer"
        >
          <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-3xl font-bold text-neutral-600 dark:text-white"
              >
                Student
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <Image
                  src="/student.jpg"
                  height="1000"
                  width="1000"
                  className="h-80 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </CardItem>
              <div className="flex justify-center items-center mt-12">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-6 py-3 rounded-xl bg-black dark:bg-white dark:text-black text-white text-lg font-bold"
                >
                  I am a student
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div>

        {/* Teacher Card */}
        <div
          onClick={() => setShowTeacherModal(true)}
          className="cursor-pointer"
        >
          <CardContainer className="inter-var text-center">
            <CardBody className="text-center bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="flex justify-center items-center text-center text-3xl font-bold text-neutral-600 dark:text-white"
              >
                Teacher
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <Image
                  src="/teacher.jpg"
                  height="1000"
                  width="1000"
                  className="h-80 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </CardItem>
              <div className="flex justify-center items-center mt-12">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-6 py-3 rounded-xl bg-black dark:bg-white dark:text-black text-white text-lg font-bold"
                >
                  I am a teacher
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div>
      </div>

      {/* Student Login/Signup Modal */}
      <Dialog open={showStudentModal} onOpenChange={setShowStudentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Student Portal</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {errorlog && (
                <div className="text-red-500 text-sm">{errorlog}</div>
              )}
              <form onSubmit={handleStudentLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Input
                    name="srn"
                    type="text"
                    placeholder="Student SRN"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowStudentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Login</Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleStudentSignup} className="space-y-4 mt-4">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="space-y-2">
                  <Input
                    name="srn"
                    type="text"
                    placeholder="Student SRN"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowStudentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Sign Up</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Teacher Login Modal */}
      <Dialog open={showTeacherModal} onOpenChange={setShowTeacherModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Teacher Login</DialogTitle>
          </DialogHeader>
          {errortlog && (
                <div className="text-red-500 text-sm">{errortlog}</div>
              )}
          <form onSubmit={handleTeacherLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input
                name="name"
                type="text"
                placeholder="Teacher ID"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTeacherModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Login</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </BackgroundBeamsWithCollision>
  );
}
