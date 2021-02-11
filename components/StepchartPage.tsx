import React, { CSSProperties, useState } from "react";
import clsx from "clsx";
import { GiStopSign } from "react-icons/gi";

import { ArrowImg } from "./ArrowImg";
import type { ArrowImgProps } from "./ArrowImg";
import { FreezeBody } from "./FreezeBody";
import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Breadcrumbs } from "./Breadcrumbs";
import { TitleDetailsTable, TitleDetailsRow } from "./TitleDetailsTable";
import { ToggleBar } from "./ToggleBar";

import styles from "./StepchartPage.module.css";

type StepchartPageProps = {
  stepchart: Simfile;
  currentType: string;
};

const ARROW_HEIGHT = 40;
const MEASURE_HEIGHT = ARROW_HEIGHT * 4;

const BPM_RANGE_COLOR = "rgba(100, 0, 60, 0.115)";

const speedmods = [1, 1.5, 2, 3];

function StepchartPage({ stepchart, currentType }: StepchartPageProps) {
  const [speedmod, setSpeedmod] = useState(speedmods[0]);
  const isSingle = currentType.includes("single");
  const singleDoubleClass = isSingle ? "single" : "double";
  const currentTypeMeta = stepchart.availableTypes.find(
    (at) => at.slug === currentType
  )!;

  const { arrows, freezes, bpm, stops } = stepchart.charts[currentType];

  const arrowImgs = [];

  for (let ai = arrows.length - 1; ai >= 0; --ai) {
    const a = arrows[ai];
    const isShockArrow = a.direction.indexOf("0") === -1;
    const isFreezeArrow = a.direction.indexOf("2") > -1;

    for (let i = 0; i < a.direction.length; ++i) {
      if (a.direction[i] !== "0") {
        arrowImgs.push(
          <ArrowImg
            key={`Arrow-${ai}-${i}`}
            className={clsx(styles.arrow, "absolute text-xs ease-in-out")}
            style={{
              top: a.offset * MEASURE_HEIGHT * speedmod,
              transition: "top 500ms",
            }}
            size={ARROW_HEIGHT}
            position={i as ArrowImgProps["position"]}
            beat={isShockArrow ? "shock" : isFreezeArrow ? "freeze" : a.beat}
          />
        );
      }
    }
  }

  const barDivs = [];

  const barHeight = ARROW_HEIGHT * speedmod;
  const lastArrowOffset = (arrows[arrows.length - 1]?.offset ?? 0) + 0.25;
  const lastFreezeOffset = freezes[freezes.length - 1]?.endOffset ?? 0;
  const totalSongHeight =
    Math.max(lastArrowOffset, lastFreezeOffset) * MEASURE_HEIGHT * speedmod;

  for (let i = 0; i < totalSongHeight / barHeight; ++i) {
    barDivs.push(
      <div
        key={`barDiv-${i}`}
        className={clsx(
          styles.bar,
          "even:bg-blue-200 odd:bg-blue-100 w-full absolute transition-all ease-in-out duration-500",
          {
            "border-b border-black": (i + 1) % 4 === 0,
            "border-b border-blue-500 border-dashed": (i + 1) % 4 !== 0,
          }
        )}
        style={{
          left: 0,
          top: i * ARROW_HEIGHT * speedmod - (barHeight - ARROW_HEIGHT) / 2,
          height: barHeight,
        }}
      />
    );
  }

  const freezeDivs = freezes.map((f) => {
    return (
      <div
        key={`${f.startOffset}-${f.direction}`}
        className={clsx("absolute transition-all ease-in-out duration-500")}
        style={{
          top: f.startOffset * MEASURE_HEIGHT * speedmod + ARROW_HEIGHT / 2,
          left: f.direction * ARROW_HEIGHT,
          width: ARROW_HEIGHT,
          height:
            (f.endOffset - f.startOffset) * MEASURE_HEIGHT * speedmod -
            (ARROW_HEIGHT / 2) * speedmod,
        }}
      >
        <FreezeBody />
      </div>
    );
  });

  const bpmRangeDivs = [];
  const bpmLabelDivs = [];

  if (bpm.length > 1) {
    for (let i = 0; i < bpm.length; ++i) {
      const even = (i & 1) === 0;
      const b = bpm[i];

      bpmRangeDivs.push(
        <div
          key={b.startOffset}
          className={clsx(
            "absolute left-0 w-full transition-all ease-in-out duration-500",
            {
              "border-t border-blue-500": even,
              "border-t border-difficult": !even,
            }
          )}
          style={{
            backgroundColor: even ? "transparent" : BPM_RANGE_COLOR,
            top:
              b.startOffset * MEASURE_HEIGHT * speedmod -
              (barHeight - ARROW_HEIGHT) / 2,
            height:
              ((b.endOffset ?? totalSongHeight) - b.startOffset) *
              MEASURE_HEIGHT *
              speedmod,
          }}
        />
      );

      bpmLabelDivs.push(
        <div
          key={b.startOffset}
          className="absolute flex flex-row justify-end transition-all ease-in-out duration-500"
          style={{
            top: Math.max(
              0,
              b.startOffset * MEASURE_HEIGHT * speedmod -
                1 -
                (barHeight - ARROW_HEIGHT) / 2
            ),
            left: -100,
            width: 100,
          }}
        >
          <div
            className={clsx("text-white p-0.5 rounded-l-lg", {
              "bg-blue-500": even,
              "bg-difficult": !even,
            })}
            style={{ fontSize: "0.675rem" }}
          >
            {Math.round(b.bpm)}
          </div>
        </div>
      );
    }
  }

  const stopLabels = stops.map((s) => {
    return (
      <GiStopSign
        key={s.offset}
        className="text-red-600 text-2xl absolute -right-7"
        style={{ top: s.offset * MEASURE_HEIGHT * speedmod }}
      />
    );
  });

  const bannerUrl = require(`./bannerImages/${stepchart.title.banner}`);

  return (
    <Root
      title={`${
        stepchart.title.translitTitleName || stepchart.title.titleName
      } ${currentType.replace(/-/g, ", ")}`}
      subheading={
        <Breadcrumbs
          crumbs={[
            {
              display: stepchart.mix.mixName,
              pathSegment: stepchart.mix.mixDir,
            },
            {
              display:
                stepchart.title.translitTitleName || stepchart.title.titleName,
              pathSegment: stepchart.title.titleDir,
            },
            {
              display: currentType.replace(/-/g, " "),
              pathSegment: currentType,
            },
          ]}
        />
      }
      metaDescription={`${currentType.replace(/-/g, " ")} stepchart for ${
        stepchart.title.translitTitleName || stepchart.title.titleName
      }`}
    >
      <div className="w-screen -mx-4 bg-focal-300 sticky top-0 z-10 shadow-lg sm:hidden">
        <div
          className="border-b-4 border-white w-full bg-no-repeat bg-cover mx-auto"
          style={{
            paddingTop: "calc(80 / 256 * 100%)",
            backgroundImage: `url(${bannerUrl})`,
          }}
          role="image"
          aria-label={`${
            stepchart.title.translitTitleName || stepchart.title.titleName
          } banner`}
        />
      </div>
      <ImageFrame className="relative mt-0 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 mb-8 sm:sticky sm:top-0 sm:z-10 p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl flex flex-col sm:flex-row items-center justify-center sm:justify-start sm:space-x-4">
        <div className="w-full sm:w-64">
          <div
            className="hidden sm:block border-2 border-white w-full bg-no-repeat bg-cover"
            style={{
              paddingTop: "calc(80 / 256 * 100%)",
              backgroundImage: `url(${bannerUrl})`,
            }}
            role="image"
            aria-label={`${
              stepchart.title.translitTitleName || stepchart.title.titleName
            } banner`}
          />
        </div>
        <div className="flex-1 flex flex-col sm:grid sm:grid-cols-2 space-y-2 sm:space-y-0">
          <TitleDetailsTable>
            {stepchart.title.translitTitleName && (
              <TitleDetailsRow
                name="Native title"
                value={stepchart.title.titleName}
              />
            )}
            <TitleDetailsRow name="BPM" value={stepchart.displayBpm} />
            <TitleDetailsRow
              name="Artist"
              value={stepchart.artist ?? "unknown"}
            />
            <TitleDetailsRow name="Mix" value={stepchart.mix.mixName} />
            <TitleDetailsRow
              name="difficulty"
              value={`${currentTypeMeta.difficulty} (${currentTypeMeta.feet})`}
            />
          </TitleDetailsTable>
          <div>
            <div className="sm:block text-sm ml-2 mb-1">speedmod</div>
            <ToggleBar
              namespace="speedmod"
              entries={speedmods.map((sm) => (
                <div key={sm} className="px-2">
                  {sm}
                </div>
              ))}
              onToggle={(i) => setSpeedmod(speedmods[i])}
              checkedIndex={speedmods.indexOf(speedmod)}
            />
          </div>
        </div>
      </ImageFrame>
      <div className="grid place-items-center">
        <div className="relative">
          <div
            className={clsx(
              styles.container,
              styles[`container-${singleDoubleClass}`],
              "relative bg-indigo-100 overflow-y-hidden"
            )}
            style={
              {
                height: totalSongHeight,
                "--arrow-size": `${ARROW_HEIGHT}px`,
              } as CSSProperties
            }
            role="img"
            aria-label={`${currentType} step chart for ${
              stepchart.title.translitTitleName || stepchart.title.titleName
            }`}
          >
            {barDivs}
            {bpmRangeDivs}
            {freezeDivs}
            {!isSingle && (
              <div className={clsx(styles.doubleDivider, "h-full")} />
            )}
            {arrowImgs}
          </div>
          {bpmLabelDivs}
          {stopLabels}
        </div>
      </div>
    </Root>
  );
}

export { StepchartPage };
