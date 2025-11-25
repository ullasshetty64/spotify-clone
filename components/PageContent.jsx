"use client";

import SongItem from "./SongItem";
import useOnPlay from "@/hooks/useOnPlay"; // We need to make this small hook

const PageContent = ({ songs = [] }) => {
  const onPlay = useOnPlay(songs); // Use the hook to handle playback logic

  if (songs.length === 0) {
    return (
      <div className="mt-4 text-neutral-400">
        No songs available.
      </div>
    )
  }

  return ( 
    <div 
      className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4
      "
    >
      {songs.map((item) => (
        <SongItem 
          key={item.id} 
          onClick={(id) => onPlay(id)} 
          data={item} 
        />
      ))}
    </div>
   );
}
 
export default PageContent;