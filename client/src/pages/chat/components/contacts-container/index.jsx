import ProfileInfoComponent from "./profileInfoComponent.jsx";
import NewDmComponents from "./newDmComponents.jsx";
import { useEffect } from "react";
import apiClient from "@/lib/api-client.js";
import { GET_DM_CONTACTS } from "@/utils/constance.js";
import { useAppStore } from "@/store/index.js";
import ConactListDm from "../../../../components/contact-list.jsx";

const ContactsContainer = () => {
  const { setDirectMessageContacts, directMessageContacts } = useAppStore();
  useEffect(() => {
    const getDmContacts = async () => {
      const res = await apiClient.get(GET_DM_CONTACTS, {
        withCredentials: true,
      });
      if (res.data.contacts) {
        setDirectMessageContacts(res.data.contacts);
      }
    };

    getDmContacts();
  }, []);

  return (
    <div className="relative w-[100vw] sm:w-[35vw]  md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[rgb(11,11,11)] border-r-2 border-[#2f303b] ">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Message" />
          <NewDmComponents />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ConactListDm contacts={directMessageContacts}></ConactListDm>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          {/* <Title text="Channels" /> */}
        </div>
      </div>
      <ProfileInfoComponent />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#38bdf8"
        />
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#0ea5e9"
        />
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#0284c7"
        />
      </svg>
      <span className="text-3xl font-semibold">Talksy</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-gray-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
