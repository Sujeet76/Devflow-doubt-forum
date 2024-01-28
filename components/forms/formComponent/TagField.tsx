// ui import
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { KeyboardEvent, useEffect, useState } from "react";
import { getTagOnKeyStroke } from "@/lib/actions/tag.action";
import { toast } from "sonner";
import Loader from "@/components/spinner/Loader";

interface TagFieldProps {
  form: UseFormReturn<any, any, undefined>;
  name: "title" | "explanation" | "tags";
  label: string;
  placeholder: string;
  isSubmitting: boolean;
  type: "edit" | "submit";
  tagDescription: string;
}

type suggestedTagT = {
  _id: string;
  name: string;
};

const TagField = ({
  form,
  name,
  label,
  placeholder,
  isSubmitting,
  type,
  tagDescription,
}: TagFieldProps) => {
  const [tag, setTag] = useState("");
  const [suggestedTag, setSuggestedTag] = useState<suggestedTagT[] | []>([]);
  const [isFocus, setIsFocus] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // when press enter then it adds to tags array
  const handelInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }
      }

      if (!field.value.includes(tagValue as never)) {
        form.setValue("tags", [...field.value, tagValue]);
        tagInput.value = "";
        setTag("");
        form.clearErrors("tags");
      } else {
        form.trigger();
      }
      toast.success("Tag added");
    }
  };

  // get suggested tags after 300ms of key stroke
  useEffect(() => {
    const debouncedFn = setTimeout(async () => {
      if (tag === "") {
        setSuggestedTag([]);
        return;
      }
      try {
        setIsSearching(true);
        const result = await getTagOnKeyStroke(tag);

        // if not found show toast
        if (!result) return;

        // if found set
        setSuggestedTag(JSON.parse(result));
      } catch (e: any) {
        console.log(e?.message ?? "could not found tags press enter to add");
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearInterval(debouncedFn);
  }, [tag]);

  // removes key from tags array
  const handelRemoveTag = (tag: string, field: any) => {
    // console.log(tag);
    // console.log(field);
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
    toast.message("Tag removed.");
  };

  // click on suggested tag and add to tags array
  const handelSuggestionsClick = (tag: string, field: any) => {
    if (!field.value.includes(tag as never)) {
      form.setValue("tags", [...field.value, tag]);
      setTag("");
      setSuggestedTag([]);
    } else {
      form.trigger();
    }
    toast.success("Tag added");
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className='relative flex w-full flex-col'>
          <FormLabel className='paragraph-semibold text-dark400_light800'>
            {label} <sup className='text-primary-500'>*</sup>
          </FormLabel>
          <FormControl className='mt-3.5'>
            <>
              <Input
                placeholder={placeholder}
                onKeyDown={(e) => handelInputKeyDown(e, field)}
                {...field}
                onChange={(e) => setTag(e.target.value)}
                className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
                disabled={type === "edit" || isSubmitting}
                value={tag}
                onFocus={() => setIsFocus(true)}
                onBlur={() => {
                  setTimeout(() => setIsFocus(false), 200);
                }}
              />

              {/* suggested tags visible on focus */}
              {isFocus && (
                <div className='absolute bottom-[100%] right-[60%] z-[100] h-[200px] w-48'>
                  <ScrollArea className='h-[200px] w-48 rounded-lg border-2 bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-200'>
                    <div className='px-4'>
                      <h4 className='h3-semibold text-dark500_light700 my-3'>
                        Tags
                      </h4>
                      {suggestedTag.length > 0 ? (
                        // render tags when it have length
                        suggestedTag.map((tag) => (
                          <>
                            <div
                              key={tag._id}
                              className='body-medium text-dark100_light900 cursor-pointer rounded p-2 transition-all hover:bg-light-700 dark:hover:bg-dark-400'
                              onClick={() =>
                                handelSuggestionsClick(tag.name, field)
                              }
                            >
                              {tag.name}
                            </div>
                            <Separator className='light-border-2 border last:invisible' />
                          </>
                        ))
                      ) : (
                        <>
                          <div className='body-medium text-dark100_light900 rounded p-2'>
                            {isSearching ? (
                              <Loader />
                            ) : (
                              "Start typing and click on tag to add press enter to added tag if not found"
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* added tags */}
              {field.value.length > 0 && (
                <div className='flex-start mt-2.5 flex-wrap gap-2.5'>
                  {field.value.map((tag: string, index: number) => (
                    <Badge
                      key={`${tag}${index}`}
                      className='subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize'
                      onClick={() =>
                        type !== "edit" ? handelRemoveTag(tag, field) : {}
                      }
                    >
                      {tag}
                      {type !== "edit" && (
                        <Image
                          src='/assets/icons/close.svg'
                          alt='Close icon'
                          width={12}
                          height={12}
                          className='cursor-pointer object-contain invert-0 dark:invert'
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              )}
            </>
          </FormControl>
          <FormDescription className='body-regular mt-2.5 text-light-500'>
            {tagDescription}
          </FormDescription>
          <FormMessage className='text-red-500' />
        </FormItem>
      )}
    />
  );
};

export default TagField;
