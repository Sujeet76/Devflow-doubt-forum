import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const QuestionLoading = () => {
  return (
    <div className='mt-10 flex w-full flex-col gap-6'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <Skeleton
          key={item}
          className='h-48 w-full rounded-xl'
        />
      ))}
    </div>
  );
};

export default QuestionLoading;
