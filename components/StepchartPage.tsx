import React, { useState } from "react";
import clsx from "clsx";

import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Breadcrumbs } from "./Breadcrumbs";
import { TitleDetailsTable, TitleDetailsRow } from "./TitleDetailsTable";
import { ToggleBar } from "./ToggleBar";

import styles from "./StepchartPage.module.css";
import { Banner } from "./Banner";
import { StepchartSection } from "./StepchartSection";

type StepchartPageProps = {
  simfile: Simfile;
  currentType: string;
};

const ARROW_HEIGHT = 40;
const SECTION_SIZE_IN_MEASURES = 4;
const speedmods = [1, 1.5, 2, 3];

function StepchartPage({ simfile, currentType }: StepchartPageProps) {
  const [speedmod, setSpeedmod] = useState(speedmods[0]);
  const isSingle = currentType.includes("single");
  const singleDoubleClass = isSingle ? "single" : "double";
  const currentTypeMeta = simfile.availableTypes.find(
    (at) => at.slug === currentType
  )!;

  const chart = simfile.charts[currentType];
  const { arrows, freezes } = chart;

  const lastArrowOffset = (arrows[arrows.length - 1]?.offset ?? 0) + 0.25;
  const lastFreezeOffset = freezes[freezes.length - 1]?.endOffset ?? 0;
  const totalSongHeight = Math.max(lastArrowOffset, lastFreezeOffset);

  const sections = [];

  for (let i = 0; i < totalSongHeight; i += SECTION_SIZE_IN_MEASURES) {
    sections.push(
      <StepchartSection
        key={i}
        chart={chart}
        arrowSize={ARROW_HEIGHT}
        speedMod={speedmod}
        startOffset={i}
        endOffset={Math.min(totalSongHeight, i + SECTION_SIZE_IN_MEASURES)}
      />
    );
  }

  return (
    <Root
      className={styles.rootPrint}
      title={`${
        simfile.title.translitTitleName || simfile.title.titleName
      } ${currentType.replace(/-/g, ", ")}`}
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
      <div className="w-screen -mx-4 bg-focal-300 sticky top-0 z-10 shadow-lg sm:hidden">
        <Banner
          className={clsx(
            styles.hideForPrint,
            "mx-auto border-b-4 border-white w-full absolute top-0 left-0"
          )}
          title={simfile.title}
        />
      </div>
      <ImageFrame
        className={clsx(
          styles.hideForPrint,
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
            )}
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
      <div className="grid place-items-center">
        <div
          className={clsx(styles.stepchartSections, styles[singleDoubleClass])}
        >
          {sections}
        </div>
      </div>
    </Root>
  );
}

export { StepchartPage };
export type { StepchartPageProps };
