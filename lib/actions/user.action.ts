"use server";

import User from "@/database/user.modal";
import { connectToDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.modal";
import Tag from "@/database/tag.modal";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.modal";

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDB();

    const { userId } = params;

    const user = await User.findOne({
      clerkId: userId,
    });
    return user;
  } catch (error) {
    console.log("Error while getting user");
    throw new Error("Error while getting user");
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDB();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log("Error while create user");
    throw new Error("Error while create user");
  }
}

export const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    connectToDB();
    const { questionId, userId, path } = params;
    const isSaved = await User.findById(userId);

    if (isSaved.saved.includes(questionId)) {
      await User.findByIdAndUpdate(userId, {
        $pull: { saved: questionId },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { saved: questionId },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.log("Error while saving Question to collection", error);
  }
};

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDB();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log("Error while updating user");
    throw new Error("Error while updating user");
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDB();

    const { clerkId } = params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user from database
    // and question , answer, comments, etc.

    // get user question ids
    // eslint-disable-next-line no-unused-vars
    const userQuestionIds = await Question.find({
      author: user._id,
    }).distinct("_id");

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO : delete user answers, comments, etc.
    const deletedUser = User.findByIdAndDelete(user._id);

    // TODO : delete answer

    return deletedUser;
  } catch (error) {
    console.log("Error while updating user");
    throw new Error("Error while updating user");
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDB();
    const { page = 1, pageSize = 20, searchQuery, filter } = params;

    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { users };
  } catch (error) {
    console.log("Error while getting all users => ", error);
    throw new Error("Error while getting all users");
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDB();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

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
    }

    const savedQuestion = await User.findOne({ clerkId })
      .populate({
        path: "saved",
        select: "-content",
        match: query,
        options: {
          sort: sortOption,
          skip: (page - 1) * pageSize,
        },
        populate: [
          { path: "author", model: User, select: "_id clerkId name picture" },
          { path: "tags", model: Tag, select: "_id name" },
        ],
      })
      .select("_id clerkId");

    if (!savedQuestion) {
      throw new Error("No saved question found");
    }

    return savedQuestion;
  } catch (error) {
    console.log("Error while => ", error);
  }
}
export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDB();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    const totalQuestion = await Question.countDocuments({ author: user._id });
    const totalAnswer = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestion,
      totalAnswer,
    };
  } catch (error) {
    console.log("Error while => ", error);
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDB();
    const { userId, page = 1, pageSize = 5 } = params;
    const answers = await Answer.find({
      author: userId,
    })
      .sort({ upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: "author",
        select: "_id clerkId picture name",
      })
      .populate({ path: "question", select: "_id title" })
      .select("-content");
    return { answers };
  } catch (error) {
    console.log("Error while => ", error);
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDB();
    const { userId, page = 1, pageSize = 5 } = params;
    const questions = await Question.find({
      author: userId,
    })
      .sort({ views: -1, upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: "author",
        select: "_id clerkId picture name",
      })
      .populate({ path: "tags", select: "_id name" });
    return { questions };
  } catch (error) {
    console.log("Error while => ", error);
  }
}

// export async function getAllUsers(params: GetAllUsersParams) {
//   try {
//     connectToDB();
//   } catch (error) {
//     console.log("Error while => ", error);
//   }
// }
