import Link from "next/link";
import { getQuestionById } from "@/lib/actions/question.action";
import Image from "next/image";
import Metric from "@/components/sheared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import ParseHTML from "@/components/sheared/ParseHTML";
import RenderTag from "@/components/sheared/RenderTag";
import Answer from "@/components/forms/Answer";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswers from "@/components/sheared/AllAnswers";
import Votes from "@/components/sheared/Votes";
import NoResult from "@/components/sheared/NoResult";
import type { Metadata } from "next";

interface QuestionAnswerParams {
  id: string;
}

// TODO : this is not working
// // this is statically generate the page at build time which will lead to performance improvement
// export const generateStaticParams = async (): Promise<string[]> => {
//   const data = await getQuestions({});
//   if (!data) return [];

//   return data.questions.map((question) => question._id);
// };

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const result = await getQuestionById({ questionId: params.id });

  return {
    metadataBase: new URL(process.env?.NEXT_PUBLIC_URL ?? ""),
    title: `${result.title} | Dev overflow`,
    description: `${result.content.replace(/<[^>]*>/g, "")}`,
    keywords: `${result.tags.map((tag: any) => tag.name).join(", ")}`,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: process.env?.NEXT_PUBLIC_URL,
      siteName: "DevFlow",
      title: `${result.title} | Dev overflow`,
      description: `${result.content.replace(/<[^>]*>/g, "")}`,
      images: ["/assets/images/meta2.png"],
    },
  };
};

const QuestionAnswer = async ({ params }: { params: QuestionAnswerParams }) => {
  const result = await getQuestionById({ questionId: params.id });
  const { userId } = auth();

  let mongoUser;
  if (userId) {
    mongoUser = await getUserById({ userId });
  }

  if (!result) {
    return (
      <>
        <NoResult
          title='There are no question to show'
          description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡`}
          link='/ask-question'
          linkTitle='Ask a Question'
        />
      </>
    );
  }

  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <Link
            href={`/profile/${result.author.clerkId}`}
            className='flex items-center justify-start gap-2'
          >
            <Image
              src={result.author.picture}
              alt='profile picture'
              width={22}
              height={22}
              className='rounded-full'
            />
            <p className='paragraph-semibold text-dark300_light700'>
              {result.author.name}
            </p>
          </Link>

          <div className='flex justify-end'>
            <Votes
              type='question'
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={result?.upvotes?.length}
              hasupVoted={result?.upvotes?.includes(mongoUser?._id)}
              downvotes={result?.downvotes?.length}
              hasdownVoted={result?.downvotes?.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved?.includes(result._id)}
            />
          </div>
        </div>
        <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
          {result.title}
        </h2>
      </div>

      <div className='mb-8 mt-5  flex flex-wrap gap-4 '>
        <Metric
          imgUrl='/assets/icons/clock.svg'
          alt='clock'
          value={` asked ${getTimeStamp(result.createdAt)}`}
          title=' Asked'
          textStyle='small-medium text-dark400_light800'
        />
        <Metric
          imgUrl='/assets/icons/message.svg'
          alt='Answer'
          value={formatNumber(result.answers.length)}
          title='Answers'
          textStyle='small-medium text-dark400_light800'
        />
        <Metric
          imgUrl='/assets/icons/eye.svg'
          alt='eye'
          value={formatNumber(result.views)}
          title='views'
          textStyle='small-medium text-dark400_light800'
        />
      </div>

      {/* code view */}
      <ParseHTML data={result.content} />

      {/* tags */}
      <div className='mt-8 flex flex-wrap gap-2'>
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={result?._id}
        userId={mongoUser?._id}
        totalAnswer={result.answers.length}
      />

      <Answer
        questionAuthorId={JSON.stringify(result?.author?._id)}
        question={`${result?.title}\n ${result?.content}`}
        questionId={JSON.stringify(result?._id)}
        authorId={JSON.stringify(mongoUser?._id)}
      />
    </>
  );
};

export default QuestionAnswer;
