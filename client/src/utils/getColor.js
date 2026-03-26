import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/lottie-json"


export const colors = [
  "bg-[#4cc9f02a] text-[#4cc9f0] border border-[#4cc9f0bb]",
  "bg-[#712c4a57] text-[#ff006e] border border-[#ff005f]",
  "bg-[#ffd60a2a] text-[#ffd60a] border border-[#ffd6ab]",
  "bg-[#06d6a02a] text-[#06d6a0] border border-[#06d6a0bb]",
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
};

export const animationDefaultOptions={
  loop:true,
  autoplay:true,
  animationData:animationData,
}