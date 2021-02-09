import React from "react";
import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Breadcrumbs } from "./Breadcrumbs";
import { CompactTitleCard } from "./CompactTitleCard";

type MixPageTitle = {
  title: {
    titleName: string;
    translitTitleName: string | null;
    titleDir: string;
    banner: string | null;
  };
  types: StepchartType[];
  bpm: number[];
  stats: Stats;
};

type MixPageProps = {
  mix: Mix;
  titles: MixPageTitle[];
};

function sortByTitleCaseInsensitive(a: MixPageTitle, b: MixPageTitle) {
  return (a.title.translitTitleName || a.title.titleName)
    .toLowerCase()
    .localeCompare(
      (b.title.translitTitleName || b.title.titleName).toLowerCase()
    );
}

function MixPage({ mix, titles }: MixPageProps) {
  const mixBannerUrl = require(`../prodStepcharts/${mix.mixDir}/mix-banner.png`);
  return (
    <Root
      title={mix.mixName}
      subheading={
        <Breadcrumbs
          crumbs={[{ display: mix.mixName, pathSegment: mix.mixDir }]}
        />
      }
      metaDescription={`Step charts for DDR ${mix.mixName}`}
    >
      <ImageFrame className="mt-0 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 mb-8 sticky top-0 z-10 w-full p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl flex flex-row items-start justify-center sm:justify-start">
        <div className="w-full sm:w-64">
          <div
            className="border-2 border-white w-full bg-no-repeat bg-cover"
            style={{
              paddingTop: "calc(80 / 256 * 100%)",
              backgroundImage: `url(${mixBannerUrl})`,
            }}
            role="image"
            aria-label={`${mix.mixName} banner`}
          />
        </div>
      </ImageFrame>
      <div
        className="grid mt-8 items-start"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
          columnGap: "2rem",
          rowGap: "2rem",
        }}
      >
        {titles.sort(sortByTitleCaseInsensitive).map((title) => {
          return (
            <CompactTitleCard
              key={title.title.titleDir}
              title={title.title}
              mix={mix}
              bpm={title.bpm}
              types={title.types}
              stats={title.stats}
              hideMix
            />
          );
        })}
      </div>
    </Root>
  );
}

export { MixPage };
export type { MixPageProps };
