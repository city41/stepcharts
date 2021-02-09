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
      subtitle={breadcrumbs}
      metaDescription={`Step charts for ${translitName || name}`}
    >
      <div className="sm:mt-10 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <ImageFrame className="mb-8 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <Banner banner={banner} title={translitName || name} />
          <TitleDetailsTable className="mt-4">
            {translitName && (
              <TitleDetailsRow name="Native title" value={name} />
            )}
            <TitleDetailsRow name="BPM" value={bpm.join(", ")} />
            <TitleDetailsRow name="Artist" value={artist ?? "unknown"} />
            <TitleDetailsRow name="Mix" value={mix.mixName} />
          </TitleDetailsTable>
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
                    <a href={buildTypeUrl(mix.mixDir, dir, type.slug)}>
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
                      width={modeSvgWidths[mode as Mode]}
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
export type { TitlePageProps };
