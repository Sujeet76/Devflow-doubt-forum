"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import GlobalFilters from "./GlobalFilters";
import { Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { globalSearch } from "@/lib/actions/general.action";
import Link from "next/link";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
}

const GlobalSearchResult = ({ setIsOpen, setSearch }: Props) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);

      try {
        // search function
        const res = await globalSearch({
          query: global,
          type,
        });

        setResult(JSON.parse(res));
      } catch (error) {
        console.log("error in global search", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    if (global) fetchResult();
  }, [global, type]);

  console.log(result);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
      default:
        return "/";
    }
  };

  return (
    <div className='absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400'>
      {/* Filters */}
      <GlobalFilters />

      {/* Divider */}
      <Separator className='my-5 h-[1px] w-full bg-light-700/50 dark:bg-dark-500/50' />

      {/* Top match */}
      <div className='space-y-5'>
        <p className='text-dark400_light900 paragraph-semibold px-5'>
          Top Match
        </p>

        {isLoading ? (
          <div className='flex-center flex flex-col px-5'>
            <Loader className='my-2 size-10 animate-spin text-primary-500' />
            <p className='text-dark200_light800 body-regular'>
              Browsing the entire database
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  key={item.type + item.id + index}
                  href={renderLink(item.type, item.id)}
                  className='flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 hover:dark:bg-dark-500/50'
                >
                  <Image
                    src='/assets/icons/tag.svg'
                    alt='tags'
                    width={18}
                    height={18}
                    className='invert-colors mt-1 object-contain'
                  />
                  <div className='flex flex-col'>
                    <p className='body-medium text-dark200_light800 line-clamp-1'>
                      {item.title}
                    </p>
                    <p className='text-light400_light500 small-medium mt-1 font-bold capitalize'>
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className='flex-center flex flex-col px-5'>
                <p className='text-dark200_light800 body-regular px-5 py-2.5'>
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchResult;
