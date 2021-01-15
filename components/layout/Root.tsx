import React from "react";
// import { Head } from "./Head";
import { Footer } from "./Footer";

type RootProps = {
  title: string;
  metaForTitle?: string;
  metaDescription: string;
  socialMediaImg?: string;
  children: React.ReactNode;
};

function Root({
  title,
  metaForTitle,
  metaDescription,
  socialMediaImg,
  children,
}: RootProps) {
  return (
    <>
      {/*<Head*/}
      {/*  title={title}*/}
      {/*  metaDescription={metaDescription}*/}
      {/*  metaImg={socialMediaImg ?? img}*/}
      {/*/>*/}
      <main
        role="main"
        className="pt-12 sm:mt-32 px-8 sm:px-0 sm:max-w-6xl sm:mx-auto"
      >
        {children}
      </main>
      <Footer className="mt-16 sm:mt-24" />
    </>
  );
}

export { Root };
