import React from "react";
import { Banner } from "./Banner";
import { Root } from "./layout/Root";
import { StepchartTypePageItem } from "./StepchartTypePageItem";
import { ImageFrame } from "./ImageFrame";
import { TitleDetailsTable } from "./TitleDetailsTable";

import singleSvg from "./single.svg";
import doubleSvg from "./double.svg";

const modeSvgs = {
  single: singleSvg,
  double: doubleSvg,
};

type TitlePageProps = {
  mix: Mix;
  title: Title;
  types: StepchartType[];
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

function buildTypeUrl(mix: Mix, title: string, type: string) {
  return `/${mix.mixDir}/${title}/${type}`;
}

function TitlePage({ mix, title, types }: TitlePageProps) {
  const grouped = groupTypes(types);

  return (
    <Root
      title={title.actualTitle}
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <div className="sm:mt-16 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <ImageFrame className="mb-8 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <Banner banner={title.banner} />
          <TitleDetailsTable mix={mix} />
        </ImageFrame>
        <ul className="flex flex-col items-center space-y-8">
          {Object.keys(grouped).map((mode) => {
            const items = grouped[mode as Mode].map((type) => {
              return (
                <li key={type.difficulty}>
                  <a href={buildTypeUrl(mix, title.titleDir, type.slug)}>
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
