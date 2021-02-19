import React, { useState } from "react";
import clsx from "clsx";

type BannerProps = {
  className?: string;
  title: Title;
};

function Banner({ className, title }: BannerProps) {
  const name = title.translitTitleName || title.titleName;
  const [currentBanner, setCurrentBanner] = useState(title.banner);

  let bannerEl;

  if (currentBanner) {
    bannerEl = (
      <img
        className="absolute top-0 left-0"
        src={require(`./bannerImages/${currentBanner}`)}
        onError={() => setCurrentBanner(null)}
        loading="lazy"
        alt={`${name} banner`}
      />
    );
  } else {
    bannerEl = (
      <div className="absolute top-0 left-0 w-full h-full bg-focal text-focal-400 flex flex-col items-center justify-center">
        <div className="text-focal-200 text-xl font-bold">{name}</div>
        <div className="text-xs text-focal-50">(banner missing)</div>
      </div>
    );
  }

  return (
    <div
      className={clsx(className, "relative")}
      style={{
        paddingTop: "calc(80 / 256 * 100%)",
      }}
    >
      {bannerEl}
    </div>
  );
}

export { Banner };
