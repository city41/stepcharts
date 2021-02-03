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
        "border-2 bg-focal-600 border-focal-700 shadow-sm"
      )}
    >
      {children}
    </div>
  );
}

export { ImageFrame };
