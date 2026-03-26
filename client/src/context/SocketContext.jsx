import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import io from "socket.io-client";
import { HOST } from "@/utils/constance";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);

  const { userInfo, selectedChatData, selectedChatType, addMessages } =
    useAppStore();

  const selectedChatDataRef = useRef(null);
  const selectedChatTypeRef = useRef(null);

  useEffect(() => {
    selectedChatDataRef.current = selectedChatData;
    selectedChatTypeRef.current = selectedChatType;
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (!userInfo?._id) return;

    socket.current = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo._id },
    });

    socket.current.on("connect", () => {
      console.log("Socket connected");
    });

    const handleReceiveMessage = (message) => {
      const chatData = selectedChatDataRef.current;
      const chatType = selectedChatTypeRef.current;

      if (
        chatType &&
        (chatData?._id === message.sender._id ||
          chatData?._id === message.recipient._id)
      ) {
        addMessages(message);
      }
    };

    socket.current.on("recieveMessage", handleReceiveMessage);

    return () => {
      socket.current.off("recieveMessage", handleReceiveMessage);
      socket.current.disconnect();
    };
  }, [userInfo, addMessages]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
