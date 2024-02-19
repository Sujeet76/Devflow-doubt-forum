import { Suspense } from "react";
import { v4 as uuid } from "uuid";

// ui import
import Await from "@/lib/await";
import QuestionCard from "@/components/cards/QuestionCard";
import QuestionLoading from "@/components/home/questionLoading";
import Filters from "@/components/sheared/Filters";
import NoResult from "@/components/sheared/NoResult";
import Pagination from "@/components/sheared/Pagination";
import LocalSearch from "@/components/sheared/search/LocalSearch";

// server actions import
import { getQuestionsByTagId, getTagById } from "@/lib/actions/tag.action";

// constants import
import { QuestionFilters } from "@/constants/filters";

// type import
import { URLProps } from "@/types";

const Tag = async (prop: URLProps) => {
  const tagDetail = await getTagById(prop.params.id);
  const promise = getQuestionsByTagId({
    tagId: prop.params.id,
    searchQuery: prop.searchParams?.q,
    filter: prop.searchParams?.filter,
    page: prop.searchParams.page ? +prop.searchParams.page : 1,
    pageSize: prop.searchParams.pageSize ? +prop.searchParams.pageSize : 20,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900 uppercase'>
        {tagDetail?.name ?? "Tag"}
      </h1>
      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearch
          route={`/tags/${prop.params.id}`}
          icon='/assets/icons/search.svg'
          placeholder='Search for tag Questions Here...'
          iconPosition='left'
        />
        <Filters
          filters={QuestionFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
          containerClasses='max-md:flex'
        />
      </div>

      <Suspense
        fallback={<QuestionLoading />}
        key={uuid()}
      >
        <Await promise={promise}>
          {(result) => (
            <>
              {/* card component */}
              <div className='mt-10 flex w-full flex-col gap-6'>
                {result && result?.questions.length > 0 ? (
                  result?.questions.map((question: any) => (
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
                    title='There are no question related to this tag'
                    description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡`}
                    link='/ask-question'
                    linkTitle='Ask a Question'
                  />
                )}
              </div>
              {/* pagination */}
              {result && result?.questions.length > 0 && (
                <Pagination
                  pageNumber={
                    prop.searchParams?.page ? +prop.searchParams.page : 1
                  }
                  isNext={result?.isNext}
                />
              )}
            </>
          )}
        </Await>
      </Suspense>
    </>
  );
};

export default Tag;
