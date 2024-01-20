"use client";
import { Trash, FilePenLine } from "lucide-react";
import { Button } from "../ui/button";

interface EditDeleteActionProps {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const handleEdit = () => {
    console.log("edit");
  };
  const handleDelete = () => {
    console.log("edit");
  };

  return (
    <div className='flex items-center justify-center gap-3 max-sm:w-full'>
      {type === "question" && (
        <>
          <Button
            variant={"ghost"}
            onClick={handleEdit}
          >
            <FilePenLine
              size={14}
              strokeWidth={2.25}
            />
          </Button>
        </>
      )}
      <Button
        variant={"ghost"}
        onClick={handleDelete}
      >
        <Trash
          size={14}
          strokeWidth={2.25}
        />
      </Button>
    </div>
  );
};

export default EditDeleteAction;
