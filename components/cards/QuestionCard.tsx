import Link from "next/link";
import RenderTag from "../sheared/RenderTag";
import Metric from "../sheared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  answers: Array<Object>;
  upvotes: number;
  views: number;
  createAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  answers,
  upvotes,
  views,
  createAt,
}: QuestionProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      {/* if signed in add edit delete action */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      {/* flex-between(not tailwind class) -> flex justify-between items-center (refer to globals.css) */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          alt="avatar"
          value={author.name}
          title={` - asked ${getTimeStamp(createAt)}`}
          textStyle="body-medium text-dark400_light700"
          href={`/profile/${author._id}`}
          isAuthor
        />
        <div className="flex gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upvotes"
            value={formatNumber(upvotes)}
            title="Votes"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Answer"
            value={formatNumber(answers.length)}
            title="Answers"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatNumber(views)}
            title="views"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
