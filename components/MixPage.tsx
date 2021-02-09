import React, { useState } from "react";
import { BiDetail, BiImage } from "react-icons/bi";
import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Banner } from "./Banner";
import { PageItem } from "./PageItem";
import { Foot } from "./Foot";
import { Breadcrumbs } from "./Breadcrumbs";
import { ToggleBar } from "./ToggleBar";
import { CompactCard } from "./CompactCard";

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

function buildTitleUrl(mix: Mix, title: string) {
  return `/${mix.mixDir}/${title}`;
}

function getFeetRange(title: MixPageTitle): string {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;

  title.types.forEach((type) => {
    if (type.feet < min) {
      min = type.feet;
    }

    if (type.feet > max) {
      max = type.feet;
    }
  });

  if (min === max) {
    return min.toString();
  }

  return `${min} - ${max}`;
}

function sortByTitleCaseInsensitive(a: MixPageTitle, b: MixPageTitle) {
  return (a.title.translitTitleName || a.title.titleName)
    .toLowerCase()
    .localeCompare(
      (b.title.translitTitleName || b.title.titleName).toLowerCase()
    );
}

const VIEW_TYPES = ["banner", "compact"];

function MixPage({ mix, titles }: MixPageProps) {
  const [viewTypeIndex, setViewTypeIndex] = useState(0);
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
        <ImageFrame className="mb-8 mt-2 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <img
            className="border-2 border-white"
            src={require(`../prodStepcharts/${mix.mixDir}/mix-banner.png`)}
            width={280}
            height={80}
            alt={`${mix.mixName} banner`}
          />
        </ImageFrame>
        <div className="flex-1">
          <ToggleBar
            namespace="mix-detail-image"
            entries={[
              <BiImage className="text-2xl" />,
              <BiDetail className="text-2xl" />,
            ]}
            onToggle={(i) => setViewTypeIndex(i)}
            checkedIndex={viewTypeIndex}
          />
          <div
            className="grid mt-8 items-start"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              columnGap: "2rem",
              rowGap: "2rem",
            }}
          >
            {titles.sort(sortByTitleCaseInsensitive).map((title) => {
              if (viewTypeIndex === 0) {
                const supp = (
                  <>
                    <span>{getFeetRange(title)}</span>
                    <Foot difficulty="icon" />
                  </>
                );

                return (
                  <a
                    key={title.title.titleDir}
                    href={buildTitleUrl(mix, title.title.titleDir)}
                  >
                    <PageItem
                      title={
                        title.title.translitTitleName || title.title.titleName
                      }
                      supplementary={supp}
                    >
                      <Banner
                        banner={title.title.banner}
                        title={
                          title.title.translitTitleName || title.title.titleName
                        }
                      />
                    </PageItem>
                  </a>
                );
              } else {
                return (
                  <CompactCard
                    title={title.title}
                    mix={mix}
                    bpm={title.bpm}
                    types={title.types}
                    hideMix
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    </Root>
  );
}

export { MixPage };
export type { MixPageProps };
