import { Schema, models, model, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to ensure createdAt is set when creating a new document
TagSchema.pre<ITag>("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
    console.log("createdAt not set, setting it now");
  }
  next();
});

const Tag = models.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
