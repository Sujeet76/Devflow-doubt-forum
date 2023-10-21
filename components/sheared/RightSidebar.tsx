import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const questions = [
  "Would it be appropriate to point out an error in another paper during a referee report?",
  "How can an airconditioning machine exist?",
  "Interrogated every time crossing UK Border as citizen",
  "Low digit addition generator",
  "What is an example of 3 numbers that do not make up a vector?",
];

const tags = [
  {
    _id: "1",
    name: "Javascript",
    totalQuestion: 20152,
  },
  {
    _id: "2",
    name: "Next.js",
    totalQuestion: 20152,
  },
  {
    _id: "3",
    name: "React.js",
    totalQuestion: 20152,
  },
  {
    _id: "4",
    name: "Node.js",
    totalQuestion: 14431,
  },
  {
    _id: "5",
    name: "Python",
    totalQuestion: 20152,
  },
  {
    _id: "6",
    name: "Microsoft Azure",
    totalQuestion: 20152,
  },
  {
    _id: "7",
    name: "PostgreSql",
    totalQuestion: 20152,
  },
  {
    _id: "8",
    name: "Machine Learning",
    totalQuestion: 9429,
  },
];

const RightSidebar = () => {
  return (
    <aside className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col  gap-6 overflow-y-auto border-r px-4 pb-6 pt-32 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]">
      <div>
        <h3 className="h3-bold text-dark200_light900 text-xl">Hot Network</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {questions.map((item, index) => (
            <Link
              href="#"
              key={index}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{item}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="right arrow"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900 text-xl">Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {tags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestion={tag.totalQuestion}
              showCount={true}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
