import React from "react";
import clsx from "clsx";
import { Footer } from "./Footer";

import logoSvg from "./logoArrow.svg";

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
      <div className="relative bg-heading h-16 border-b-4 border-heading-border flex flex-row items-center justify-start lg:px-4 overflow-hidden">
        <a
          href="/"
          className={clsx(styles.logo, "block lg:-mx-4 absolute sm:static")}
        >
          <img className="w-full h-full" src={logoSvg} />
        </a>
        <div className="max-w-6xl w-full mx-auto sm:pl-4 lg:pl-0">
          <div className="text-3xl font-bold text-focal text-center sm:mx-0 sm:text-left">
            {title}
          </div>
        </div>
      </div>
      <main
        role="main"
        className="flex-1 max-w-6xl w-full mx-auto mt-8 sm:mt-16"
      >
        {children}
      </main>
      <Footer className="mt-16" />
    </div>
  );
}

export { Root };
