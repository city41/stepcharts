import React, { useState } from "react";
import clsx from "clsx";

import { ImageFrame } from "./ImageFrame";

type BannerProps = {
  className?: string;
  title: string;
  banner: string | null;
};

import styles from "./Banner.module.css";

function Banner({ className, title, banner }: BannerProps) {
  const [currentBanner, setCurrentBanner] = useState(banner);

  if (currentBanner) {
    return (
      <img
        className={clsx(className, styles.bannerImage, "border-2 border-white")}
        src={require(`./bannerImages/${currentBanner}`)}
        onError={() => setCurrentBanner(null)}
        loading="lazy"
        alt={`Banner for ${title}`}
        width={256}
        height={80}
      />
    );
  } else {
    return (
      <div
        className={clsx(
          styles.bannerImage,
          "bg-focal text-focal-400 border-2 border-white text-2xl font-bold grid place-items-center"
        )}
      >
        banner missing
      </div>
    );
  }
}

export { Banner };
