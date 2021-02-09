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
  bpm: number[];
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
  bpm,
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

  return (
    <Root
      title={translitName || name}
      subheading={breadcrumbs}
      metaDescription={`Step charts for ${translitName || name}`}
    >
      <ImageFrame className="my-8 sticky top-0 z-10 w-full sm:w-auto p-4 bg-focal-300 rounded-tl-xl rounded-br-xl flex justify-start items-center space-x-2">
        <Banner banner={banner} title={translitName || name} />
        <TitleDetailsTable className="mt-4">
          {translitName && <TitleDetailsRow name="Native title" value={name} />}
          <TitleDetailsRow name="BPM" value={bpm.join(", ")} />
          <TitleDetailsRow name="Artist" value={artist ?? "unknown"} />
          <TitleDetailsRow name="Mix" value={mix.mixName} />
        </TitleDetailsTable>
      </ImageFrame>
      <ul className="flex flex-row flex-wrap sm:justify-around items-start">
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
            <li key={mode}>
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
