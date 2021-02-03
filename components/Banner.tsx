import React, { useState } from "react";
import clsx from "clsx";

import { ImageFrame } from "./ImageFrame";

type BannerProps = {
  className?: string;
  banner: string | null;
};

import styles from "./Banner.module.css";

function Banner({ className, banner }: BannerProps) {
  const [currentBanner, setCurrentBanner] = useState(banner);

  const childEl = currentBanner ? (
    <img
      className={styles.bannerImage}
      src={require(`./bannerImages/${currentBanner}`)}
      onError={() => setCurrentBanner(null)}
      loading="lazy"
    />
  ) : (
    <div className={clsx(styles.bannerImage, "bg-focal text_focal-300")}>
      banner missing
    </div>
  );
  return <ImageFrame className={clsx(className)}>{childEl}</ImageFrame>;
}

export { Banner };
