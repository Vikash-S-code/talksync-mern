import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/utils/getColor";
import apiClient from "@/lib/api-client";
import { HOST, SEARCH_CONTACT_ROUTES } from "@/utils/constance";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store";

const NewDmComponents = () => {
  const { setSelectedChattype, setSelectedChatData } = useAppStore();

  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchContact, setSearchContact] = useState([]);

  const SearchContact = async (search) => {
    try {
      if (search.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACT_ROUTES,
          { search },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contacts) {
          setSearchContact(res.data.contacts);
        }
      } else {
        setSearchContact([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChattype("contact");
    setSelectedChatData(contact);
    setSearchContact([]);
  };


  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-neutral-300 font-light text-sm hover:text-neutral-50"
            onClick={() => setOpenNewContactModel(true)}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1b1c] border-none mb-2 p-3 text-white font-semibold">
          <p>Select new contact</p>
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewContactModel} onOpenchange={setOpenNewContactModel}>
        <DialogContent className="bg-[rgb(17,17,17)] border-2 border-[rgb(29,29,29)] text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>Please select contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Search contact"
              className="rounded-lg p-6 border-none bg-[rgb(29,29,29)]"
              onChange={(e) => SearchContact(e.target.value)}
            ></Input>
          </div>

          {searchContact.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-3">
                {searchContact?.map((con, index) => {
                  return (
                    <div
                      key={con._id + index}
                      className="flex  gap-2 items-center  justify-left cursor-pointer"
                    >
                      <div
                        onClick={() => selectNewContact(con)}
                        className="w-[95%] p-2 flex gap-3 items-center rounded"
                      >
                        {con.image ? (
                          <img
                            src={`${HOST}${con.image}`}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase w-8 h-8 flex rounded-full items-center justify-center ${getColor(
                              con.color
                            )} `}
                          >
                            {con.firstName
                              ? con.firstName.split("").shift()
                              : con.email.split("").shift()}
                          </div>
                        )}
                        <div>
                          {con?.firstName && con.firstName + " " + con.lastName}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {searchContact.length <= 0 && (
            <div className="flex-1  md:flex mt-5 flex-col justify-center items-center  transition-all duration-1000 ">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className=" poppins-medium ">
                  Hi <span className="text-sky-400 ">!</span>{" "}
                  <span className="text-sky-400"></span> Search new{" "}
                  <span className="text-sky-400">Contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDmComponents;
