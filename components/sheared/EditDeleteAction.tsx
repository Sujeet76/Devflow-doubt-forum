"use client";
import { Trash, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { usePathname, useRouter } from "next/navigation";

interface EditDeleteActionProps {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const path = usePathname();
  const route = useRouter();
  const handleEdit = () => {
    route.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    if (type === "question") {
      // delete question
      await deleteQuestion({ questionId: JSON.parse(itemId), path });
    } else {
      // delete answer
      await deleteAnswer({ answerId: JSON.parse(itemId), path });
    }
  };

  return (
    <div className='flex items-center justify-center gap-3 max-sm:w-full'>
      {type === "question" && (
        <>
          <Button
            variant={"ghost"}
            onClick={handleEdit}
            className='group size-auto rounded-none p-0'
          >
            <SquarePen
              size={18}
              strokeWidth={3}
              className='stroke-[#2688E5] transition-transform group-hover:scale-110'
            />
          </Button>
        </>
      )}
      <Button
        variant={"ghost"}
        onClick={handleDelete}
        className='group size-auto rounded-none p-0'
      >
        <Trash
          size={18}
          strokeWidth={3}
          className='stroke-red-700 transition-transform group-hover:scale-110'
        />
      </Button>
    </div>
  );
};

export default EditDeleteAction;
