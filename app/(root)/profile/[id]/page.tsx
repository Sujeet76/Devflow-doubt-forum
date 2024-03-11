import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJoinedDate } from "@/lib/utils";
import ProfileLink from "@/components/sheared/ProfileLink";
import Stats from "@/components/sheared/Stats";
import QuestionTab from "@/components/sheared/QuestionTab";
import AnswerTab from "@/components/sheared/AnswerTab";
import NoResult from "@/components/sheared/NoResult";
import TopInteractedTags from "@/components/sheared/TopInteractedTags";
import type { Metadata } from "next";
import QuestionLoading from "@/components/home/questionLoading";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const userInfo = await getUserInfo({
    userId: params.id,
  });

  return {
    title: `${userInfo?.user.name} | Dev overflow`,
    description: `${userInfo?.user.name}'s profile on Dev Overflow. ${userInfo?.user.bio ?? "Learn more about this developer and their contributions."}`,
    keywords: `Dev Overflow, Developer Profile, ${userInfo?.user.name}, Coding Questions, Programming Help, Code Collaboration, Learn Coding, Share Code, Programming Community, Software Development`,
    openGraph: {
      images: [
        {
          url: userInfo?.user.picture,
          width: 800,
          height: 600,
          alt: `${userInfo?.user.name}'s profile picture`,
        },
      ],
      title: `${userInfo?.user.name} | Dev overflow`,
      description: `${userInfo?.user.name}'s profile on Dev Overflow. ${userInfo?.user.bio ?? "Learn more about this developer and their contributions."}`,
    },
  };
};

const Profile = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  const { id } = params;
  const userInfo = await getUserInfo({
    userId: id,
  });

  if (!userInfo) {
    <NoResult
      title='User not found 🥹😥'
      description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion.By registering to our platform💡`}
      link='/sign-up'
      linkTitle='Get stared with us'
    />;
  }

  return (
    <>
      <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <div className='flex flex-col items-start gap-4 lg:flex-row'>
          <Image
            src={userInfo?.user.picture}
            alt='avatar'
            width={140}
            height={140}
            className='rounded-full'
          />
          <div className='mt-3'>
            <h2 className='h2-bold text-dark100_light900'>
              {userInfo?.user.name}
            </h2>
            <p className='paragraph-regular text-dark200_light800'>
              @{userInfo?.user.username}
            </p>
            <div className='mt-5 flex flex-wrap items-center justify-start gap-3'>
              {userInfo?.user.location && (
                <ProfileLink
                  imgUrl='/assets/icons/location.svg'
                  title={userInfo?.user.location}
                />
              )}
              {userInfo?.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl='/assets/icons/link.svg'
                  href={userInfo?.user.portfolioWebsite}
                  title='Portfolio'
                />
              )}
              <ProfileLink
                imgUrl='/assets/icons/calendar.svg'
                title={getJoinedDate(userInfo?.user.joinedAt)}
              />
            </div>
            {userInfo?.user.bio && (
              <p className='paragraph-regular text-dark400_light800 mt-8'>
                {userInfo?.user.bio}
              </p>
            )}
          </div>
        </div>
        <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
          <SignedIn>
            {clerkId === userInfo?.user.clerkId && (
              <Link href={`/profile/edit`}>
                <Button className='paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3'>
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestion={userInfo?.totalQuestions ?? 0}
        totalAnswer={userInfo?.totalAnswers ?? 0}
        badges={userInfo?.badgeCounts}
        reputation={userInfo?.reputation | 0}
      />
      <div className='mt-10 flex flex-col gap-10 lg:flex-row'>
        <Tabs
          defaultValue='top-posts'
          className='flex-1'
        >
          <TabsList className='background-light800_dark400 min-h-[42px] p-1'>
            <TabsTrigger
              value='top-posts'
              className='tab rounded'
            >
              Top Posts
            </TabsTrigger>
            <TabsTrigger
              value='answer'
              className='tab rounded'
            >
              Answer
            </TabsTrigger>
          </TabsList>
          <TabsContent value='top-posts'>
            <Suspense
              fallback={<QuestionLoading />}
            >
              <QuestionTab
                searchParams={searchParams}
                userId={userInfo?.user._id}
                clerkId={userInfo?.user.clerkId}
                totalQuestion={userInfo?.totalQuestions ?? 0}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value='answer'>
            <Suspense fallback={<QuestionLoading />}>
              <AnswerTab
                searchParams={searchParams}
                userId={userInfo?.user._id}
                clerkId={userInfo?.user.clerkId}
                totalAnswer={userInfo?.totalAnswers ?? 0}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
        {/* top interacted tags */}
        <div className='flex min-w-[240px] flex-col max-lg:hidden'>
          <h4 className='h3-semibold text-dark400_light900 flex min-h-[42px] items-center'>
            Top Tags
          </h4>
          <TopInteractedTags
            searchParams={searchParams}
            userId={userInfo?.user._id}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
