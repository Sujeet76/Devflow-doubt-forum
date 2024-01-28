"use client";

// form import
import { useRef, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { QuestionSchema } from "../../lib/validation";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter, usePathname } from "next/navigation";

// ui import
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useTheme } from "@/context/ThemeProvider";
import { toast } from "sonner";
import TagField from "./formComponent/TagField";

interface Props {
  mongoUserId: string;
  type?: "edit" | "submit";
  questionDetails?: string;
}

interface IQuestionDetails {
  _id: string;
  title: string;
  content: string;
  tags: { name: string; _id: string }[];
}

const QuestionForm = ({
  mongoUserId,
  type = "submit",
  questionDetails,
}: Props) => {
  const { mode } = useTheme();
  const route = useRouter();
  const pathname = usePathname();

  let parsedQuestionDetails: IQuestionDetails | undefined;
  let tagArr: string[] | undefined;

  // parse the questions
  if (questionDetails) {
    parsedQuestionDetails = JSON.parse(questionDetails);
    tagArr = parsedQuestionDetails?.tags.map((tag) => tag.name);
  }

  // tiny editor
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title ?? "",
      explanation: parsedQuestionDetails?.content ?? "",
      tags: tagArr || [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    let toastId;
    try {
      setIsSubmitting(true);
      if (type === "edit") {
        toastId = toast.loading("Editing your question...");
        await editQuestion({
          questionId: parsedQuestionDetails?._id ?? "",
          title: values.title,
          content: values.explanation,
          path: pathname,
        });
        toast.success("Your question has been edited.", { id: toastId });
      } else {
        toastId = toast.loading("Posting your question...");
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        toast.success("Your question has been posted.", { id: toastId });
      }

      // navigate to homepage
      route.push("/");
    } catch (e: any) {
      console.log("Error while creating Question(F) -> ", e);
      toast.error(
        e?.message ?? "Something went wrong while creating question",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-10'
        >
          {/* title */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col'>
                <FormLabel className='paragraph-semibold text-dark400_light800'>
                  Question Title <sup className='text-rose-600'>*</sup>
                </FormLabel>
                <FormControl className='mt-3.5'>
                  <Input
                    placeholder='Enter the Question'
                    {...field}
                    className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription className='body-regular mt-2.5 text-light-500'>
                  Be specific and imagine you&apos;re asking a question to
                  another person.
                </FormDescription>
                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />
          {/* explanation */}
          <FormField
            control={form.control}
            name='explanation'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col'>
                <FormLabel className='paragraph-semibold text-dark400_light800'>
                  Detailed explanation of your problem?{" "}
                  <sup className='text-primary-500'>*</sup>
                </FormLabel>
                <FormControl className='mt-3.5'>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_EDITOR_PUBLIC_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    initialValue={parsedQuestionDetails?.content ?? ""}
                    onBlur={field.onBlur}
                    disabled={isSubmitting}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter | " +
                        "alignright alignjustify | bullist numlist ",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className='body-regular mt-2.5 text-light-500'>
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters.
                </FormDescription>
                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />
          {/* tags */}
          <TagField
            form={form}
            name='tags'
            label='Tags'
            placeholder='Enter the tag'
            type={type}
            isSubmitting={isSubmitting}
            tagDescription='Add up to 5 tags to describe what your question is about. Start typing to see suggestions.'
          />
          <Button
            type='submit'
            className='primary-gradient w-full !text-light-900 sm:w-fit lg:w-fit'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>{type === "edit" ? "Editing..." : "Posting..."}</>
            ) : (
              <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuestionForm;
