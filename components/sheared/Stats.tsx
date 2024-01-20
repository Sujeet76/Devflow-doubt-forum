import { formatNumber } from "@/lib/utils";
import Image from "next/image";

interface StatsProps {
  totalQuestion: number;
  totalAnswer: number;
}

interface StatsCardProps {
  imgUrl: string;
  title: string;
  value: number;
}

const StatsCard = ({ imgUrl, title, value }: StatsCardProps) => {
  return (
    <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200'>
      <Image
        src={imgUrl}
        width={50}
        height={50}
        alt='icon'
        className='select-none'
      />
      <div>
        <p className='paragraph-semibold text-dark200_light900 text-center'>{value}</p>
        <p className='body-medium text-dark400_light700'>{title}</p>
      </div>
    </div>
  );
};

const Stats = ({ totalQuestion, totalAnswer }: StatsProps) => {
  return (
    <>
      <div className='mt-10'></div>
      <h4 className='h3-semibold text-dark200_light900'>Stats</h4>
      <div className='mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4'>
        <div className='light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200'>
          <div>
            <p className='paragraph-semibold text-dark200_light900 text-center'>
              {formatNumber(totalQuestion)}
            </p>
            <p className='body-medium text-dark400_light700'>Questions</p>
          </div>
          <div>
            <p className='paragraph-semibold text-dark200_light900 text-center'>
              {formatNumber(totalAnswer)}
            </p>
            <p className='body-medium text-dark400_light700'>Answers</p>
          </div>
        </div>
        <StatsCard
          imgUrl='/assets/icons/gold-medal.svg'
          value={0}
          title='Gold Badges'
        />
        <StatsCard
          imgUrl='/assets/icons/silver-medal.svg'
          value={0}
          title='Sliver Badges'
        />
        <StatsCard
          imgUrl='/assets/icons/bronze-medal.svg'
          value={0}
          title='Bronze Badges'
        />
      </div>
    </>
  );
};

export default Stats;
