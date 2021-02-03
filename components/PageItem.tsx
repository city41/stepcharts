import React from "react";
import clsx from "clsx";

import { ImageFrame } from "./ImageFrame";

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
    <ImageFrame className={clsx(className, "p-2")}>
      {children}
      <div className="mt-2 flex flex-row justify-between">
        <span className="text-white font-bold">{title}</span>
        {supplementary && (
          <span className="text-focal-500">{supplementary}</span>
        )}
      </div>
    </ImageFrame>
  );
}

export { PageItem };
