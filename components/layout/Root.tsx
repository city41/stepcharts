import React from "react";
import clsx from "clsx";
import { Head } from "./Head";
import { Footer } from "./Footer";
import { BrandNewModal } from "../BrandNewModal";

import logoSvg from "./logoArrow.svg";

import styles from "./Root.module.css";

type RootProps = {
  title: string;
  subtitle?: React.ReactNode;
  metaDescription: string;
  socialMediaImg?: string;
  children: React.ReactNode;
};

function Root({
  title,
  subtitle,
  metaDescription,
  socialMediaImg,
  children,
}: RootProps) {
  return (
    <>
      <BrandNewModal />
      <div
        className={clsx(
          styles.background,
          "flex flex-col items-start items-stretch"
        )}
      >
        <Head
          title={title}
          metaDescription={metaDescription}
          metaImg={socialMediaImg}
        />
        <header>
          <div className="bg-heading h-16 border-b-4 border-heading-border flex flex-row items-center justify-between lg:px-4">
            <div className="flex flex-row items-center">
              <a href="/" className={clsx(styles.logo, "block lg:-ml-4")}>
                <img
                  className="w-full h-full"
                  src={logoSvg}
                  alt="Stepcharts logo"
                />
              </a>
              <div className="text-2xl font-bold text-focal text-center pl-4">
                <a href="/">Stepcharts</a>
              </div>
            </div>
            <a
              className="mr-4 lg:mr-0 text-focal hover:border-focal border-b-2 border-transparent"
              href="/roadmap"
            >
              roadmap
            </a>
          </div>
          {subtitle && (
            <div className="hidden sm:block py-1 bg-subheading border-b-2 border-heading-border">
              <div className="w-full max-w-6xl mx-auto flex flex-row items-center">
                <h1 className="font-bold text-white text-center sm:text-left">
                  {subtitle}
                </h1>
              </div>
            </div>
          )}
        </header>
        <main role="main" className="flex-1 max-w-6xl w-full mx-auto">
          {children}
        </main>
        <Footer className="mt-16" />
      </div>
    </>
  );
}

export { Root };
