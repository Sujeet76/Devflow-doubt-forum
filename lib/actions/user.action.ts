"use server";

import User from "@/database/user.modal";
import { connectToDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.modal";
import Tag from "@/database/tag.modal";
import { FilterQuery } from "mongoose";

export async function getUserById(params: any) {
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

    console.log(userData);

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
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({}).sort({ createdAt: -1 });

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

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const savedQuestion = await User.findOne({ clerkId })
      .populate({
        path: "saved",
        select: "-content",
        match: query,
        options: {
          sort: { createdAt: -1 },
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
    throw new Error("Error while getting saved questions");
  }
}
// export async function getAllUsers(params: GetAllUsersParams) {
//   try {
//     connectToDB();
//   } catch (error) {
//     console.log("Error while => ", error);
//   }
// }
