import React from "react";
import clsx from "clsx";

type ImageFrameProps = {
  className?: string;
  customColor?: boolean;
  children: React.ReactNode;
};

function ImageFrame({ className, customColor, children }: ImageFrameProps) {
  return (
    <div className={clsx(className, "border-2 border-focal-700 shadow-lg")}>
      {children}
    </div>
  );
}

export { ImageFrame };
