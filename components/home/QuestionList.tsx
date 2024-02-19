import React from "react";
import NoResult from "../sheared/NoResult";
import QuestionCard from "../cards/QuestionCard";

interface QuestionListProp {
  questions: {
    key: string;
    _id: string;
    title: string;
    tags: {
      _id: string;
      name: string;
    }[];
    author: {
      _id: string;
      name: string;
      picture: string;
      clerkId?: string | undefined;
    };
    upvotes: Array<Object>;
    createdAt: Date;
    views: number;
    answers: Array<Object>;
  }[];
}

const QuestionList = ({ questions }: QuestionListProp) => {
  return (
    <div className='mt-10 flex w-full flex-col gap-6'>
      {questions && questions.length > 0 ? (
        questions.map((question) => (
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
        <NoResult
          title='There are no question to show'
          description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡`}
          link='/ask-question'
          linkTitle='Ask a Question'
        />
      )}
    </div>
  );
};

export default QuestionList;
