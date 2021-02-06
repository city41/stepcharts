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
      metaDescription={`Step charts for ${stepchart.title.actualTitle}`}
    >
      <div className="sm:mt-8 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <ImageFrame className="mb-8 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <Banner
            banner={stepchart.title.banner}
            title={stepchart.title.actualTitle}
          />
          <TitleDetailsTable className="mt-4" stepchart={stepchart} />
        </ImageFrame>
        <ImageFrame className="p-2 bg-focal">
          <ul className="flex flex-col items-center space-y-8">
            {Object.keys(grouped).map((mode) => {
              const types = grouped[mode as Mode];

              if (types.length === 0) {
                return null;
              }

              const items = types.map((type) => {
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
                  <h2 className="flex flex-row items-center justify-between text-white font-bold mb-2 text-xl items-center">
                    <span>{mode}</span>
                    <img
                      src={modeSvgs[mode as Mode]}
                      width={50}
                      alt={`Icon for ${mode} mode`}
                    />
                  </h2>
                  <ul>{items}</ul>
                </li>
              );
            })}
          </ul>
        </ImageFrame>
      </div>
    </Root>
  );
}

export { TitlePage };
