/* eslint-disable camelcase */
import Link from "next/link";
import Metric from "../sheared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";

interface QuestionProps {
  _id: string;
  answer_Id: string;
  title: string;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = ({
  _id,
  title,
  author,
  upvotes,
  createdAt,
  // eslint-disable-next-line camelcase
  answer_Id,
}: QuestionProps) => {
  return (
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <div>
          <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}#${answer_Id}`}>
            <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
              {title}
            </h3>
          </Link>
        </div>
      </div>

      {/* flex-between(not tailwind class) -> flex justify-between items-center (refer to globals.css) */}
      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Metric
          imgUrl={author.picture}
          alt='avatar'
          value={author.name}
          title={` • asked ${getTimeStamp(createdAt)}`}
          textStyle='body-medium text-dark400_light700'
          href={`/profile/${author._id}`}
          isAuthor
        />
        <Metric
          imgUrl='/assets/icons/like.svg'
          alt='upvotes'
          value={formatNumber(upvotes)}
          title='Votes'
          textStyle='small-medium text-dark400_light800'
        />
      </div>
    </div>
  );
};

export default AnswerCard;
