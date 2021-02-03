import React from "react";
import clsx from "clsx";
// import { Head } from "./Head";
import { Footer } from "./Footer";

import styles from "./Root.module.css";

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
    <div
      className={clsx(
        styles.background,
        "flex flex-col items-start items-stretch"
      )}
    >
      {/*<Head*/}
      {/*  title={title}*/}
      {/*  metaDescription={metaDescription}*/}
      {/*  metaImg={socialMediaImg ?? img}*/}
      {/*/>*/}
      <div className="bg-heading h-16 border-b-4 border-heading-border flex flex-row items-center justify-start lg:px-4">
        <div className="max-w-6xl w-full mx-auto">
          <div className="text-3xl font-bold text-focal">{title}</div>
        </div>
      </div>
      <main role="main" className="flex-1 max-w-6xl w-full mx-auto pt-16">
        {children}
      </main>
      <Footer className="mt-16" />
    </div>
  );
}

export { Root };
