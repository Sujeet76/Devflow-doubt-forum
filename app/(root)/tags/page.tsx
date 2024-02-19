import Link from "next/link";
import { Suspense } from "react";
import { v4 as uuid } from "uuid";

// ui import
import Filters from "@/components/sheared/Filters";
import Pagination from "@/components/sheared/Pagination";
import LocalSearch from "@/components/sheared/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import Await from "@/lib/await";
import TagListLoading from "./tagListLoading";

// server action import
import { getAllTags } from "@/lib/actions/tag.action";

// types import
import { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | Dev Overflow",
  description:
    "Join our vibrant community at Dev Overflow! Connect with developers worldwide, share knowledge, collaborate on projects, and grow your coding skills. Whether you're a beginner or an expert, there's a place for you here.",
  keywords:
    "Dev Overflow, Developer Community, Programming Tags, Coding Topics, Software Development",
};

const page = async ({ searchParams }: SearchParamsProps) => {
  const promise = getAllTags({
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.pageSize ? +searchParams.pageSize : 20,
  });

  return (
    <>
      <div>
        <h1 className='h1-bold text-dark100_light900'>Tags</h1>
        <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
          <LocalSearch
            route='/tags'
            icon='/assets/icons/search.svg'
            placeholder='Search by tag name...'
            iconPosition='left'
          />
          <Filters
            filters={TagFilters}
            otherClasses='min-h-[56px] sm:min-w-[170px]'
          />
        </div>
      </div>
      <Suspense
        fallback={<TagListLoading />}
        key={uuid()}
      >
        <Await promise={promise}>
          {(result) => (
            <>
              <section className='mt-12 flex flex-wrap gap-4'>
                {result && result.tags.length > 0 ? (
                  result.tags.map((tag) => (
                    <Link
                      key={tag._id}
                      href={`/tags/${tag._id}`}
                      className='shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]'
                    >
                      <article className='background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border px-8 py-10'>
                        <div className='background-light800_dark400 w-fit rounded-sm px-5 py-1.5'>
                          <p className='paragraph-semibold text-dark300_light900 uppercase'>
                            {tag.name}
                          </p>
                        </div>
                        <p className='small-medium text-dark400_light500 mt-3.5'>
                          <span className='body-semibold primary-text-gradient mr-2.5'>
                            {tag.totalQuestions}+
                          </span>
                          Question(s)
                        </p>
                      </article>
                    </Link>
                  ))
                ) : (
                  <div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center'>
                    <p>No users yet</p>
                    <Link
                      href='/sign-up'
                      className='mt-2 font-bold text-accent-blue'
                    >
                      Join to be the first
                    </Link>
                  </div>
                )}
              </section>

              {/* pagination */}
              {result && result?.tags.length > 0 && (
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
};

export default page;
