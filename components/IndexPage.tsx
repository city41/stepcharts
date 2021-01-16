import React from "react";
import { Root } from "./layout/Root";

type IndexPageProps = {
  mixes: Mix[];
};

function buildMixUrl(mix: Mix): string {
  return `/${mix.mixDir}`;
}

function IndexPage({ mixes }: IndexPageProps) {
  return (
    <Root
      title="stepcharts"
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <h1 className="text-3xl">Choose a mix</h1>
      <ul className="flex flex-col gap-2">
        {mixes.map((m) => {
          const mixBannerUrl = require(`../stepcharts/${m.mixDir}/mix-banner.png`);
          return (
            <li key={m.mixDir}>
              <a className="inline-block" href={buildMixUrl(m)}>
                <div>
                  <img
                    src={mixBannerUrl}
                    width={260}
                    height={80}
                    alt={`${m.mixName} banner`}
                  />
                  <div>{m.mixName}</div>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </Root>
  );
}

export { IndexPage };
