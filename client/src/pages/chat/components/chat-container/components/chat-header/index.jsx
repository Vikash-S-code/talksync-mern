import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constance";
import { getColor } from "@/utils/getColor";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] bg-[#15171c] flex items-center justify-between">
      <div className="flex w-full gap-5 items-center justify-between  px-5">
        <div className="flex gap-3 items-center justify-center">
          <div className="flex items-center justify-center gap-3">
            <Avatar className="h-12 w-12  rounded-full overflow-hidden ">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}${selectedChatData.image}`}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black text-white"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full  text-lg flex items-center justify-center rounded-full border-[3px] ${getColor(
                    selectedChatData.color
                  )} transition-all duration-300 `}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>
            <div>
              {selectedChatData.firstName && selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : ""}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white transition-all duration-300 text-3xl"
          >
            <RiCloseFill />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
