import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full font-sans bg-primaryBlue dark:bg-baseBlue text-neutral-900 dark:text-white transition duration-200 bg-bg-pattern">
      <div className="flex flex-col flex-1">
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
