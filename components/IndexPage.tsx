import React from "react";
import { Root } from "./layout/Root";
import { PageItem } from "./PageItem";

type IndexPageProps = {
  mixes: Mix[];
};

function buildMixUrl(mix: Mix): string {
  return `/${mix.mixDir}`;
}

function pluralize(str: string, count: number): string {
  if (count === 1) {
    return str;
  }
  return str + "s";
}

function IndexPage({ mixes }: IndexPageProps) {
  return (
    <Root
      title="Choose a Mix"
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <ul className="flex flex-col space-y-4 items-center sm:items-start sm:pl-4 lg:pl-0">
        {mixes.map((m) => {
          const mixBannerUrl = require(`../stepcharts/${m.mixDir}/mix-banner.png`);
          return (
            <li key={m.mixDir}>
              <a className="inline-block" href={buildMixUrl(m)}>
                <PageItem
                  title={m.mixName}
                  supplementary={`${m.songCount} ${pluralize(
                    "song",
                    m.songCount
                  )}`}
                >
                  <img
                    className="border-2 border-white"
                    src={mixBannerUrl}
                    width={260}
                    height={80}
                    alt={`${m.mixName} banner`}
                  />
                </PageItem>
              </a>
            </li>
          );
        })}
      </ul>
    </Root>
  );
}

export { IndexPage };
