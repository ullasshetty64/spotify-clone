"use client";

import uniqid from "uniqid";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    }
  });

  const onChange = (open) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  }

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();
      // FIX: Remove spaces from title to prevent upload errors
      const sanitizedTitle = values.title.replace(/[^a-zA-Z0-9]/g, '');

      // --- STEP 1: UPLOAD SONG ---
      console.log("STEP 1: Uploading Song...");
      const songFileName = `song-${sanitizedTitle}-${uniqueID}`;
      
      const { 
        data: songData, 
        error: songError 
      } = await supabaseClient
        .storage
        .from('songs')
        .upload(songFileName, songFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (songError) {
        setIsLoading(false);
        console.log("SONG ERROR:", songError);
        return toast.error("Failed song upload.");
      }
      console.log("STEP 2: Song Upload Success:", songData);

      // --- STEP 3: UPLOAD IMAGE ---
      console.log("STEP 3: Uploading Image...");
      const imageFileName = `image-${sanitizedTitle}-${uniqueID}`;

      const { 
        data: imageData, 
        error: imageError 
      } = await supabaseClient
        .storage
        .from('images')
        .upload(imageFileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (imageError) {
        setIsLoading(false);
        console.log("IMAGE ERROR:", imageError);
        return toast.error("Failed image upload.");
      }
      console.log("STEP 4: Image Upload Success:", imageData);


      // --- STEP 5: INSERT INTO DATABASE ---
      console.log("STEP 5: Inserting into Database...");
      const { 
        error: supabaseError 
      } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path
        });

      if (supabaseError) {
        setIsLoading(false);
        console.log("DB ERROR:", supabaseError);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song created!');
      reset();
      uploadModal.onClose();
      
    } catch (error) {
      console.log("CRITICAL ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-y-4"
      >
        <Input 
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input 
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
}

export default UploadModal;