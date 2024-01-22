import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/sheared/Filters";
import NoResult from "@/components/sheared/NoResult";
import Pagination from "@/components/sheared/Pagination";
import LocalSearch from "@/components/sheared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";

const Tag = async (prop: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: prop.params.id,
    searchQuery: prop.searchParams?.q,
    filter: prop.searchParams?.filter,
    page: prop.searchParams.page ? +prop.searchParams.page : 1,
    pageSize: prop.searchParams.pageSize ? +prop.searchParams.pageSize : 20,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900 uppercase'>
        {result?.title ?? "Tag"}
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
          pageNumber={prop.searchParams?.page ? +prop.searchParams.page : 1}
          isNext={result?.isNext}
        />
      )}
    </>
  );
};

export default Tag;
