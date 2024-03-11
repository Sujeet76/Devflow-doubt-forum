import {
  getRecommendedQuestions,
  getQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import NoResult from "../sheared/NoResult";

const fetchQuestions = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  let result;
  if (searchParams?.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        searchQuery: searchParams?.q,
        userId,
        page: searchParams.page ? +searchParams.page : 1,
        pageSize: searchParams.pageSize ? +searchParams.pageSize : 20,
      });
    } else {
      result = Promise.resolve({
        questions: [],
        isNext: false,
      });
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams?.q,
      filter: searchParams?.filter,
      page: searchParams.page ? +searchParams.page : 1,
      pageSize: searchParams.pageSize ? +searchParams.pageSize : 20,
    });
  }
  return result;
};

const Test = async ({ searchParams }: SearchParamsProps) => {
  const result = await fetchQuestions({ searchParams });

  if (!result || !result?.questions || result?.questions.length <= 0) {
    return (
      <NoResult
        title='There are no question to show'
        description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡`}
        link='/ask-question'
        linkTitle='Ask a Question'
      />
    );
  }

  return (
    <div
      className='mt-10 flex w-full flex-col gap-6'
      key={Date.now()}
    >
      {result?.questions.map((question) => (
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
      ))}
    </div>
  );
};

export default Test;
