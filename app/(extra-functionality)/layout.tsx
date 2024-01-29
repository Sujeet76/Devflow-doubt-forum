import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/notes/sidebar/Sidebar";
import { ResizeLayout } from "@/components/notes/ResizeLayout";
import Navbar from "@/components/sheared/navbar/Navbar";

// import "../globals.css";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='background-light850_dark100 relative h-dvh'>
      <Navbar
        isGlobalSearch={false}
        otherClasses='p-4 h-[4.5rem]'
      />
      <ResizeLayout sidePanel={<Sidebar />}>{children}</ResizeLayout>

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
