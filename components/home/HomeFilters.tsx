"use client";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import { useState } from "react";

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState("");

  const handelClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className='mt-10 hidden flex-wrap gap-3 md:flex'>
      {HomePageFilters.map((tag) => (
        <Button
          key={tag.name}
          onClick={() => handelClick(tag.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === tag.value
              ? "bg-primary-100 text-primary-500 dark:bg-dark-400"
              : "background-light800_dark300 text-light-500"
          }`}
        >
          {tag.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
