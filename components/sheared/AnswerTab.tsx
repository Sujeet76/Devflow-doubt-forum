import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "../cards/AnswersCard";

interface AnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string;
  totalAnswer: number;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: AnswerTabProps) => {
  const result = await getUserAnswers({
    userId,
  });

  return (
    <div className='mt-5 flex flex-col gap-3'>
      {result && result?.answers.length > 0 ? (
        result.answers.map((answer) => (
          <AnswerCard
            key={answer._id}
            _id={answer.question._id}
            clerkId={clerkId}
            answer_Id={answer._id}
            title={answer.question.title}
            author={answer.author}
            upvotes={answer.upvotes?.length}
            createdAt={answer.createdAt}
          />
        ))
      ) : (
        <div className='paragraph-medium text-dark400_light800'>
          No Answer Any Question yet
        </div>
      )}
    </div>
  );
};

export default AnswerTab;
