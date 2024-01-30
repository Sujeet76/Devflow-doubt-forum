"use server";

import Answer from "@/database/answer.modal";
import { connectToDB } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.modal";
import Interaction from "@/database/interaction.modal";
import User from "@/database/user.modal";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDB();

    const { content, author, question, path } = params;
    // is owner of this question
    const isOwner = await Question.exists({
      _id: question,
      author,
    });

    if (isOwner) {
      throw new Error("You can't answer your own question");
    }

    const newAnswer = await Answer.create({ content, author, question });

    // add the answer to question's answer array
    const updatedQuestion = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: updatedQuestion.tags,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log("Error while creating answer => ", error);
    throw error;
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

    // is owner of the answer
    const isOwner = await Answer.exists({
      _id: answerId,
      author: userId,
    });

    if (isOwner) throw new Error("You can't upvote you own this answer");

    if (isOwner) {
      throw new Error("You can't upvote you own this question");
    }

    // if the user has already upvoted the question, remove the downvote
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else {
      // if the user has not already upvoted the question, add the upvote and also remove downvote if user has already downvoted the question
      // mongodb doest not throw error when $pull it doest not find the element
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

    // Increment or decrement user reputation by +1/-1 for receiving  upvote/downvote to the questions
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });

    // Increment or decrement author reputation by +10/-10 for receiving  upvote/downvote to the questions
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log("Error while upvote answer => ", error);
    return {
      error: error?.message ?? "something went wrong while up vote answer",
    };
  }
};

export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDB();
    const { answerId, userId, hasdownVoted, path } = params;
    let updateQuery = {};

    // is owner of the answer
    const isOwner = await Answer.exists({
      _id: answerId,
      author: userId,
    });

    if (isOwner) throw new Error("You can't down you own this answer");

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

    // Increment or decrement user reputation by +2/-2 for receiving  upvote/downvote to the questions
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    // Increment or decrement author reputation by +10/-10 for receiving  upvote/downvote to the questions
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log("Error while upvote answer => ", error);
    error.digest = undefined;
    return {
      error: error?.message ?? "something went wrong while down vote answer",
    };
  }
};

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    connectToDB();

    const { answerId, path, userId } = params;
    const isOwner = await Answer.exists({
      _id: answerId,
      author: userId,
    });

    if (!isOwner) throw new Error("You can't delete this answer");
    const answer = await Answer.findByIdAndDelete(answerId);

    if (!answer) throw Error("Answer not found");
    // update question
    await Question.updateMany(
      {
        _id: answer.question,
      },
      {
        $pull: {
          answers: answerId,
        },
      }
    );

    // updateInteraction
    await Interaction.deleteMany({
      answer: answerId,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(`Error while deleting answer => ${error}`);
    throw error;
  }
};
