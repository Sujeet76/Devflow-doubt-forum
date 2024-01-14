"use server";

import Answer from "@/database/answer.modal";
import { connectToDB } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
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
