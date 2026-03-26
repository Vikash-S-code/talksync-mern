import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE } from "@/utils/constance";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const fileInputREf = useRef();
  const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setFileuploadProgress,
    setIsuploading,
  } = useAppStore();
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutSide(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleAttachmentClick = () => {
    if (fileInputREf.current) {
      fileInputREf.current.click();
    }
  };

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        setIsuploading(true);

        const res = await apiClient.post(UPLOAD_FILE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileuploadProgress(Math.round(100 * data.loaded) / data.total);
          },
        });

        console.log(res.data.filePath);

        if (res.status === 200 && res.data) {
          setIsuploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo._id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileURL: res.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setIsuploading(false);
      console.log(error);
    }
  };

  const handleSubmitMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
      setMessage("");
    }
  };

  return (
    <div className="h-[10vh] flex items-center justify-center px-8 mb-5 gap-6">
      <div className="flex-1 bg-[#1c1d25] flex rounded-md items-center gap-5  pr-5 ">
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          type="text"
          className="flex-1 bg-transparent rounded-md p-5 focus:border-none focus:outline-none"
          placeholder="Enter Message"
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300 "
        >
          <GrAttachment className="text-2xl hover:text-white cursor-pointer transition-all duration-150" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputREf}
          onChange={handleAttachmentChange}
        />
        <button
          onClick={() => setEmojiPickerOpen(true)}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300 "
        >
          <RiEmojiStickerLine className="text-2xl cursor-pointer hover:text-white transition-all duration-150 " />
        </button>
        <div
          ref={emojiRef}
          className={`absolute bottom-16 right-0 transition-all duration-300 ease-out transform ${
            emojiPickerOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-1 translate-y-4 pointer-events-none"
          }`}
        >
          <EmojiPicker
            onEmojiClick={handleAddEmoji}
            theme="dark"
            open={emojiPickerOpen}
            autoFocusSearch={false}
          />
        </div>
      </div>
      <button
        onClick={handleSubmitMessage}
        className="bg-[#00b6e8] hover:bg-[#0395be] focus:bg-[#0395be] cursor-pointer rounded-md flex items-center justify-center focus:border-none focus:outline-none focus:text-white p-5 transition-all duration-300 "
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
