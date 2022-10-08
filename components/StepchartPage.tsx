import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Breadcrumbs } from "./Breadcrumbs";
import { TitleDetailsTable, TitleDetailsRow } from "./TitleDetailsTable";
import { ToggleBar } from "./ToggleBar";

import styles from "./StepchartPage.module.css";
import { Banner } from "./Banner";
import {
  scrollTargetBeatJustUnderHeader,
  StepchartSection,
} from "./StepchartSection";

type StepchartPageProps = {
  simfile: Simfile;
  currentType: string;
};

const speedmods = [1, 1.5, 2, 3];
const sectionSizesInMeasures: Record<typeof speedmods[number], number> = {
  1: 1,
  1.5: 5,
  2: 4,
  3: 3,
};

const HEADER_ID = "stepchart-page-header";

function StepchartPage({ simfile, currentType }: StepchartPageProps) {
  useEffect(() => {
    // this is needed because :target is not very robust (tested in both chrome and ff)
    // when just using :target, if the user changes the speedmod, :target gets wiped out
    const hash = (window.location.hash ?? "").replace("#", "");
    if (hash) {
      scrollTargetBeatJustUnderHeader(hash, HEADER_ID);
    }
  }, []);

  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUrl(window.location.toString());
  }, []);

  const [speedmod, setSpeedmod] = useState(speedmods[0]);
  const sectionSizeInMeasures = sectionSizesInMeasures[speedmod];

  const isSingle = currentType.includes("single");
  const currentTypeMeta = simfile.availableTypes.find(
    (at) => at.slug === currentType
  )!;

  const chart = simfile.charts[currentType];
  const { arrows, freezes } = chart;

  const lastArrowOffset = (arrows[arrows.length - 1]?.offset ?? 0) + 0.25;
  const lastFreezeOffset = freezes[freezes.length - 1]?.endOffset ?? 0;
  const totalSongHeight = Math.max(lastArrowOffset, lastFreezeOffset);

  const sections = [];

  for (let i = 0; i < totalSongHeight; i += sectionSizeInMeasures) {
    sections.push(
      <StepchartSection
        key={i}
        chart={chart}
        speedMod={speedmod}
        startOffset={i}
        endOffset={Math.min(totalSongHeight, i + sectionSizeInMeasures)}
        style={{ zIndex: Math.round(totalSongHeight) - i }}
        headerId={HEADER_ID}
      />
    );
  }

  const sectionGroups = [];
  const sectionsPerChunk = isSingle ? 7 : 4;

  while (sections.length) {
    const sectionChunk = sections.splice(0, sectionsPerChunk);
    sectionGroups.push(
      <div
        key={sectionGroups.length}
        className={styles.stepchartSectionGroup}
        style={{ zIndex: 99999 - sectionGroups.length }}
      >
        {sectionChunk}
      </div>
    );
  }

  const title = `${
    simfile.title.translitTitleName || simfile.title.titleName
  } - ${currentType.replace(/-/g, ", ")} (${currentTypeMeta.feet})`;

  return (
    <Root
      className={styles.rootPrint}
      title={title}
      subheading={
        <Breadcrumbs
          crumbs={[
            {
              display: simfile.mix.mixName,
              pathSegment: simfile.mix.mixDir,
            },
            {
              display:
                simfile.title.translitTitleName || simfile.title.titleName,
              pathSegment: simfile.title.titleDir,
            },
            {
              display: currentType.replace(/-/g, " "),
              pathSegment: currentType,
            },
          ]}
        />
      }
      metaDescription={`${currentType.replace(/-/g, " ")} stepchart for ${
        simfile.title.translitTitleName || simfile.title.titleName
      }`}
    >
      <div
        className={clsx(
          styles.aboveStepChart,
          "w-screen -mx-4 bg-focal-300 sticky top-0 shadow-lg sm:hidden"
        )}
      >
        <a href="..">
          <Banner
            className={clsx(
              styles.hideForPrint,
              "mx-auto border-b-4 border-white w-full absolute top-0 left-0"
            )}
            title={simfile.title}
          />
        </a>
      </div>
      <ImageFrame
        id={HEADER_ID}
        className={clsx(
          styles.hideForPrint,
          styles.aboveStepChart,
          "mt-0 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 mb-8 sm:sticky sm:top-0 sm:z-10 w-full p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl flex flex-col sm:flex-row items-center sm:justify-start sm:space-x-4"
        )}
      >
        <div className="w-full sm:w-64">
          <div className="hidden sm:block">
            <Banner
              className="mx-auto border-2 border-white w-full absolute top-0 left-0"
              title={simfile.title}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col sm:grid sm:grid-cols-2 space-y-2 sm:space-y-0">
          <TitleDetailsTable>
            {simfile.title.translitTitleName && (
              <TitleDetailsRow
                name="Native title"
                value={simfile.title.titleName}
              />
            ) || null}
            <TitleDetailsRow name="BPM" value={simfile.displayBpm} />
            <TitleDetailsRow
              name="Artist"
              value={simfile.artist ?? "unknown"}
            />
            <TitleDetailsRow name="Mix" value={simfile.mix.mixName} />
            <TitleDetailsRow
              name="difficulty"
              value={`${currentTypeMeta.difficulty} (${currentTypeMeta.feet})`}
            />
          </TitleDetailsTable>
        </div>
        <div className="hide-if-noscript sm:flex sm:flex-col mt-2 sm:mt-0 sm:flex-1 w-full max-w-xl justify-center">
          <div className="hidden sm:block text-sm ml-2 mb-1">speedmod</div>
          <ToggleBar
            namespace="speedmod"
            entries={speedmods.map((sm) => (
              <div key={sm}>{sm}</div>
            ))}
            onToggle={(i) => setSpeedmod(speedmods[i])}
            checkedIndex={speedmods.indexOf(speedmod)}
          />
        </div>
      </ImageFrame>
      <div className={styles.printTitle}>
        <div>
          {simfile.mix.mixName}: {title}
        </div>
        {currentUrl && (
          <div className="text-xs text-gray-400">{currentUrl}</div>
        )}
      </div>
      {sectionGroups}
    </Root>
  );
}

export { StepchartPage };
export type { StepchartPageProps };
