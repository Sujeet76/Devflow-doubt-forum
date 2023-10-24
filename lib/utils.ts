import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  ); // Time difference in seconds

  if (timeDifference < 60) {
    return `${timeDifference} second${timeDifference !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    const seconds = timeDifference % 60;
    const decimalMinutes = minutes + seconds / 60;
    return `${decimalMinutes.toFixed(1)} minute${
      decimalMinutes !== 1 ? "s" : ""
    } ago`;
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 604800) {
    const days = Math.floor(timeDifference / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 2592000) {
    // Approximately 30 days
    const weeks = Math.floor(timeDifference / 604800);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 31536000) {
    // Approximately 365 days
    const months = Math.floor(timeDifference / 2592000);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(timeDifference / 31536000);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
