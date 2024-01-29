"use server";

import mongoose, { Schema } from "mongoose";

export interface INote extends Document {
  title: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished: boolean;
  isArchived: boolean;
  owner: mongoose.Schema.Types.ObjectId;
  parentDocument?: mongoose.Schema.Types.ObjectId;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: false },
    coverImage: { type: String, required: false },
    icon: { type: String, required: false },
    isPublished: { type: Boolean, required: true, default: false },
    isArchived: { type: Boolean, required: true, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    parentDocument: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
