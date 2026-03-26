import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/emptyChat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const {
    isUploading,
    isDownloading,
    fileDownloadProgres,
    fileUploadProgress,
  } = useAppStore();

  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetUP) {
      toast.info("Please setUp profile to continue..");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden ">
      {isUploading && (
        <div
          className="h-[100vh] w-[100vw] fixed top-0 left-0 z-10 bg-black/80 flex items-center 
        justify-center flex-col gap-5 backdrop-blur-lg "
        >
          <h5 className="text-5xl animate-pulse ">
            Uploading File... {fileUploadProgress}%
          </h5>
        </div>
      )}
      {isDownloading && (
        <div
          className="h-[100vh] w-[100vw] fixed top-0 left-0 z-10 bg-black/80 flex items-center 
        justify-center flex-col gap-5 backdrop-blur-lg "
        >
          <h5 className="text-5xl animate-pulse ">
            Downloading File... {fileDownloadProgres}%
          </h5>
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
