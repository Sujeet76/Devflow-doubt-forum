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

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const tags = await Tag.find({}).sort({ createdAt: -1 });

    // find interaction for the user and group by tag...
    // Interaction...

    return { tags };
  } catch (error) {
    console.log("Error while => ", error);
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDB();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { $regex: new RegExp(searchQuery, "i") }
      : {};

    const questions = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      select: "-content",
      match: query,
      options: {
        sort: { createdAt: -1 },
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
