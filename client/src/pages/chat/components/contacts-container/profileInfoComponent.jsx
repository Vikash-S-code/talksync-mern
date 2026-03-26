import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { getColor } from "@/utils/getColor";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constance";
import { HOST } from "@/utils/constance";

const ProfileInfoComponent = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      console.log(res);
      if (res.status === 200) {
        navigate("/auth");
        setUserInfo(undefined);
      }
    } catch (error) {
      toast.error(error.message || "error");
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#15171c]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12  rounded-full overflow-hidden ">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}${userInfo.image}`}
                alt="Profile"
                className="object-cover w-full h-full bg-black text-white"
              />
            ) : (
              <div
                className={`uppercase h-full w-full  text-lg flex items-center justify-center rounded-full border-[3px] ${getColor(
                  userInfo.color
                )} transition-all duration-300 `}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <Tooltip>
          <TooltipTrigger>
            <FiEdit2
              className="cursor-pointer text-sky-500 text-xl "
              onClick={() => navigate("/profile")}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white font-semibold cursor-default ">
            <p>Edit Profile</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <IoPowerSharp
              className="cursor-pointer text-sky-500 text-xl"
              onClick={() => logout()}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white font-semibold cursor-default ">
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileInfoComponent;
