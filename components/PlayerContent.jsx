"use client";

import useSound from "use-sound";
import LikeButton from "./LikeButton"; // <--- Add Import
import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";

import usePlayer from "@/hooks/usePlayer";
import Slider from "./Slider";
import MediaItem from "./MediaItem";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const PlayerContent = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);
  const [soundDuration, setSoundDuration] = useState(0);

  const Icon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) return;
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];
    if (!nextSong) return player.setId(player.ids[0]);
    player.setId(nextSong);
  }

  const onPlayPrevious = () => {
    if (player.ids.length === 0) return;
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];
    if (!previousSong) return player.setId(player.ids[player.ids.length - 1]);
    player.setId(previousSong);
  }

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ['mp3']
  });

  useEffect(() => {
    if (duration) {
      setSoundDuration(duration / 1000);
    }
  }, [duration]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound && isPlaying) {
        setTimeProgress(sound.seek());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound, isPlaying]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  }

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }

  const handleSeek = (newValue) => {
    setTimeProgress(newValue); 
    if (sound) {
      sound.seek(newValue);
    }
  };

  return ( 
    <div className="h-full">
      
      {/* ============================== */}
      {/* 1. MOBILE LAYOUT (Flex Column) */}
      {/* ============================== */}
      {/* FIX: Added 'pb-2' here to push content slightly up from the bottom edge */}
      <div className="flex md:hidden flex-col h-full justify-center pb-2">
        
        {/* Top Row: Song Info (Left) + Play Button (Right) */}
        <div className="flex justify-between items-center w-full pr-2">
           <div className="flex w-full items-center truncate pr-2 gap-x-3">
             <MediaItem data={song} />
             {/* FIX: Added LikeButton here for Mobile */}
             <LikeButton songId={song.id} />
           </div>
           
           <div 
             onClick={handlePlay} 
             className="
               h-8 w-8 
               min-w-[32px] 
               flex 
               items-center 
               justify-center 
               rounded-full 
               bg-white 
               p-1 
               cursor-pointer
             "
           >
             {isPlaying ? <BsPauseFill size={22} className="text-black" /> : <BsPlayFill size={22} className="text-black" />}
           </div>
        </div>

        {/* Bottom Row: Full Width Progress Bar */}
        <div className="flex w-full items-center gap-x-2 px-2 pb-1">
           <span className="text-[10px] text-neutral-400 w-[30px] text-right">
             {formatTime(timeProgress)}
           </span>
           
           <Slider 
             value={timeProgress}
             max={soundDuration} 
             onChange={handleSeek}
           />
           
           <span className="text-[10px] text-neutral-400 w-[30px]">
             -{formatTime(soundDuration - timeProgress)}
           </span>
        </div>
      </div>


      {/* ============================== */}
      {/* 2. DESKTOP LAYOUT (Grid)       */}
      {/* ============================== */}
      <div className="hidden md:grid md:grid-cols-3 h-full">
        
        {/* Left: Song Info */}
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-x-4">
            <MediaItem data={song} />
            <LikeButton songId={song.id} />
          </div>
        </div>

        {/* Center: Controls + Progress Bar */}
        <div className="flex flex-col col-auto w-full justify-center items-center gap-y-1">
          <div className="flex items-center gap-x-6">
            <AiFillStepBackward 
              onClick={onPlayPrevious} 
              size={30} 
              className="text-neutral-400 cursor-pointer hover:text-white transition" 
            />
            <div 
              onClick={handlePlay} 
              className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer hover:scale-110 transition"
            >
              {isPlaying ? (
                 <BsPauseFill size={30} className="text-black" />
              ) : (
                 <BsPlayFill size={30} className="text-black" />
              )}
            </div>
            <AiFillStepForward 
              onClick={onPlayNext} 
              size={30} 
              className="text-neutral-400 cursor-pointer hover:text-white transition" 
            />
          </div>

          <div className="hidden md:flex w-full items-center gap-x-2 max-w-[500px]">
             <span className="text-xs text-neutral-400 w-[40px] text-right">
               {formatTime(timeProgress)}
             </span>
             <Slider 
               value={timeProgress}
               max={soundDuration} 
               onChange={handleSeek}
             />
             <span className="text-xs text-neutral-400 w-[40px]">
               {formatTime(soundDuration)}
             </span>
          </div>
        </div>

        {/* Right: Volume Control */}
        <div className="hidden md:flex w-full justify-end items-center">
          <div className="flex items-center gap-x-2 w-[120px]">
            <Icon onClick={toggleMute} className="cursor-pointer" size={34} />
            <Slider 
              value={volume} 
              onChange={(value) => setVolume(value)}
              max={1} 
              step={0.1}
            />
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default PlayerContent;