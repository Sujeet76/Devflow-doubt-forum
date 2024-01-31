"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { AnswerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface Props {
  questionAuthorId: string;
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({
  question,
  questionId,
  authorId,
  questionAuthorId,
}: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAiAnswer, setIsGeneratingAiAnswer] = useState(false);
  const editorRef = useRef(null);
  const { mode } = useTheme();
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    if (!authorId) {
      return toast.error("Please login", {
        description: "To submit answer you have to fist login",
      });
    }
    setIsSubmitting(true);
    let toastId;
    try {
      toastId = toast.loading("Submitting answer...");
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });
      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent("");
      }
      setIsSubmitting(false);
      toast.success("Answer added successfully", { id: toastId });
    } catch (error: any) {
      setIsSubmitting(false);
      console.log("Error in answer => .", error);
      toast.error(
        error?.message ?? "something went wrong while creating answer",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // generate ai answer
  const generateAiAnswer = () => {
    if (!authorId) {
      return toast.error("Can not generate", {
        description: "You need to login first",
      });
    }
    setIsGeneratingAiAnswer(true);

    if (authorId === questionAuthorId) {
      toast.error("Can not generate", {
        description: "You cannot generate Ai answer on your own question",
      });
    }

    // fetch ai answer
    // filter question remove html tags
    const filteredQuestion = question.replace(/<[^>]*>/g, "");
    const promise = fetch(`${process.env.NEXT_PUBLIC_URL}/api/chatgpt`, {
      method: "POST",
      body: JSON.stringify({ question: filteredQuestion }),
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedAnswer = data.reply.replace(/\n/g, "<br />");
        if (editorRef.current) {
          const editor = editorRef.current as any;
          editor.setContent(formattedAnswer);
        }
      });

    toast.promise(promise, {
      loading: "Ai is generating answer...",
      success: "Ai generated answer successfully",
      error: (e) =>
        e?.message ?? "something went wrong while generating answer",
      finally: () => {
        setIsGeneratingAiAnswer(false);
      },
    });
  };

  return (
    <div>
      <div className='mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
        <h4 className='paragraph-semibold text-dark400_light800'>
          Write your answer here
        </h4>
        <Button
          className='btn light-border-2 gap-1.5 rounded-md text-primary-500 shadow-none sm:flex-row sm:items-center sm:gap-2'
          onClick={generateAiAnswer}
          disabled={isGeneratingAiAnswer || authorId === questionAuthorId}
        >
          <Image
            src='/assets/icons/stars.svg'
            alt='generate ai answer'
            width={12}
            height={12}
            className='object-contain'
          />
          {isGeneratingAiAnswer ? "Generating..." : "Generate AI Answer"}
        </Button>
      </div>
      <Form {...form}>
        <form
          className='mt-6 flex w-full flex-col gap-10'
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name='answer'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col'>
                <FormControl className='mt-3.5'>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_EDITOR_PUBLIC_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    disabled={isSubmitting || authorId === questionAuthorId}
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
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='primary-gradient w-fit text-white'
              disabled={isSubmitting || authorId === questionAuthorId}
            >
              {isSubmitting ? "submitting..." : "submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
