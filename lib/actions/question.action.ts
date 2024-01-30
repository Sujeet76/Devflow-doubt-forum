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
  RecommendedParams,
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
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
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

    const totalDocuments = await Question.countDocuments(query);
    const isNext = totalDocuments > (page - 1) * pageSize + questions.length;

    return { questions, isNext };
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
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments.map((tag) => tag._id),
    });

    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

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

    // is owner of the question
    const isOwner = await Question.exists({
      _id: questionId,
      author: userId,
    });

    if (isOwner) {
      throw new Error("You can't upvote you own this question");
    }

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

    // Increment or decrement user reputation by +1/-1 for receiving  upvote/downvote to the questions
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Increment or decrement author reputation by +10/-10 for receiving  upvote/downvote to the questions
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log("Error while upvote => ", error);
    return {
      error: error?.message ?? "something went wrong while up vote question",
    };
  }
};

export const downvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    connectToDB();
    const { questionId, userId, hasdownVoted, path } = params;
    let updateQuery = {};

    // is owner of the question
    const isOwner = await Question.exists({
      _id: questionId,
      author: userId,
    });

    if (isOwner) {
      throw new Error("You can't downvote you own this question");
    }

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

    // Increment or decrement user reputation by +1/-1 for receiving  upvote/downvote to the questions
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -1 : 1 },
    });

    // Increment or decrement author reputation by +10/-10 for receiving  upvote/downvote to the questions
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log("Error while upvote => ", error);
    return {
      error: error?.message ?? "something went wrong while down vote question",
    };
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    // delete the question
    // delete also related questions

    connectToDB();

    const { questionId, path, userId } = params;
    const isQuestionExist = await Question.findOne({
      $and: [{ _id: questionId }, { owner: userId }],
    });
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
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .limit(5)
      .select("_id title");
    if (!questions) throw new Error("Error while fetching top questions");

    return questions;
  } catch (error) {
    console.log("Error while fetching question(s) => ", error);
  }
};

export const getRecommendedQuestions = async (params: RecommendedParams) => {
  try {
    await connectToDB();
    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  }
};
