"use client";
import { Button } from "../ui/button";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { useEffect } from "react";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { toast } from "sonner";

interface VotesProps {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
}: VotesProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleVote = async (action: string) => {
    try {
      if (!userId) {
        return toast.error("You need to login to vote", {
          description: "You must be logged in to vote on this question.",
        });
      }

      if (action === "upvote") {
        let res;
        if (type === "question") {
          res = await upvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted,
            path: pathname,
          });
        } else if (type === "answer") {
          res = await upvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasupVoted,
            path: pathname,
          });
        }

        if (res && res?.error) return toast.error(res?.error);

        return !hasupVoted
          ? toast.success(`Upvoted successfully`)
          : toast.warning("Upvote removed");
      }

      if (action === "downvote") {
        let res;
        if (type === "question") {
          res = await downvoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasdownVoted,
            path: pathname,
          });
        } else if (type === "answer") {
          res = await downvoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasdownVoted,
            path: pathname,
          });
        }

        if (res && res?.error) return toast.error(res?.error);

        return !hasdownVoted
          ? toast.success(`Downvote successfully`)
          : toast.warning("Downvote removed");
      }
    } catch (e: any) {
      console.log({ e });
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);

  const saveToCollection = async () => {
    if (!userId) {
      return toast.error("Please Login", {
        description:
          "You must be logged in to save this question in your collection.",
      });
    }

    await toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path: pathname,
    });
    return !hasSaved
      ? toast.success(`Added to collection`)
      : toast.error("Removed from removed");
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
