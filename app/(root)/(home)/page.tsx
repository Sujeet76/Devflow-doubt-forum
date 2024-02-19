import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { v4 as uuid } from "uuid";

// ui import
import HomeFilters from "@/components/home/HomeFilters";
import QuestionList from "@/components/home/QuestionList";
import QuestionLoading from "@/components/home/questionLoading";
import Filters from "@/components/sheared/Filters";
import Pagination from "@/components/sheared/Pagination";
import LocalSearch from "@/components/sheared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import Await from "@/lib/await";

// constants import
import { HomePageFilters } from "@/constants/filters";

import type { Metadata } from "next";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";

export const metadata: Metadata = {
  title: "Home | Dev Overflow",
  description: "Dev Overflow is a community of developers. Join us",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  let result: Promise<any>;
  if (searchParams?.filter === "recommended") {
    if (userId) {
      result = getRecommendedQuestions({
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
    result = getQuestions({
      searchQuery: searchParams?.q,
      filter: searchParams?.filter,
      page: searchParams.page ? +searchParams.page : 1,
      pageSize: searchParams.pageSize ? +searchParams.pageSize : 20,
    });
  }

  return (
    <section>
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
            route='/'
            icon='/assets/icons/search.svg'
            placeholder='Search for Questions Here...'
            iconPosition='left'
          />
          <Filters
            filters={HomePageFilters}
            otherClasses='min-h-[56px] sm:min-w-[170px]'
            containerClasses='hidden max-md:flex'
          />
        </div>
        <HomeFilters />
      </div>

      {/* card component */}
      <Suspense
        fallback={<QuestionLoading />}
        key={uuid()}
      >
        <Await promise={result}>
          {({ questions, isNext }) => (
            <>
              <QuestionList questions={questions} />
              {/* pagination */}
              {questions && questions.length > 0 && (
                <Pagination
                  pageNumber={searchParams?.page ? +searchParams.page : 1}
                  isNext={isNext}
                />
              )}
            </>
          )}
        </Await>
      </Suspense>
    </section>
  );
}
