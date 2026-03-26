import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { colors, getColor } from "@/utils/getColor";
import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constance";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setselectedColor] = useState(0);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setselectedColor(userInfo.color);
      if (userInfo.image) {
        setImage(`${HOST}${userInfo.image}`);
      }
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required..");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required..");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        const { data } = response;
        if (!data.success) {
          toast.error(data.message || "Somthing went wrong..");
        }
        if (data.success) {
          toast.success(data.message || "Profile updated successfully...");
          setUserInfo(data.userData);
        }
      } catch (error) {
        toast.error(error.message || "Somthing went wrong...");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetUP) {
      navigate("/chat");
    } else {
      toast.info("Please complete profile set-up..");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const purl = URL.createObjectURL(file);
      setImage(purl);

      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      const { data } = response;
      if (data) {
        setUserInfo({ ...userInfo, image: data.image });
        console.log(userInfo);
      }
    }
  };

  const handledeleteImage = async () => {};

  return (
    <div className="bg-[rgb(11,11,11)] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col w-[90vw] md:w-max border border-[rgb(21,21,21)] rounded-md  p-5 bg-[rgb(12,12,12)]">
        <div>
          <IoArrowBack
            onClick={handleNavigate}
            className="text-4xl lg:text-5xl hover:text-sky-300 text-white/80 cursor-pointer transition-all duration-200 "
          />
        </div>
        <div className="grid grid-cols-2 ">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-22 w-22 md:w-48 md:h-48 rounded-full overflow-hidden ">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black text-white"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full md:w-48 md:48 text-5xl flex items-center justify-center rounded-full border-[2px] ${getColor(
                    selectedColor
                  )} transition-all duration-300 `}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
              {hovered && (
                <div
                  onClick={image ? handledeleteImage : handleFileInputClick}
                  className=" absolute inset-0  flex items-center justify-center bg-black/50 rounded-full  transition-all duration-300 cursor-pointer"
                >
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
                </div>
              )}
            </Avatar>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex gap-5 min-w-32 md:min-w-64 flex-col items-center justify-center ">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                readOnly
                value={userInfo.email}
                className="rounded-lg p-6 bg-[rgb(32,32,32)] text-white font-semibold border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[rgb(32,32,32)] text-white font-semibold border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[rgb(32,32,32)] text-white font-semibold border-none"
              />
            </div>
            <div className="flex w-full gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all border-2 duration-300 ${
                    selectedColor === index ? "border-white" : ""
                  } `}
                  key={index}
                  onClick={() => setselectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full mt-5">
          <Button
            onClick={saveChanges}
            className="w-full h-16 bg-sky-600 hover:bg-sky-800 transition-all duration-300 text-xl hover:cursor-pointer"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
