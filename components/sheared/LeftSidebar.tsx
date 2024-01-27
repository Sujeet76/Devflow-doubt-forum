"use client";
import { sidebarLinks } from "@/constants";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <aside className='background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between gap-6 overflow-y-auto border-r px-4 pb-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[240px]'>
      <div className='absolute -top-1/2 right-1/2 z-[-1] hidden h-[57rem] w-[40rem] shrink-0 select-none rounded-full bg-[#1a1a34] opacity-[0.5] blur-[178.5px] dark:block' />
      <div className='flex flex-1 flex-col gap-4'>
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          // show this profile route to signed in user only
          if (item.route === "/profile") {
            return (
              <SignedIn key={item.route}>
                <Link
                  href={`${item.route}/${userId}`}
                  className={`${
                    isActive
                      ? "primary-gradient rounded-lg text-light-900"
                      : "text-dark300_light900"
                  } flex items-center justify-start gap-4 bg-transparent px-4 py-3`}
                >
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={`${isActive ? "" : "invert-colors"}`}
                  />
                  <p
                    className={`${
                      isActive ? "base-bold" : "base-medium"
                    } max-lg:hidden`}
                  >
                    {item.label}
                  </p>
                </Link>
              </SignedIn>
            );
          }

          // other routes
          return (
            <Link
              href={item.route}
              key={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900"
              } flex items-center justify-start gap-4 bg-transparent px-4 py-3`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className='flex flex-col gap-3'>
          <Link href='/sign-in'>
            <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
              <Image
                src='/assets/icons/account.svg'
                alt='login'
                width={20}
                height={20}
                className='invert-colors lg:hidden'
              />
              <span className='primary-text-gradient font-medium max-lg:hidden'>
                Log In
              </span>
            </Button>
          </Link>
          <Link href='/sign-up'>
            <Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3'>
              <Image
                src='/assets/icons/sign-up.svg'
                alt='login'
                width={20}
                height={20}
                className='invert-colors lg:hidden'
              />
              <span className='font-medium max-lg:hidden'>Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </aside>
  );
};

export default LeftSidebar;
