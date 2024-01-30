import ProfileForm from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Profile | Dev Overflow",
  description:
    "Update your profile on Dev Overflow. Manage your personal information, update your bio, and customize your user settings.",
  keywords:
    "Dev Overflow, Edit Profile, User Settings, Update Bio, Manage Information, Developer Profile, Coding Community",
};

const EditProfile = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-up");

  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>
      <div className='mt-9'>
        <ProfileForm
          clerkId={userId}
          mongoUser={JSON.stringify(mongoUser)}
        />
      </div>
    </div>
  );
};

export default EditProfile;
