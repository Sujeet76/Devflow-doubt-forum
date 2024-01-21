"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileSchema } from "@/lib/validation";
import { useState } from "react";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";

interface ProfileFormProps {
  clerkId: string;
  mongoUser: string;
}

const ProfileForm = ({ clerkId, mongoUser }: ProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedMongoUser = JSON.parse(mongoUser);
  const path = usePathname();
  const route = useRouter();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: parsedMongoUser?.username ?? "",
      name: parsedMongoUser?.name ?? "",
      location: parsedMongoUser?.location ?? "",
      bio: parsedMongoUser?.bio ?? "",
      portfolioWebsite: parsedMongoUser?.portfolioWebsite ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ProfileSchema>) => {
    try {
      // call for update
      setIsSubmitting(true);
      await updateUser({
        clerkId,
        updateData: {
          username: data.username,
          name: data.name,
          location: data.location,
          bio: data.bio,
          portfolioWebsite: data.portfolioWebsite,
        },
        path,
      });
      route.back();
    } catch (error) {
      console.log("Error while profile updating from", error);
    } finally {
      setIsSubmitting(false);
    }
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-10'
      >
        {/* name */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Enter your full name <sup className='text-rose-600'>*</sup>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter your full name'
                  {...field}
                  className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                />
              </FormControl>
              <FormMessage className='text-rose-900' />
            </FormItem>
          )}
        />

        {/* username */}
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Enter your username <sup className='text-rose-600'>*</sup>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter your username'
                  {...field}
                  className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                />
              </FormControl>
              <FormMessage className='text-rose-900' />
            </FormItem>
          )}
        />

        {/* location */}
        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Enter your location <sup className='text-rose-600'>*</sup>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter your location'
                  {...field}
                  className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                />
              </FormControl>
              <FormMessage className='text-rose-900' />
            </FormItem>
          )}
        />

        {/* portfolio */}
        <FormField
          control={form.control}
          name='portfolioWebsite'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Enter your portfolio url
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter your portfolio URL'
                  {...field}
                  className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                  type='url'
                />
              </FormControl>
              <FormMessage className='text-rose-900' />
            </FormItem>
          )}
        />

        {/* textarea */}
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Write something about yourself{" "}
                <sup className='text-rose-600'>*</sup>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='write something about yourself...'
                  {...field}
                  className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[100px] border'
                />
              </FormControl>
              <FormMessage className='text-rose-900' />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='primary-gradient w-fit !text-light-900'
          disabled={isSubmitting}
        >
          Update Profile
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
