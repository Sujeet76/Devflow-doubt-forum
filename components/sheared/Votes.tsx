"use client";
import { Button } from "../ui/button";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { usePathname } from "next/navigation";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";

interface VotesProps {
  type: string;
  itemsId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemsId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
}: VotesProps) => {
  const pathname = usePathname();

  const handleVote = async (action: string) => {
    if (!userId) return;

    if (action === "upvote") {
      if (type === "question") {
        console.log("upvote");
        await upvoteQuestion({
          questionId: JSON.parse(itemsId),
          userId: JSON.parse(userId),
          hasupVoted,
          path: pathname,
        });
      } else if (type === "answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemsId),
          userId: JSON.parse(userId),
          hasupVoted,
          path: pathname,
        });
      }
    }

    if (action === "downvote") {
      if (type === "question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemsId),
          userId: JSON.parse(userId),
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemsId),
          userId: JSON.parse(userId),
          hasdownVoted,
          path: pathname,
        });
      }
    }
  };

  const saveToCollection = async () => {
    await toggleSaveQuestion({
      questionId: JSON.parse(itemsId),
      userId: JSON.parse(userId),
      path: pathname,
    });
  };

  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        {/* up vote */}
        <div className='flex-center gap-1.5'>
          <Button
            onClick={() => handleVote("upvote")}
            variant={"ghost"}
            className='p-0'
          >
            <Image
              src={
                hasupVoted
                  ? "/assets/icons/upvoted.svg"
                  : "/assets/icons/upvote.svg"
              }
              alt={hasupVoted ? "upvoted" : "upvote"}
              width={18}
              height={18}
              className='select-none'
            />
          </Button>
          <p className='flex-center background-light700_dark400 subtle-medium text-dark400_light900 min-w-[18px] rounded-sm p-1'>
            {formatNumber(upvotes)}
          </p>
        </div>
        {/* down vote */}
        <div className='flex-center gap-1.5'>
          <Button
            onClick={() => handleVote("downvote")}
            variant={"ghost"}
            className='p-0'
          >
            <Image
              src={
                hasdownVoted
                  ? "/assets/icons/downvoted.svg"
                  : "/assets/icons/downvote.svg"
              }
              alt={hasdownVoted ? "downvoted" : "downvote"}
              width={18}
              height={18}
              className='select-none'
            />
          </Button>
          <p className='flex-center background-light700_dark400 subtle-medium text-dark400_light900 min-w-[18px] rounded-sm p-1'>
            {formatNumber(downvotes)}
          </p>
        </div>
        {/* up vote */}
        <Button
          onClick={saveToCollection}
          variant={"ghost"}
          className='p-0'
        >
          {type === "question" && (
            <Image
              src={
                hasSaved
                  ? "/assets/icons/star-filled.svg"
                  : "/assets/icons/star-red.svg"
              }
              alt={hasSaved ? "in collection" : "not in collection"}
              width={18}
              height={18}
              className='select-none'
            />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Votes;
