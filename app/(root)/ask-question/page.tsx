import QuestionForm from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ask Question | Dev Overflow",
  description:
    "Join the Dev Overflow community! A platform where developers connect, share knowledge, and collaborate on various topics. Get answers to your coding questions, share your expertise, and grow together.",
  keywords: [
    "Dev Overflow",
    "Developer Community",
    "Coding Questions",
    "Programming Help",
    "Code Collaboration",
    "Learn Coding",
    "Share Code",
    "Programming Community",
    "Software Development",
  ],
};

const AskQuestion = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-up");

  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Ask a public question</h1>
      <div className='mt-9'>
        <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
