import User from "@/database/user.modal";
import { connectToDB } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag from "@/database/tag.modal";
import Question from "@/database/question.modal";
import { FilterQuery } from "mongoose";

export async function getTopInteractionTags(
  params: GetTopInteractedTagsParams
) {
  try {
    connectToDB();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // find interaction for the user and group by tag...
    // Interaction...

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
    ];
  } catch (error) {
    console.log("Error while => ", error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDB();

    const { page = 1, pageSize = 20, searchQuery, filter } = params;
    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.name = { $regex: new RegExp(searchQuery, "i") };
    }

    let sortOption = {};

    switch (filter) {
      case "popular":
        // Use aggregation to project the array length and sort based on it
        sortOption = { totalQuestions: -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "old":
        sortOption = { createdAt: 1 };
        break;
      default:
        break;
    }

    let tags = null;
    if (filter) {
      tags = await Tag.aggregate([
        { $match: query },
        { $addFields: { totalQuestions: { $size: "$questions" } } },
        { $sort: sortOption },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
        { $project: { name: 1, totalQuestions: 1 } },
      ]);
    } else {
      tags = await Tag.aggregate([
        { $match: query },
        { $addFields: { totalQuestions: { $size: "$questions" } } },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
        { $project: { name: 1, totalQuestions: 1 } },
      ]);
    }

    // find interaction for the user and group by tag...
    // Interaction...

    return { tags };
  } catch (error) {
    console.error("Error while fetching tags:", error);
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDB();

    const { tagId, page = 1, pageSize = 10, searchQuery, filter } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOption = {};
    switch (filter) {
      case "most_recent":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "most_voted":
        sortOption = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOption = { views: -1 };
        break;
      case "most_answered":
        sortOption = { answers: -1 };
        break;
      default:
        break;
    }

    const questions = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      select: "-content",
      match: query,
      options: {
        sort: sortOption,
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
      populate: [
        {
          path: "author",
          model: User,
          select: "_id clerkId fullName picture",
        },
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
      ],
    });

    if (!questions) {
      throw Error("No question found");
    }

    return { title: questions.name, questions: questions?.questions };
  } catch (error) {
    console.log("Error while => ", error);
  }
}

export async function getTopTags() {
  try {
    connectToDB();

    const tags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          _id: 1,
          totalQuestion: { $size: "$questions" },
        },
      },
      {
        $sort: { totalQuestion: -1 },
      },
      { $limit: 5 },
    ]);

    if (!tags) throw new Error("No tags found(error while finding tags");

    return tags;
  } catch (error) {
    console.log("Error while getting top tags ", error);
  }
}
