import * as z from "zod";

export const QuestionSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "title must be at least 5 characters.",
    })
    .max(130, {
      message: "title must be at most 130 characters.",
    }),
  explanation: z.string().min(100),
  tags: z
    .array(z.string().min(2).max(20))
    .min(2, { message: "minimum 2 tags are required" })
    .max(10, { message: "maximum 10 tags are allowed" }),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileSchema = z.object({
  name: z.string().min(5).max(30),
  username: z.string().min(5).max(20),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().url().optional(),
  location: z.string().min(5).max(50),
});
