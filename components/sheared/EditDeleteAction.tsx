"use client";
import { Trash, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditDeleteActionProps {
  type: string;
  itemId: string;
  userId: string;
}

const EditDeleteAction = ({ type, itemId, userId }: EditDeleteActionProps) => {
  const path = usePathname();
  const route = useRouter();
  const handleEdit = () => {
    route.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    try {
      if (type === "question") {
        // delete question
        await deleteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          path,
        });
        toast.success("Question deleted successfully");
      } else {
        // delete answer
        await deleteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          path,
        });
        toast.success("Answer deleted successfully");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "some this went wrong while deletion");
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
