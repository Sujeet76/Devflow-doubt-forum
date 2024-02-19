import { Skeleton } from "@/components/ui/skeleton";

const CardLoading = () => {
  return (
    <div className='mt-12 flex flex-wrap gap-4'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <Skeleton
          key={item}
          className='h-60 w-full rounded-2xl sm:w-[260px]'
        />
      ))}
    </div>
  );
};
export default CardLoading;
