import { Schema, models, model, Document } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  createAt: Date;
}

const QuestionSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Tag",
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
