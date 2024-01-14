import Filters from "@/components/sheared/Filters";
import LocalSearch from "@/components/sheared/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import Link from "next/link";

const page = async () => {
  const result = await getAllTags({});

  return (
    <>
      <div>
        <h1 className="h1-bold text-dark100_light900">Tags</h1>
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch
            icon="/assets/icons/search.svg"
            placeholder="Search by tag name..."
            iconPosition="left"
          />
          <Filters
            filters={TagFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {result && result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              key={tag._id}
              href={`/tags/${tag._id}`}
              className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border px-8 py-10">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>
                  Question(s)
                </p>
              </article>
            </Link>
          ))
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default page;
