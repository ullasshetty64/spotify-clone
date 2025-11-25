"use client";

import { TbPlaylist } from "react-icons/tb"; 
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-hot-toast";

import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import MediaItem from "./MediaItem"; // <--- Import the new component

const Library = ({ songs = [] }) => { // <--- Receive songs prop
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const { user } = useUser();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    // YOUR ADMIN LOGIC
    const adminID = 'c895977e-6fcc-4aaa-9143-d334dc8723af';

    if (user.id !== adminID) {
      return toast.error("Only the admin can upload songs!");
    }

    return uploadModal.onOpen();
  };

  return ( 
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">
            Your Library
          </p>
        </div>
        <AiOutlinePlus 
          onClick={onClick} 
          size={20} 
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {/* DISPLAY THE SONGS HERE */}
        {songs.map((item) => (
          <MediaItem 
            onClick={() => {}} 
            key={item.id} 
            data={item} 
          />
        ))}
      </div>
    </div>
   );
}
 
export default Library;