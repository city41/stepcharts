import React, { useState } from "react";
import clsx from "clsx";

import { ImageFrame } from "./ImageFrame";

type BannerProps = {
  className?: string;
  banner: string | null;
};

const BANNER_WIDTH = 256;
const BANNER_HEIGHT = 80;

function Banner({ className, banner }: BannerProps) {
  const [currentBanner, setCurrentBanner] = useState(banner);

  const childEl = currentBanner ? (
    <img
      width={BANNER_WIDTH}
      height={BANNER_HEIGHT}
      src={require(`./bannerImages/${currentBanner}`)}
      onError={() => setCurrentBanner(null)}
    />
  ) : (
    <div
      className="bg-focal text_focal-300"
      style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
    >
      banner missing
    </div>
  );
  return <ImageFrame className={clsx(className)}>{childEl}</ImageFrame>;
}

export { Banner };
