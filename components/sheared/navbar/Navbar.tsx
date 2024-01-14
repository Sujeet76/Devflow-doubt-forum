import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className='background-light900_dark200  flex-between custom-shadow fixed z-50 w-full gap-4 p-6 dark:shadow-none sm:px-12'>
      <Link
        href='/'
        className='flex items-center gap-1'
      >
        <Image
          src='/assets/images/site-logo.svg'
          width={23}
          height={23}
          alt='DevFlow'
        />
        <p className='h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
          Dev<span className='text-primary-500'>OverFlow</span>{" "}
        </p>
      </Link>

      <GlobalSearch />
      <div className='flex-between gap-5'>
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
