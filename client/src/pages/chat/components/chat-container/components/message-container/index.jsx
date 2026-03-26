import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_MESSAGES, HOST } from "@/utils/constance";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownLoading,
  } = useAppStore();

  const [showImage, setShowImages] = useState(false);
  const [imageUrl, setImagesUrl] = useState(null);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await apiClient.post(
          GET_MESSAGES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
          console.log(selectedChatMessages);
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessage();
      }
    }
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        behavior: "smooth",
        top: scrollRef.current.scrollHeight,
      });
    }
  }, [selectedChatMessages]);

  const checkIfImages = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      // fileURL
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}{" "}
            </div>
          )}
          <div
            className={`my-1 px-3 py-2 rounded  ${
              message.sender === userInfo._id
                ? "bg-gray-900 place-self-end text-white"
                : "bg-[#2e3438] place-self-start text-white"
            }  lg:text-lg max-w-[45%]  border  border-gray-700`}
          >
            {message.messageType === "text" && <span>{message.content}</span>}
            {message.messageType === "file" && (
              <div>
                {checkIfImages(message.fileURL) ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setShowImages(true);
                      setImagesUrl(message.fileURL);
                    }}
                  >
                    {" "}
                    <img
                      src={`${HOST}${message.fileURL}`}
                      height={300}
                      width={300}
                      alt={`${HOST}${message.fileURL}`}
                    />{" "}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-white text-3xl bg-black p-3 rounded">
                      <MdFolderZip />
                    </span>
                    <span>{message.fileURL.split("/").pop()}</span>
                    <span
                      className="text-white text-3xl bg-black p-3 rounded-full hover:bg-black/50
                     cursor-pointer transition-all duration-300"
                      onClick={() => dawnloadFile(message.fileURL)}
                    >
                      <IoMdArrowDown />
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {moment(message.timestamp).format("LT")}{" "}
            </div>
          </div>
        </div>
      );
    });
  };

  const dawnloadFile = async (url) => {
    setIsDownLoading(true);
    setFileDownloadProgress(0);
    const res = await apiClient.get(`${HOST}${url}`, {
      responseType: "blob",
      onDownloadProgress: (processEvent) => {
        const { loaded, total } = processEvent;
        const completed = Math.round(loaded * 100) / total;
        setFileDownloadProgress(completed);
      },
    });
    const urlblob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlblob;
    link.setAttribute("Download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlblob);
    setIsDownLoading(false);
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] flex flex-col"
    >
      {renderMessages()}
      {showImage && (
        <div
          className={`fixed z-[100] top-0 left-0 h-screen w-screen flex
  items-center justify-center flex-col backdrop-blur-lg
  transition-[opacity,transform] duration-1000 ease-out
  ${
    showImage
      ? "opacity-100 scale-100 pointer-events-auto"
      : "opacity-0 scale-95 pointer-events-none"
  }`}
        >
          <img
            src={`${HOST}${imageUrl}`}
            alt={imageUrl}
            className="h-[80vh] w-[80vw] bg-cover "
          />
          <div className="flex gap-5 fixed top-0 mt-5 ">
            <button
              className="text-white text-3xl bg-black p-3 rounded-full hover:bg-black/50
                     cursor-pointer transition-all duration-300"
              onClick={dawnloadFile}
            >
              {" "}
              <IoMdArrowDown />{" "}
            </button>
            <button
              className="text-white text-3xl bg-black p-3 rounded-full hover:bg-black/50
                     cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImages(false);
                setImagesUrl(null);
              }}
            >
              {" "}
              <IoClose />{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
