import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/sheared/Filters";
import NoResult from "@/components/sheared/NoResult";
import LocalSearch from "@/components/sheared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

export default async function Collection() {
  const { userId } = auth();
  if (!userId) return null;
  const result = await getSavedQuestions({
    clerkId: userId,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Saved Question</h1>
      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearch
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

      {/* card component */}
      <div className='mt-10 flex w-full flex-col gap-6'>
        {result && result?.saved?.length > 0 ? (
          result.saved.map((question: any) => (
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
    </>
  );
}
