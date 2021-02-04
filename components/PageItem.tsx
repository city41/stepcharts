import React from "react";
import clsx from "clsx";

import { ImageFrame } from "./ImageFrame";

import styles from "./PageItem.module.css";

type PageItemProps = {
  className?: string;
  title: React.ReactNode;
  supplementary?: React.ReactNode;
  children: React.ReactNode;
};

function PageItem({
  className,
  title,
  supplementary,
  children,
}: PageItemProps) {
  return (
    <ImageFrame className={clsx(className, "p-2 cursor-pointer")}>
      {children}
      <div className={clsx(styles.root, "mt-2 flex flex-row justify-between")}>
        <div className="text-white font-bold break-word">{title}</div>
        {supplementary && (
          <span className="text-focal-500">{supplementary}</span>
        )}
      </div>
    </ImageFrame>
  );
}

export { PageItem };
