"use server";

import { JobFilterParams } from "./shared.types";

export const fetchCountry = async () => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();
    return data;
  } catch (e) {
    console.log("Error while fetching country list");
  }
};

export const fetchUserLocation = async () => {
  try {
    const res = await fetch("http://ip-api.com/json/?fields=country");
    const location = await res.json();
    return location.country;
  } catch (e) {
    console.log("Error while fetching user location");
  }
};

export const fetchJobs = async (filter: JobFilterParams) => {
  const { page, query } = filter;

  try {
    const headers = {
      "X-RapidAPI-Key": process.env?.NEXT_PUBLIC_RAPID_KEY ?? "",
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    };

    const res = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
      { headers }
    );

    const result = await res.json();
    return result.data;
  } catch (e: any) {
    console.log(e?.message ?? "Error while fetching jobs");
  }
};
