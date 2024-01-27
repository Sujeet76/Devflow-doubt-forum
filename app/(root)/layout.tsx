import { ReactNode } from "react";
import LeftSidebar from "@/components/sheared/LeftSidebar";
import Navbar from "@/components/sheared/navbar/Navbar";
import RightSidebar from "@/components/sheared/RightSidebar";
import { Toaster } from "@/components/ui/sonner";

// import "../globals.css";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='background-light850_dark100 relative'>
      <Navbar />
      <div className='flex'>
        <LeftSidebar />
        <section className='flex min-h-dvh flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14'>
          <div className='mx-auto w-full max-w-5xl'>{children}</div>
        </section>
        <RightSidebar />
      </div>
      <Toaster
        closeButton
        richColors
        theme='system'
        position='top-right'
      />
    </main>
  );
};

export default Layout;
