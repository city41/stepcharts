import React from "react";
import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";

type IndexPageProps = {
  mixes: Mix[];
};

function buildMixUrl(mix: Mix): string {
  return `/${mix.mixDir}`;
}

function IndexPage({ mixes }: IndexPageProps) {
  return (
    <Root
      title="Choose a Mix"
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <ul className="flex flex-col space-y-4">
        {mixes.map((m) => {
          const mixBannerUrl = require(`../stepcharts/${m.mixDir}/mix-banner.png`);
          return (
            <li key={m.mixDir}>
              <a className="inline-block" href={buildMixUrl(m)}>
                <ImageFrame className="p-2">
                  <img
                    className="border-2 border-white"
                    src={mixBannerUrl}
                    width={260}
                    height={80}
                    alt={`${m.mixName} banner`}
                  />
                  <div className="mt-2 flex flex-row justify-between">
                    <span className="text-white font-bold">{m.mixName}</span>
                    <span className="text-focal-500">2003</span>
                  </div>
                </ImageFrame>
              </a>
            </li>
          );
        })}
      </ul>
    </Root>
  );
}

export { IndexPage };
