import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
  const questions = await getTopQuestions();
  const tags = await getTopTags();

  return (
    <aside className='background-light900_dark200 light-border sticky right-0 top-0 flex h-screen flex-col  gap-6 overflow-y-auto border-r px-4 pb-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]'>
      <div>
        <h3 className='h3-bold text-dark200_light900 text-xl'>Hot Network</h3>
        <div className='mt-7 flex w-full flex-col gap-[30px]'>
          {questions &&
            questions?.map((item) => (
              <Link
                href={`/question/${item._id}`}
                key={item?._id}
                className='flex cursor-pointer items-center justify-between gap-7'
              >
                <p className='body-medium text-dark500_light700'>
                  {item?.title}
                </p>
                <Image
                  src='/assets/icons/chevron-right.svg'
                  alt='right arrow'
                  width={20}
                  height={20}
                  className='invert-colors'
                />
              </Link>
            ))}
        </div>
      </div>
      <div className='mt-10'>
        <h3 className='h3-bold text-dark200_light900 text-xl'>Popular Tags</h3>
        <div className='mt-7 flex w-full flex-col gap-[30px]'>
          {tags &&
            tags?.map((tag) => (
              <RenderTag
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                totalQuestion={tag.totalQuestion}
                showCount={true}
              />
            ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
