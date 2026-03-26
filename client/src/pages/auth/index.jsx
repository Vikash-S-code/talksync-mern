import React, { useState } from "react";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import loginCoolPng from "../../assets/loginCoolPng.png";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constance";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSingup = () => {
    if (email.length <= 0) {
      toast.error("Email is required...");
      return false;
    }

    if (password.length <= 0 || confirmPassword.length <= 0) {
      toast.error("Password and ConfirmPassword is required...");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and ConfirmPassword should be same..");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (email.length <= 0) {
      toast.error("Email is required...");
      return false;
    }

    if (password.length <= 0) {
      toast.error("Password and ConfirmPassword is required...");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (validateSingup()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
            confirmPassword,
          },
          { withCredentials: true }
        );
        const { data } = response;
        if (data.success) {
          toast.success(data.message);
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setUserInfo(data.userData);
          navigate("/profile");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        const { data } = response;

        if (data.success) {
          toast.success(data.message);
          setEmail("");
          setPassword("");
          setUserInfo(data.userData);
          if (data.userData.profileSetUP) navigate("/chat");
          else navigate("/profile");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="h-[100vh] flex items-center justify-center">
      <div
        className="  bg-gray-100 border-2 border-white  shadow-2xl w-[80vw]
       md:w-[90vw] lg:[70vw] xl:w-[60vw] rounded-2xl grid xl:grid-cols-2"
      >
        <div className="flex items-center  justify-center flex-col w-full p-10">
          <div className="flex items-center  gap-1 mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              Welcome
            </h1>
            <img src={Victory} alt="Victory Emoji" className="h-[150px]" />
          </div>
          <p className="text-emerald-500 font-semibold text-lg mb-8 text-center">
            {" "}
            Fill in the details to started a this chat app ...
          </p>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4 border rounded-xl" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full border border-b-gray-200">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black border-b-2 rounded-none w-full
                   data-[state=active]:font-semibold data-[state=active]:border-b-emerald-400
                    transition-all duration-300 data-[state=active]:shadow-none p-4
                     data-[state=active]:text-emerald-600 cursor-pointer hover:text-emerald-600 "
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black border-b-2 rounded-none w-full
                   data-[state=active]:text-emerald-600 data-[state=active]:font-semibold
                    data-[state=active]:border-b-emerald-400 p-4 transition-all duration-300 
                    data-[state=active]:shadow-none cursor-pointer hover:text-emerald-600 "
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="login"
                className="flex flex-col gap-5    rounded-xl p-5"
              >
                <h1 className="text-3xl text-black font-semibold text-center">
                  Login
                </h1>
                <input
                  placeholder="Email"
                  type="email"
                  className="outline-none border  hover:bg-slate-300 hover:border-gray-400 focus:shadow-2xl 
                  hover:shadow-2xl border-gray-300 p-4 rounded-2xl font-semibold bg-slate-200
                   focus:border-emerald-400 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  placeholder="Password"
                  type="password"
                  className="outline-none border hover:bg-slate-300 hover:border-gray-400 focus:shadow-2xl
                   hover:shadow-2xl border-gray-300 p-4 rounded-2xl font-semibold bg-slate-200
                   focus:border-emerald-400 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  className="rounded-2xl p-7 border font-semibold  border-gray-300 cursor-pointer
                   hover:bg-emerald-400 hover:border-slate-400 transition-all duration-400 bg-slate-200"
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent
                value="signup"
                className="flex flex-col gap-5    rounded-xl p-5"
              >
                <h1 className="text-3xl text-black font-semibold text-center">
                  Signup
                </h1>
                <input
                  placeholder="Email"
                  type="email"
                  className="outline-none border  hover:bg-slate-300 hover:border-gray-400 
                  focus:shadow-2xl hover:shadow-2xl border-gray-300 p-4 rounded-2xl font-semibold bg-slate-200
                   focus:border-emerald-400 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  placeholder="Password"
                  type="password"
                  className="outline-none border  hover:bg-slate-300 hover:border-gray-400
                   focus:shadow-2xl hover:shadow-2xl border-gray-300 p-4 rounded-2xl font-semibold bg-slate-200
                   focus:border-emerald-400 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  placeholder="Confirm password"
                  type="password"
                  className="outline-none border  hover:bg-slate-300 hover:border-gray-400
                   focus:shadow-2xl hover:shadow-2xl border-gray-300 p-4 rounded-2xl font-semibold bg-slate-200
                   focus:border-emerald-400 transition-all duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  onClick={handleSignUp}
                  variant="outline"
                  className="rounded-2xl p-7 font-semibold border border-gray-300 cursor-pointer hover:bg-emerald-400 hover:border-slate-400
                   transition-all duration-400 bg-slate-200"
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className=" items-center justify-center border-l-2 border-gray-200 hidden xl:flex">
          <img src={loginCoolPng} alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
