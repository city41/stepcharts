import React from "react";
import clsx from "clsx";
import { Head } from "./Head";
import { Footer } from "./Footer";

import logoSvg from "./logoArrow.svg";

import styles from "./Root.module.css";

type RootProps = {
  className?: string;
  title: string;
  subheading?: React.ReactNode;
  metaDescription: string;
  socialMediaImg?: string;
  children: React.ReactNode;
};

function Root({
  className,
  title,
  subheading,
  metaDescription,
  socialMediaImg,
  children,
}: RootProps) {
  return (
    <div
      className={clsx(
        className,
        styles.background,
        "flex flex-col items-stretch",
        {}
      )}
    >
      <Head
        title={title}
        metaDescription={metaDescription}
        metaImg={socialMediaImg}
      />
      <header className="shadow">
        <div className="bg-heading h-16 flex flex-row items-center justify-between lg:px-4">
          <div className="flex flex-row items-center justify-start space-x-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-row items-center">
              <a href="/" className={clsx(styles.logo, "block lg:-ml-4")}>
                <img
                  className="w-full h-full"
                  src={logoSvg.src}
                  alt="Stepcharts logo"
                  width={52}
                  height={52}
                />
              </a>
              <div className="hidden sm:block text-2xl text-focal font-light text-center pl-4">
                <a href="/">Stepcharts</a>
              </div>
            </div>
            <a className="className text-link cursor-pointer" href="/all-songs">
              all songs
            </a>
          </div>
        </div>
        {subheading && (
          <div className="hidden sm:block py-1 px-2 bg-subheading">
            <div className="w-full max-w-6xl mx-auto flex flex-row items-center">
              {subheading}
            </div>
          </div>
        )}
      </header>
      <main role="main" className={clsx(styles.main, "flex-1 w-full mx-auto")}>
        {children}
      </main>
      <Footer className="mt-16" />
    </div>
  );
}

export { Root };
