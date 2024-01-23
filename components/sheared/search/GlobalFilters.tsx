"use client";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const GlobalFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParams = searchParams.get("type");
  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (type: string) => {
    if (type === active) {
      setActive("");
      const newUrl = removeKeyFromQuery({
        params: searchParams.toString(),
        keyToRemove: ["type"],
      });

      router.push(newUrl);
    } else {
      setActive(type);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: type,
      });

      router.push(newUrl);
    }
  };

  return (
    <div className='flex items-center gap-5 px-5'>
      <p className='text-dark400_light900 body-medium'>Type:</p>
      <div className='flex gap-3'>
        {GlobalSearchFilters.map((item) => (
          <button
            type='button'
            key={item.value}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize text-dark-400 dark:text-light-800 dark:hover:text-primary-500
        ${
          active === item.value
            ? "bg-primary-500 text-light-900"
            : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
        }
        `}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
