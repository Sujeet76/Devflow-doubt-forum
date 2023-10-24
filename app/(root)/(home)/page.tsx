import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filters from "@/components/sheared/Filters";
import NoResult from "@/components/sheared/NoResult";
import LocalSearch from "@/components/sheared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { QuestionFilters } from "@/constants/filters";
import Link from "next/link";

const dummyQuestionCards = [
  {
    _id: "1",
    title:
      "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this",
    tags: [
      { _id: "tag1", name: "react.js" },
      { _id: "tag2", name: "react.js" },
      { _id: "tag3", name: "invalid field" },
      { _id: "tag4", name: "salesforce" },
    ],
    author: {
      _id: "author1",
      name: "Alice Johnson",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 2000,
    views: 150,
    createAt: new Date("2023-10-23T09:30:00Z"),
  },
  {
    _id: "2",
    title:
      "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this",
    tags: [{ _id: "tag2", name: "Java" }],
    author: {
      _id: "author2",
      name: "Bob Smith",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 30,
    views: 200,
    createAt: new Date("2023-10-22T15:45:00Z"),
  },
  {
    _id: "3",
    title:
      "The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this?",
    tags: [
      { _id: "tag1", name: "HTML" },
      { _id: "tag2", name: "CSS" },
    ],
    author: {
      _id: "author3",
      name: "Charlie Brown",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 25,
    views: 180,
    createAt: new Date("2023-10-21T14:20:00Z"),
  },
  {
    _id: "4",
    title: "What is the difference between let and var in JavaScript?",
    tags: [{ _id: "tag3", name: "JavaScript" }],
    author: {
      _id: "author4",
      name: "David Wilson",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 35,
    views: 250,
    createAt: new Date("2023-10-20T11:10:00Z"),
  },
  {
    _id: "5",
    title: "How to create a class in C++?",
    tags: [{ _id: "tag4", name: "C++" }],
    author: {
      _id: "author5",
      name: "Eva Martinez",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 18,
    views: 140,
    createAt: new Date("2023-10-19T10:05:00Z"),
  },
  {
    _id: "6",
    title: "What are the basic HTML tags?",
    tags: [{ _id: "tag1", name: "HTML" }],
    author: {
      _id: "author6",
      name: "Frank Johnson",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 22,
    views: 160,
    createAt: new Date("2023-10-18T09:00:00Z"),
  },
  {
    _id: "7",
    title: "How to implement a linked list in C?",
    tags: [{ _id: "tag5", name: "C" }],
    author: {
      _id: "author7",
      name: "Grace Lee",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 27,
    views: 190,
    createAt: new Date("2023-10-17T08:30:00Z"),
  },
  {
    _id: "8",
    title: "What is state in React?",
    tags: [{ _id: "tag3", name: "React" }],
    author: {
      _id: "author8",
      name: "Henry Miller",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 32,
    views: 220,
    createAt: new Date("2023-10-16T07:45:00Z"),
  },
  {
    _id: "9",
    title: "How to read user input in C?",
    tags: [{ _id: "tag5", name: "C" }],
    author: {
      _id: "author9",
      name: "Ivy Turner",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 16,
    views: 130,
    createAt: new Date("2023-10-15T06:55:00Z"),
  },
  {
    _id: "10",
    title: "What are the different types of CSS selectors?",
    tags: [{ _id: "tag2", name: "CSS" }],
    author: {
      _id: "author10",
      name: "Jack Anderson",
      picture: "url_to_author_picture.jpg",
    },
    answers: [],
    upvotes: 24,
    views: 170,
    createAt: new Date("2023-10-14T05:40:00Z"),
  },
];

export default function Home() {
  return (
    <>
      <div>
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row-reverse">
          <Link href="/ask-question" className="self-end">
            <Button className="primary-gradient min-h-[46px] rounded-[10px] border-none px-4 py-3 !font-medium text-light-900">
              Ask a Question
            </Button>
          </Link>
          <h1 className="h1-bold text-dark100_light900">All Question</h1>
        </div>
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch
            icon="/assets/icons/search.svg"
            placeholder="Search for Questions Here..."
            iconPosition="left"
          />
          <Filters
            filters={QuestionFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </div>
        <HomeFilters />
      </div>

      {/* card component */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {dummyQuestionCards?.length > 0 ? (
          dummyQuestionCards.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              createAt={question.createAt}
              views={question.views}
              answers={question.answers}
            />
          ))
        ) : (
          <NoResult
            title="There are no question to show"
            description={`Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡`}
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
