"use server";

import Question from "@/database/question.modal";
import { connectToDB } from "../mongoose";
import Tag from "@/database/tag.modal";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.modal";
import { revalidatePath } from "next/cache";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDB();

    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .sort({ createdAt: -1 });
    return { questions };
  } catch (error) {
    console.log("Error while fetching question(s) => ", error);
  }
};

export const createQuestion = async (params: CreateQuestionParams) => {
  try {
    connectToDB();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocument = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocument.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocument } },
    });

    // create an interaction record for the user's ask_question action
    // Increment author's reputation by +5 for creating a question

    // revalidatePath => to eliminate the refresh the page
    revalidatePath(path);
  } catch (error) {
    console.log("Error while creating question => ", error);
  }
};

export const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    connectToDB();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId picture name",
      })
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      });
    return question;
  } catch (error) {
    console.log("Error while getting question by id => ", error);
  }
};

export const upvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    connectToDB();
    const { questionId, userId, hasupVoted, path } = params;
    let updateQuery = {};

    // if the user has already upvoted the question, remove the downvote
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else {
      // if the user has not already upvoted the question, add the upvote and also remove downvote if user has already downvoted the question
      // mongodb doest not throe error when $pull it doest not find the element
      updateQuery = {
        $addToSet: {
          upvotes: userId,
        },
        $pull: { downvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment the users reputation

    revalidatePath(path);
  } catch (error) {
    console.log("Error while upvote => ", error);
  }
};

export const downvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    connectToDB();
    const { questionId, userId, hasdownVoted, path } = params;
    let updateQuery = {};

    // if the user has already downvoted the question, remove the downvote
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else {
      // if the user has not already downvoted the question, add the downvote and also remove upvote if user has upvoted the question
      // mongodb doest not throe error when $pull it doest not find the element
      updateQuery = {
        $addToSet: {
          downvotes: userId,
        },
        $pull: { upvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment the users reputation

    revalidatePath(path);
  } catch (error) {
    console.log("Error while upvote => ", error);
  }
};
