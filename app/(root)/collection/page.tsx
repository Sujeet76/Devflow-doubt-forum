import { auth } from "@clerk/nextjs";
import { Suspense } from "react";

// ui imports
import QuestionCard from "@/components/cards/QuestionCard";
import QuestionLoading from "@/components/home/questionLoading";
import Filters from "@/components/sheared/Filters";
import NoResult from "@/components/sheared/NoResult";
import Pagination from "@/components/sheared/Pagination";
import LocalSearch from "@/components/sheared/search/LocalSearch";
import Await from "@/lib/await";

// constants import
import { QuestionFilters } from "@/constants/filters";

// types import
import { SearchParamsProps } from "@/types";

// server action import
import { getSavedQuestions } from "@/lib/actions/user.action";

export default async function Collection({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  if (!userId) return null;
  const promise = getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.pageSize ? +searchParams.pageSize : 20,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Saved Question</h1>
      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearch
          route='/collection'
          icon='/assets/icons/search.svg'
          placeholder='Search for Questions Here...'
          iconPosition='left'
        />
        <Filters
          filters={QuestionFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
          containerClasses='max-md:flex'
        />
      </div>

      <Suspense fallback={<QuestionLoading />}>
        <Await promise={promise}>
          {(result) => (
            <>
              {/* card component */}
              <div className='mt-10 flex w-full flex-col gap-6'>
                {result && result?.savedQuestion?.saved?.length > 0 ? (
                  result?.savedQuestion.saved.map((question: any) => (
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
                    title='There are no saved question to show'
                    description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡`}
                    link='/ask-question'
                    linkTitle='Ask a Question'
                  />
                )}
              </div>

              {/* pagination */}
              {result && result?.savedQuestion.saved.length > 0 && (
                <Pagination
                  pageNumber={searchParams?.page ? +searchParams.page : 1}
                  isNext={result?.isNext}
                />
              )}
            </>
          )}
        </Await>
      </Suspense>
    </>
  );
}
