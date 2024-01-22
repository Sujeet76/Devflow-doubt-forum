"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

interface PaginationProps {
  pageNumber: number;
  isNext: boolean | undefined;
}

const Pagination = ({ pageNumber, isNext }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? pageNumber + 1 : pageNumber - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };
  return (
    <div className='mt-10 flex w-full items-center justify-center gap-2'>
      {/* prev */}
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
        className='light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border '
      >
        <p className='body-medium text-dark200_light800'>Prev</p>
      </Button>
      {/* current page */}
      <div className='flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2'>
        <p className='body-semibold text-light-900'>{pageNumber}</p>
      </div>
      {/* next */}
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
        className='light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border '
      >
        <p className='body-medium text-dark200_light800'>Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
