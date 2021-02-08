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
        <a key={mix.mixDir} className="inline-block" href={buildMixUrl(mix)}>
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
              width={256}
              height={80}
              alt={`${mix.mixName} banner`}
            />
          </PageItem>
        </a>
      );
    });

    return (
      <React.Fragment key={groupName}>
        <h2 className="font-bold text-white text-lg mt-12 mb-4 text-center sm:text-left">
          {groupName}
        </h2>
        <ul
          className="grid justify-items-center"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(276px, 1fr))",
            rowGap: "1rem",
          }}
        >
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
