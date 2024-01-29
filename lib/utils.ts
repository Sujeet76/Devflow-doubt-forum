import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const getTimeStamp = (createdAt: Date): string => {
//   const now = new Date();
//   const timeDifference = Math.floor(
//     (now.getTime() - createdAt.getTime()) / 1000
//   ); // Time difference in seconds

//   if (timeDifference < 60) {
//     return `${timeDifference} second${timeDifference !== 1 ? "s" : ""} ago`;
//   } else if (timeDifference < 3600) {
//     const minutes = Math.floor(timeDifference / 60);
//     const seconds = timeDifference % 60;
//     const decimalMinutes = minutes + seconds / 60;
//     return `${decimalMinutes.toFixed(1)} minute${
//       decimalMinutes !== 1 ? "s" : ""
//     } ago`;
//   } else if (timeDifference < 86400) {
//     const hours = Math.floor(timeDifference / 3600);
//     return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
//   } else if (timeDifference < 604800) {
//     const days = Math.floor(timeDifference / 86400);
//     return `${days} day${days !== 1 ? "s" : ""} ago`;
//   } else if (timeDifference < 2592000) {
//     // Approximately 30 days
//     const weeks = Math.floor(timeDifference / 604800);
//     return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
//   } else if (timeDifference < 31536000) {
//     // Approximately 365 days
//     const months = Math.floor(timeDifference / 2592000);
//     return `${months} month${months !== 1 ? "s" : ""} ago`;
//   } else {
//     const years = Math.floor(timeDifference / 31536000);
//     return `${years} year${years !== 1 ? "s" : ""} ago`;
//   }
// };

const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

interface Division {
  amount: number;
  name: string;
}

const DIVISIONS: Division[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export const getTimeStamp = (date: Date): string => {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(
        Math.round(duration),
        division.name as Intl.RelativeTimeFormatUnit
      );
    }
    duration /= division.amount;
  }

  throw new Error("Invalid date");
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export function getJoinedDate(date: Date): string {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveQueryParams {
  params: string;
  keyToRemove: string[];
}

export const removeKeyFromQuery = ({
  params,
  keyToRemove,
}: RemoveQueryParams) => {
  const currentUrl = qs.parse(params);
  keyToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}
/**
 * Assigns badges based on specific criteria.
 * The function takes a `BadgeParam` parameter object that defines criteria
 * for each badge type. Badges are assigned based on the specified count
 * in the criteria. Badge levels (GOLD, SILVER, BRONZE) are defined by
 * the constant BADGE_CRITERIA. For each badge type and level, if the specified
 * count exceeds or reaches the defined threshold, the corresponding count
 * for that badge level is incremented.
 *
 * @param params - Parameter object of type `BadgeParam` containing criteria for badge assignment.
 * @returns A `BadgeCounts` object representing the number of badges assigned for each level.
 */
export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};

/**
 * Processes a job title by removing undefined, null, and unwanted words.
 * If the title is undefined or null, returns 'No Job Title'.
 * If no valid words are left after processing, returns 'No Job Title'.
 * @param title - The job title to be processed.
 * @returns The processed job title.
 */
export function processJobTitle(title: string | undefined | null): string {
  // Check if title is undefined or null
  if (title === undefined || title === null) {
    return "No Job Title";
  }

  // Split the title into words
  const words = title.split(" ");

  // Filter out undefined or null and other unwanted words
  const validWords = words.filter((word) => {
    return (
      word !== undefined &&
      word !== null &&
      word.toLowerCase() !== "undefined" &&
      word.toLowerCase() !== "null"
    );
  });

  // If no valid words are left, return the general title
  if (validWords.length === 0) {
    return "No Job Title";
  }

  // Join the valid words to create the processed title
  const processedTitle = validWords.join(" ");

  return processedTitle;
}
