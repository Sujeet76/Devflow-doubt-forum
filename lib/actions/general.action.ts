"use server";

import { connectToDB } from "../mongoose";
import { searchParams } from "./shared.types";
import Question from "@/database/question.modal";
import Tag from "@/database/tag.modal";
import Answer from "@/database/answer.modal";
import User from "@/database/user.modal";

const SearchableTypes = ["question", "answer", "user", "tag"];

export const globalSearch = async (params: searchParams) => {
  try {
    connectToDB();

    const { query, type } = params;

    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // forEach does not work with async
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing "${query}"`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? `${item.question}#${item._id}`
                  : item._id,
          }))
        );
      }
    } else {
      // search in the specific model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) throw new Error("Invalid search type");

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);
      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? `${item.question}#${item._id}`
              : item._id,
      }));
    }

    return JSON.stringify(results);
  } catch (error: any) {
    console.log(`Error fetching global result, ${error}`);
    throw new Error(error?.message ?? "Error While fetching global result");
  }
};
