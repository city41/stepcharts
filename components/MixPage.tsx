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
  return (
    <Root
      title={mix.mixName}
      subtitle={
        <Breadcrumbs
          crumbs={[{ display: mix.mixName, pathSegment: mix.mixDir }]}
        />
      }
      metaDescription={`Step charts for DDR ${mix.mixName}`}
    >
      <div className="sm:mt-8 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <ImageFrame className="mb-8 xmt-2 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <img
            className="border-2 border-white"
            src={require(`../prodStepcharts/${mix.mixDir}/mix-banner.png`)}
            width={280}
            height={80}
            alt={`${mix.mixName} banner`}
          />
        </ImageFrame>
        <div className="flex-1">
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
                  hideMix
                />
              );
            })}
          </div>
        </div>
      </div>
    </Root>
  );
}

export { MixPage };
export type { MixPageProps };
