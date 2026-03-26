import { useAppStore } from "@/store";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constance";
import { getColor } from "@/utils/getColor";

const ConactListDm = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChattype,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  console.log(contacts);

  const handleClcik = (contact) => {
    if (isChannel) setSelectedChattype("channel");
    else setSelectedChattype("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts.map((contact, index) => (
        <div
          key={index}
          className={`pl-7 py-4 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-sky-600"
              : "hover:bg-gray-800"
          } mx-3 rounded-lg my-1 scroll-smooth`}
          onClick={() => handleClcik(contact)}
        >
          <div className="flex gap-5 items-center justify-self-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}${contact.image}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-full w-full text-lg flex items-center
                       justify-center rounded-full border-[3px] ${getColor(
                         contact.color
                       )}`}
                  >
                    {(contact.firstName || contact.email)?.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && <div>channel</div>}
            <div className="flex gap-2">
              <span>{contact.firstName}</span>
              <span>{contact.lastName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConactListDm;
