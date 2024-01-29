"use server";

import Note from "@/database/note.model";
import { CreateNoteParams, GetANoteParams } from "./shared.types";
import User from "@/database/user.modal";
import { connectToDB } from "../mongoose";

export const createNote = async ({
  title,
  owner,
  parentDocument,
}: CreateNoteParams) => {
  try {
    await connectToDB();
    if (!owner) throw new Error("Owner is required");

    const user = await User.findOne({ clerkId: owner });

    if (!title?.trim()) throw new Error("Title is required");

    if (parentDocument) {
      // Check if parent document exists
      // If it does not exist then throw error
      const parentDoc = await Note.findById(parentDocument);

      if (!parentDoc) throw new Error("Parent document does not exist");

      // Create note with parent document
      const note = await Note.create({
        title,
        owner: user?._id,
        parentDocument,
      });

      return JSON.stringify(note);
    } else {
      // Create note without parent document
      const note = await Note.create({
        title,
        owner: user?._id,
      });

      return JSON.stringify(note);
    }
  } catch (error: any) {
    console.log(`Error while creating notes : ${error}`);
    throw new Error(error?.message ?? "Error while creating notes");
  }
};

export const getANotes = async ({ noteId }: GetANoteParams) => {
  try {
    if (!noteId) throw new Error("NoteId is required");

    const note = await Note.findById(noteId).populate("parentDocument").exec();

    if (!note) throw new Error("Note does not exist");

    return note;
  } catch (error: any) {
    console.log(`Error while getting note : ${error}`);
    throw new Error(error?.message ?? "Error while getting note");
  }
};
