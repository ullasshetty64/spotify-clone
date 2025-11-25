"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

const LikeButton = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  // 1. Check if the song is already liked when the component loads
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    }

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  // 2. Handle the Click
  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      // Delete logic
      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
        toast.success('Unliked!');
      }
    } else {
      // Add logic
      const { error } = await supabaseClient
        .from('liked_songs')
        .insert({
          song_id: songId,
          user_id: user.id
        });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success('Liked!');
      }
    }

    router.refresh();
  }

  return (
    <button 
      onClick={handleLike}
      className="
        hover:opacity-75 
        transition
      "
    >
      <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
    </button>
  );
}

export default LikeButton;