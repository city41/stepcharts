import React from "react";
import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Banner } from "./Banner";
import { PageItem } from "./PageItem";
import { Foot } from "./Foot";
import { Breadcrumbs } from "./Breadcrumbs";

type MixPageTitle = {
  titleDir: string;
  titleName: string;
  banner: string | null;
  feet: [number, number];
};

type MixPageProps = {
  mix: Mix;
  titles: MixPageTitle[];
};

function buildTitleUrl(mix: Mix, title: string) {
  return `/${mix.mixDir}/${title}`;
}

function getFeetRange(title: MixPageTitle): string {
  const [min, max] = title.feet;

  if (min === max) {
    return min.toString();
  }

  return `${min} - ${max}`;
}

function sortByTitleCaseInsensitive(a: MixPageTitle, b: MixPageTitle) {
  return a.titleName.toLowerCase().localeCompare(b.titleName.toLowerCase());
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
        <ImageFrame className="mb-8 mt-2 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <img
            className="border-2 border-white"
            src={require(`../prodStepcharts/${mix.mixDir}/mix-banner.png`)}
            width={280}
            height={80}
            alt={`${mix.mixName} banner`}
          />
        </ImageFrame>
        <ul className="flex-1 flex flex-col sm:flex-row sm:flex-wrap items-start">
          {titles.sort(sortByTitleCaseInsensitive).map((title) => {
            const supp = (
              <>
                <span>{getFeetRange(title)}</span>
                <Foot difficulty="icon" />
              </>
            );

            return (
              <li className="m-2" key={title.titleName}>
                <a href={buildTitleUrl(mix, title.titleDir)}>
                  <PageItem title={title.titleName} supplementary={supp}>
                    <Banner banner={title.banner} title={title.titleName} />
                  </PageItem>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Root>
  );
}

export { MixPage };
export type { MixPageProps };
