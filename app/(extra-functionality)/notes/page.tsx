"use client";
import { Button } from "@/components/ui/button";
import { createNote } from "@/lib/actions/note.action";
import { useUser } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const NotePage = () => {
  const router = useRouter();
  const { user } = useUser();

  const onCreate = () => {
    const promise = createNote({
      title: "Untitled",
      owner: user?.id ?? "",
    });
    toast.promise(promise, {
      loading: "Creating note..",
      success: "Note created",
      error: "Failed to create note",
    });
  };

  return (
    <div className='flex size-full flex-col items-center justify-center space-y-4'>
      <Image
        src='/assets/images/empty.png'
        alt='empty'
        height='300'
        width='300'
        className='dark:hidden'
      />
      <Image
        src='/assets/images/empty-dark.png'
        alt='empty'
        height='300'
        width='300'
        className='hidden dark:block'
      />
      <h2 className='h2-bold text-dark200_light900'>
        Welcome to {user?.firstName}&apos;s Note
      </h2>
      <Button
        onClick={onCreate}
        className='primary-gradient min-h-[46px] gap-1 rounded-[10px] border-none px-4 py-3 !font-medium text-light-900 transition-all duration-300 hover:scale-110'
      >
        <PlusCircle className='size-4' />
        Create a note
      </Button>
    </div>
  );
};

export default NotePage;
