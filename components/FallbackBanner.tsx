import React from "react";
import clsx from "clsx";

type FallbackBannerProps = {
  className?: string;
};

function FallbackBanner({ className }: FallbackBannerProps) {
  return (
    <div className={clsx(className)} style={{ width: 256, height: 80 }}>
      banner missing
    </div>
  );
}

export { FallbackBanner };
