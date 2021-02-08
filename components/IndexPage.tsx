import React from "react";
import { Root } from "./layout/Root";
import { PageItem } from "./PageItem";

type IndexPageProps = {
  mixes: Record<string, Mix[]>;
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
  const mixEls = Object.keys(mixes).map((groupName) => {
    const mixesInGroup = mixes[groupName].map((mix) => {
      const mixBannerUrl = require(`../prodStepcharts/${mix.mixDir}/mix-banner.png`);
      return (
        <a
          key={mix.mixDir}
          className="inline-block m-2"
          href={buildMixUrl(mix)}
        >
          <PageItem
            title={mix.mixName}
            supplementary={`${mix.songCount} ${pluralize(
              "song",
              mix.songCount
            )}`}
          >
            <img
              className="border-2 border-white"
              src={mixBannerUrl}
              width={260}
              height={80}
              alt={`${mix.mixName} banner`}
            />
          </PageItem>
        </a>
      );
    });

    return (
      <React.Fragment key={groupName}>
        <h2 className="ml-4 font-bold text-white mt-8 mt-4">{groupName}</h2>
        <ul className="flex flex-row flex-wrap justify-center sm:justify-start">
          {mixesInGroup}
        </ul>
      </React.Fragment>
    );
  });

  return (
    <Root title="Stepcharts" metaDescription="DDR Stepcharts">
      {mixEls}
    </Root>
  );
}

export { IndexPage };
