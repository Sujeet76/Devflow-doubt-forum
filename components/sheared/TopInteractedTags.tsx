import { getTopInteractionTags } from "@/lib/actions/tag.action";
import React from "react";
import RenderTag from "./RenderTag";
import { Badge } from "../ui/badge";
import { SearchParamsProps } from "@/types";

interface TopInteractedTagsPros extends SearchParamsProps {
  userId: string;
}

const TopInteractedTags = async ({
  searchParams,
  userId,
}: TopInteractedTagsPros) => {
  const interactedTags = await getTopInteractionTags({
    userId,
    limit: searchParams?.limit ? +searchParams.limit : 8,
  });

  return (
    <div className='mt-7'>
      {interactedTags && interactedTags.length > 0 ? (
        <div className='flex flex-col gap-3'>
          {interactedTags.map((tag) => (
            <div
              key={tag._id}
              className='flex items-center justify-between'
            >
              <RenderTag
                _id={tag._id}
                name={tag.name}
              />
              <span className='text-dark500_light700 small-medium'>
                {tag?.questions.length}+
              </span>
            </div>
          ))}
        </div>
      ) : (
        <Badge>No tags yet</Badge>
      )}
    </div>
  );
};

export default TopInteractedTags;
