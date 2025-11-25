"use client";

import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";

const MediaItem = ({ data, onClick }) => {
  const imageUrl = useLoadImage(data);

  // --- ADD THIS DEBUG LINE ---
  console.log("DEBUG IMAGE URL:", data.title, imageUrl);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };

  return ( 
    <div 
      onClick={handleClick}
      className="
        flex 
        items-center 
        gap-x-3 
        cursor-pointer 
        hover:bg-neutral-800/50 
        w-full 
        p-2 
        rounded-md
      "
    >
      <div 
        className="
          relative 
          rounded-md 
          min-h-[48px] 
          min-w-[48px] 
          overflow-hidden
        "
      >
        {/* FIX: Use standard img tag instead of Next.js Image to avoid config issues */}
        <img
          src={imageUrl || '/images/liked.png'}
          alt="Media Item"
          className="object-cover w-full h-full absolute inset-0"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">
          {data.title}
        </p>
        <p className="text-neutral-400 text-sm truncate">
          {data.author}
        </p>
      </div>
    </div>
   );
}
 
export default MediaItem;