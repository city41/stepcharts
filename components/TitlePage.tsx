import React from "react";
import { Banner } from "./Banner";
import { Root } from "./layout/Root";
import { StepchartTypePageItem } from "./StepchartTypePageItem";
import { ImageFrame } from "./ImageFrame";
import { TitleDetailsRow, TitleDetailsTable } from "./TitleDetailsTable";

import singleSvg from "./single.svg";
import doubleSvg from "./double.svg";
import { Breadcrumbs } from "./Breadcrumbs";

const modeSvgs = {
  single: singleSvg,
  double: doubleSvg,
};

const modeSvgWidths = {
  single: 24,
  double: 48,
};

type TitlePageMix = {
  mixName: string;
  mixDir: string;
};

type TitlePageProps = {
  name: string;
  translitName: string | null;
  dir: string;
  banner: string | null;
  displayBpm: string;
  artist: string | null;
  mix: TitlePageMix;
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

function buildTypeUrl(mixDir: string, titleDir: string, slug: string): string {
  return `/${mixDir}/${titleDir}/${slug}`;
}

function TitlePage({
  name,
  translitName,
  dir,
  banner,
  displayBpm,
  artist,
  mix,
  types,
}: TitlePageProps) {
  if (types.length === 0) {
    throw new Error(
      `TitlePage: empty title! ${translitName || name}, ${mix.mixName}`
    );
  }

  const grouped = groupTypes(types);

  const breadcrumbs = (
    <Breadcrumbs
      crumbs={[
        { display: mix.mixName, pathSegment: mix.mixDir },
        { display: translitName || name, pathSegment: dir },
      ]}
    />
  );

  const bannerUrl = require(`./bannerImages/${banner}`);

  return (
    <Root
      title={translitName || name}
      subheading={breadcrumbs}
      metaDescription={`Step charts for ${translitName || name}`}
    >
      <ImageFrame className="mt-0 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 mb-8 sticky top-0 z-10 p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl flex flex-col sm:flex-row items-center justify-center sm:justify-start sm:space-x-4">
        <div className="w-full sm:w-64">
          <div
            className="border-2 border-white w-full bg-no-repeat bg-cover"
            style={{
              paddingTop: "calc(80 / 256 * 100%)",
              backgroundImage: `url(${bannerUrl})`,
            }}
            role="image"
            aria-label={`${translitName || name} banner`}
          />
        </div>
        <TitleDetailsTable className="mt-4 sm:mt-0">
          {translitName && <TitleDetailsRow name="Native title" value={name} />}
          <TitleDetailsRow name="BPM" value={displayBpm} />
          <TitleDetailsRow name="Artist" value={artist ?? "unknown"} />
          <TitleDetailsRow name="Mix" value={mix.mixName} />
        </TitleDetailsTable>
      </ImageFrame>
      <ul className="flex flex-row flex-wrap justify-center sm:justify-around items-start">
        {Object.keys(grouped).map((mode) => {
          const types = grouped[mode as Mode];

          if (types.length === 0) {
            return null;
          }

          const items = types.map((type, index) => {
            return (
              <li key={type.difficulty}>
                <a href={buildTypeUrl(mix.mixDir, dir, type.slug)}>
                  <StepchartTypePageItem
                    type={type}
                    isLast={index === types.length - 1}
                  />
                </a>
              </li>
            );
          });

          return (
            <li key={mode} className="mb-8 sm:mb-0">
              <h2 className="flex flex-row items-center justify-between text-focal-600 font-light mb-2 text-xl items-center">
                <span>{mode}</span>
                <img
                  src={modeSvgs[mode as Mode]}
                  width={modeSvgWidths[mode as Mode]}
                  alt={`Icon for ${mode} mode`}
                />
              </h2>
              <ul className="shadow-md">{items}</ul>
            </li>
          );
        })}
      </ul>
    </Root>
  );
}

export { TitlePage };
export type { TitlePageProps };
