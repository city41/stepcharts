import React from "react";
import { Banner } from "./Banner";
import { Root } from "./layout/Root";
import { StepchartTypePageItem } from "./StepchartTypePageItem";
import { ImageFrame } from "./ImageFrame";
import { TitleDetailsTable } from "./TitleDetailsTable";

import singleSvg from "./single.svg";
import doubleSvg from "./double.svg";
import { Breadcrumbs } from "./Breadcrumbs";

const modeSvgs = {
  single: singleSvg,
  double: doubleSvg,
};

type TitlePageProps = {
  stepchart: Stepchart;
};

type GroupedTypes = Record<Mode, StepchartType[]>;

function groupTypes(types: StepchartType[]): GroupedTypes {
  return types.reduce<GroupedTypes>(
    (building, type) => {
      building[type.mode].push(type);

      return building;
    },
    { single: [], double: [] }
  );
}

function buildTypeUrl(stepchart: Stepchart, slug: string): string {
  return `/${stepchart.mix.mixDir}/${stepchart.title.titleDir}/${slug}`;
}

function TitlePage({ stepchart }: TitlePageProps) {
  const grouped = groupTypes(stepchart.availableTypes);

  return (
    <Root
      title={stepchart.title.actualTitle}
      subtitle={<Breadcrumbs leaf="title" stepchart={stepchart} />}
      metaDescription={`Stepcharts for ${stepchart.title.actualTitle}`}
      socialMediaImg=""
    >
      <div className="sm:mt-8 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <ImageFrame className="mb-8 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <Banner banner={stepchart.title.banner} />
          <TitleDetailsTable className="mt-4" stepchart={stepchart} />
        </ImageFrame>
        <ul className="flex flex-col items-center space-y-8">
          {Object.keys(grouped).map((mode) => {
            const items = grouped[mode as Mode].map((type) => {
              return (
                <li key={type.difficulty}>
                  <a href={buildTypeUrl(stepchart, type.slug)}>
                    <StepchartTypePageItem type={type} />
                  </a>
                </li>
              );
            });

            return (
              <li key={mode}>
                <h2 className="flex flex-row justify-between text-white font-bold mb-2 text-xl">
                  {mode} <img src={modeSvgs[mode as Mode]} width={50} />
                </h2>
                <ul>{items}</ul>
              </li>
            );
          })}
        </ul>
      </div>
    </Root>
  );
}

export { TitlePage };
