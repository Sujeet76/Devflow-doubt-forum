"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  route: string;
  icon: string;
  placeholder: string;
  iconPosition: string;
  otherClasses?: string;
}

const LocalSearch = ({
  route,
  icon,
  placeholder,
  iconPosition,
  otherClasses,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFromQuery({
            params: searchParams.toString(),
            keyToRemove: ["q"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
  }, [search, router, setSearch, pathname, searchParams, route]);

  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] w-full grow items-center gap-1 rounded-xl px-4 ${
        iconPosition === "right" && "flex-row-reverse"
      } ${otherClasses}`}
    >
      <Image
        src={icon}
        width={24}
        height={24}
        alt='search icon'
        className='cursor-pointer'
      />
      <Input
        type='text'
        className='paragraph-regular background-light800_darkgradient no-focus placeholder text-dark400_light700 border-none shadow-none outline-none'
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
    </div>
  );
};

export default LocalSearch;
