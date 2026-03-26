import { animationDefaultOptions } from "@/utils/getColor";
import React from "react";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[rgb(11,11,11)] md:flex flex-col justify-center items-center hidden transition-all duration-1000 ">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className=" poppins-medium ">
          Hi <span className="text-sky-400 ">!</span> Welcome to{" "}
          <span className="text-sky-400">Talksy</span> Chat Application{" "}
          <span className="text-sky-400">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
