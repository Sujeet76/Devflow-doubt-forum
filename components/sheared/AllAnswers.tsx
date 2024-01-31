import { AnswerFilters } from "@/constants/filters";
import React from "react";
import Filters from "./Filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

interface Props {
  questionId: string;
  userId: string;
  totalAnswer: number;
  page?: number;
  filter?: number; // may be string
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswer,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({
    questionId,
  });

  return (
    <div className='mt-11'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'>{totalAnswer} Answers</h3>
        <Filters
          filters={AnswerFilters}
          otherClasses='min-h-[36px]'
        />
      </div>

      <div>
        {result?.answers.map((answer) => {
          const ansId = JSON.stringify(answer?._id);
          return (
            <article
              key={answer?._id}
              className='light-border border-b py-10'
            >
              {/* span id -> to scroll */}
              <span id={ansId.replaceAll('"', "")}></span>
              <div className='flex items-center justify-between'>
                <div className='mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                  <Link
                    href={`/profile/${answer?.author?.clerkId}`}
                    className='flex flex-1 items-start gap-1 sm:items-center'
                  >
                    <Image
                      src={answer.author.picture}
                      width={18}
                      height={18}
                      alt='profile'
                      className='rounded-full object-cover max-sm:mt-0.5'
                    />
                    <div className='flex flex-col sm:flex-row sm:items-center'>
                      <p className='body-semibold text-dark300_light700'>
                        {answer?.author?.name}
                      </p>
                      <p className='small-regular text-light400_light500 mt-0.5 line-clamp-1'>
                        &nbsp; • &nbsp;
                        <span className='max-sm:hidden '>
                          answered &nbsp; {getTimeStamp(answer?.createdAt)}
                        </span>
                      </p>
                    </div>
                  </Link>
                  <div className='flex justify-end'>
                    <Votes
                      type='answer'
                      itemId={JSON.stringify(answer._id)}
                      userId={JSON.stringify(userId)}
                      upvotes={answer?.upvotes?.length}
                      hasupVoted={answer?.upvotes?.includes(userId)}
                      downvotes={answer?.downvotes?.length}
                      hasdownVoted={answer?.downvotes?.includes(userId)}
                    />
                  </div>
                </div>
              </div>
              <ParseHTML data={answer.content} />
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AllAnswers;
