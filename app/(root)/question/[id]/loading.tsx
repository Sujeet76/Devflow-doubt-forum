import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className='flex-start w-full flex-col gap-4'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <div className='flex items-center justify-start gap-2'>
            <Skeleton className='size-[22px] rounded-full' />
            <Skeleton className='h-[22px] w-24 rounded-sm' />
          </div>

          <div className='flex justify-end gap-2'>
            <Skeleton className='size-10 rounded' />
            <Skeleton className='size-10 rounded' />
            <Skeleton className='size-10 rounded' />
          </div>
        </div>
        <Skeleton className='h-12 w-full rounded' />
      </div>

      <div className='mb-8 mt-5  flex flex-wrap gap-4 '>
        <Skeleton className='h-8 w-10' />
        <Skeleton className='h-8 w-10' />
        <Skeleton className='h-8 w-10' />
      </div>

      <Skeleton className='h-48 w-full' />

      <div className='mt-8 flex flex-wrap gap-2'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            className='h-6 w-12'
            key={i}
          />
        ))}
      </div>
      <div className='mt-6 flex flex-wrap gap-2'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton
            className='h-24 w-full'
            key={i}
          />
        ))}
      </div>
    </>
  );
};

export default Loading;
