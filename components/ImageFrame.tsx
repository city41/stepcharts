import React from "react";
import clsx from "clsx";

type ImageFrameProps = {
  className?: string;
  id?: string;
  children: React.ReactNode;
};

function ImageFrame({ className, id, children }: ImageFrameProps) {
  return (
    <div
      id={id}
      className={clsx(className, "border-2 border-focal-700 shadow-lg")}
    >
      {children}
    </div>
  );
}

export { ImageFrame };
