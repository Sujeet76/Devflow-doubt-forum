"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUser } from "@clerk/nextjs";
import { ChevronsLeftRight } from "lucide-react";

const UserItem = () => {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          role='button'
          className='hover:bg-primary/5 flex w-full items-center p-3 text-sm'
        >
          <div className='flex max-w-[150px] items-center gap-x-2'>
            <Avatar className='size-5'>
              <AvatarImage
                src={user?.imageUrl ?? ""}
                alt='avatar'
              />
            </Avatar>
            <span className='line-clamp-1 text-start font-medium'>
              {user?.fullName}&apos;s Note
            </span>
          </div>
          <ChevronsLeftRight className='text-muted-foreground ml-2 size-4 rotate-90' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserItem;
