import QuestionForm from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Question | Dev Overflow",
  description:
    "Update your question on Dev Overflow. Modify your question details, clarify your doubts, and enhance your learning experience.",
  keywords:
    "Dev Overflow, Edit Question, Update Question, Coding Questions, Programming Help, Learn Coding, Developer Community",
};

const Edit = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-up");

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Edit question</h1>
      <div className='mt-9'>
        <QuestionForm
          type='edit'
          questionDetails={JSON.stringify(result)}
          mongoUserId={JSON.stringify(mongoUser._id)}
        />
      </div>
    </div>
  );
};

export default Edit;
