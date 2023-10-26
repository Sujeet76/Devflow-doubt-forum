"use server";

import User from "@/database/user.modal";
import { connectToDB } from "../mongoose";

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
