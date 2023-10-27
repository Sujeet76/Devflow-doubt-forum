import User from "@/database/user.modal";
import { connectToDB } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

export async function getTopInteractionTags(
  params: GetTopInteractedTagsParams
) {
  try {
    connectToDB();

    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // find interaction for the user and group by tag...
    // Interaction...

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
    ];
  } catch (error) {
    console.log("Error while => ", error);
  }
}
