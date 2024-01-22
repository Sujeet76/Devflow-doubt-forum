"use server";

import Question from "@/database/question.modal";
import { connectToDB } from "../mongoose";
import Tag from "@/database/tag.modal";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  DeleteQuestionParams,
  EditQuestionParams,
} from "./shared.types";
import User from "@/database/user.modal";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.modal";
import Interaction from "@/database/interaction.modal";
import { FilterQuery } from "mongoose";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDB();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
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

    const bulkOps = tags.map((tag) => ({
      updateOne: {
        filter: {
          name: {
            $regex: new RegExp(
              `^${tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
              "i"
            ),
          },
        },
        update: {
          $setOnInsert: {
            name: tag,
            createdAt: new Date(),
          },
          $push: { questions: question._id },
        },
        upsert: true,
      },
    }));

    await Tag.bulkWrite(bulkOps);

    const tagDocuments = await Tag.find({
      name: { $in: tags },
    });

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments.map((tag) => tag._id) } },
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

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    // delete the question
    // delete also related questions

    connectToDB();

    const { questionId, path } = params;
    const isQuestionExist = await Question.findById(questionId);
    if (!isQuestionExist) {
      throw new Error("Question not found");
    }

    // delete the tags
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    // delete the answer
    await Answer.deleteMany({ question: questionId });

    // delete the question
    await Question.deleteOne({ _id: isQuestionExist._id });

    // delete the interaction
    await Interaction.deleteMany({ question: questionId });

    revalidatePath(path);
  } catch (error) {
    console.log("Error while deleting question => ", error);
  }
};

export const editQuestion = async (params: EditQuestionParams) => {
  try {
    connectToDB();

    const { title, content, questionId, path } = params;

    const isQuestionExist = await Question.findById(questionId);
    if (!isQuestionExist) {
      throw new Error("Question not found");
    }

    isQuestionExist.title = title;
    isQuestionExist.content = content;

    await isQuestionExist.save();

    revalidatePath(path);
  } catch (error) {
    console.log(`Error while editing question => ${error}`);
  }
};

export const getTopQuestions = async () => {
  try {
    connectToDB();
    const questions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5)
      .select("_id title");
    if (!questions) throw new Error("Error while fetching top questions");

    return questions;
  } catch (error) {
    console.log("Error while fetching question(s) => ", error);
  }
};
