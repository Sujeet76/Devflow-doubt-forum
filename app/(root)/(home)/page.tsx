import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/sheared/Filters";
import NoResult from "@/components/sheared/NoResult";
import LocalSearch from "@/components/sheared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { QuestionFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";

export default async function Home() {
  const result = await getQuestions({});

  return (
    <>
      <div>
        <div className='flex w-full flex-col justify-between gap-4 sm:flex-row-reverse'>
          <Link
            href='/ask-question'
            className='self-end'
          >
            <Button className='primary-gradient min-h-[46px] rounded-[10px] border-none px-4 py-3 !font-medium text-light-900'>
              Ask a Question
            </Button>
          </Link>
          <h1 className='h1-bold text-dark100_light900'>All Question</h1>
        </div>
        <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
          <LocalSearch
            icon='/assets/icons/search.svg'
            placeholder='Search for Questions Here...'
            iconPosition='left'
          />
          <Filters
            filters={QuestionFilters}
            otherClasses='min-h-[56px] sm:min-w-[170px]'
            containerClasses='hidden max-md:flex'
          />
        </div>
        <HomeFilters />
      </div>

      {/* card component */}
      <div className='mt-10 flex w-full flex-col gap-6'>
        {result && result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
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
    </>
  );
}
