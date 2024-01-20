"use server";

import Question from "@/database/question.modal";
import { connectToDB } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.modal";

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    const { userId, questionId } = params;;
    connectToDB();

    const isQuestion = await Question.findById(questionId);

    // update view count for the question
    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    if (userId && isQuestion) {
      // update user view history
      const isViewed = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (isViewed) {
        console.log("already viewed");
        return;
      }

      await Interaction.create({
        user: userId,
        question: questionId,
        action: "view",
      });
    }
  } catch (error) {
    console.log("error while view question", error);
    throw error;
  }
};
