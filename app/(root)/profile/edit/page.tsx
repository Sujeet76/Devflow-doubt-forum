import ProfileForm from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
