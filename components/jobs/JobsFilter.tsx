"use client";
import { Country } from "@/types";
import LocalSearch from "../sheared/search/LocalSearch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { formUrlQuery } from "@/lib/utils";

interface JobsFiltersProps {
  countriesList: Country[];
  userLocation: string;
}

const JobsFilters = ({ countriesList, userLocation }: JobsFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "location",
      value,
    });

    router.push(newUrl);
  };

  return (
    <div className='relative mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center'>
      <LocalSearch
        route={pathname}
        iconPosition='left'
        icon='/assets/icons/job-search.svg'
        placeholder='Search by title, company or keyword'
        otherClasses='flex-1 max-sm:w-full'
      />

      <Select
        onValueChange={(value) => handleUpdateParams(value)}
        defaultValue={userLocation}
      >
        <SelectTrigger className='body-regular light-border background-light800_dark300 text-dark500_light700 line-clamp-1 flex min-h-[56px] items-center gap-3 border p-4 sm:max-w-[210px]'>
          <Image
            src='/assets/icons/carbon-location.svg'
            alt='location'
            width={18}
            height={18}
          />
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder='Select Location' />
          </div>
        </SelectTrigger>

        <SelectContent className='body-semibold text-dark500_light700 small-regular max-h-[350px] max-w-[210px] border-none bg-light-900 dark:bg-dark-300'>
          <SelectGroup>
            {countriesList ? (
              countriesList
                .sort((a, b) =>
                  ("" + a.name.common).localeCompare(b.name.common)
                )
                .map((country: Country) => (
                  <SelectItem
                    key={country.name.common}
                    value={country.name.common}
                    className='cursor-pointer  focus:bg-light-800 dark:focus:bg-dark-400'
                  >
                    {country.name.common}
                  </SelectItem>
                ))
            ) : (
              <SelectItem value='No results found'>No results found</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobsFilters;
