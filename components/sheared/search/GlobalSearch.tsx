"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/utils";
import GlobalSearchResult from "./GlobalSearchResult";

const GlobalSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const globalSearchResult = useRef(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isOpen, setIsOpen] = useState(false);

  // const query = searchParams.get("q");

  // click outside the global search container to close
  useEffect(() => {
    const handelClickOutside = (event: any) => {
      if (
        globalSearchResult.current &&
        // @ts-ignore
        !globalSearchResult.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("click", handelClickOutside);

    return () => document.removeEventListener("click", handelClickOutside);
  }, [pathname]);

  // modifies the url
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeyFromQuery({
          params: searchParams.toString(),
          keyToRemove: ["global", "type"],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, searchParams]);

  return (
    <div
      className='relative w-full max-w-[600px] max-lg:hidden'
      ref={globalSearchResult}
    >
      <div className='background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4'>
        <Image
          src='/assets/icons/search.svg'
          alt='search'
          width={24}
          height={24}
          className='cursor-pointer'
        />
        <Input
          type='text'
          placeholder='Search anything globally...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className='paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none'
        />
      </div>
      {isOpen && (
        <GlobalSearchResult
          setIsOpen={setIsOpen}
          setSearch={setSearch}
        />
      )}
    </div>
  );
};

export default GlobalSearch;
