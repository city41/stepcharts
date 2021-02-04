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
          <div className="text-focal-500 flex flex-row space-x-1 w-20 items-center justify-end">
            {supplementary}
          </div>
        )}
      </div>
    </ImageFrame>
  );
}

export { PageItem };
