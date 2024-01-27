import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex min-h-screen w-full items-center justify-center bg-auth-light bg-cover bg-center bg-no-repeat py-6 dark:bg-auth-dark'>
      {children}
    </main>
  );
};

export default Layout;
