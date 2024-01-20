import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string;
  totalQuestion: number;
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const result = await getUserQuestions({
    userId,
  });

  return (
    <div className='mt-5 flex flex-col gap-3'>
      {result && result?.questions.length > 0 ? (
        result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes?.length}
            createdAt={question.createdAt}
            views={question.views}
            answers={question.answers}
          />
        ))
      ) : (
        <div className='paragraph-medium text-dark400_light800'>
          No Question
        </div>
      )}
    </div>
  );
};

export default QuestionTab;
