import React from "react";
import clsx from "clsx";

type ImageFrameProps = {
  className?: string;
  children: React.ReactNode;
};

function ImageFrame({ className, children }: ImageFrameProps) {
  return (
    <div
      className={clsx(
        className,
        "border-2 bg-focal-400 border-focal-700 shadow-lg"
      )}
    >
      {children}
    </div>
  );
}

export { ImageFrame };
