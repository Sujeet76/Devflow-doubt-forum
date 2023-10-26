"use server";

import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.NEXT_PUBLIC_DATABASE_URL)
    return console.log("Mongodb url is missing");

  if (isConnected) return console.log("Already connected to mongodb!!");

  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL, {
      dbName: "devFlow",
    });

    isConnected = true;

    console.log("Connected to Mongodb");
  } catch (error) {
    console.log("Error while connecting to mongodb -> ", error);
  }
};
