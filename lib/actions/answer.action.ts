"use server";

import Answer from "@/database/answer.modal";
import { connectToDB } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.modal";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDB();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({ content, author, question });

    // add the answer to question's answer array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...

    revalidatePath(path);
  } catch (error) {
    console.log("Error while creating answer => ", error);
  }
}

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDB();
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });
    return { answers };
  } catch (error) {
    console.log("Error while fetching answer ", error);
  }
};

export const upvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDB();
    const { answerId, userId, hasupVoted, path } = params;
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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Question not found");
    }

    // increment the users reputation

    revalidatePath(path);
  } catch (error) {
    console.log("Error while upvote answer => ", error);
  }
};

export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDB();
    const { answerId, userId, hasdownVoted, path } = params;
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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("answer not found");
    }

    // increment the users reputation

    revalidatePath(path);
  } catch (error) {
    console.log("Error while upvote answer => ", error);
  }
};
