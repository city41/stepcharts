import React, { CSSProperties, useState } from "react";
import clsx from "clsx";

import { ArrowSvg, ArrowSvgProps } from "./ArrowSvg";
import { FreezeBody } from "./FreezeBody";
import { Root } from "./layout/Root";
import { Banner } from "./Banner";
import { ImageFrame } from "./ImageFrame";
import { Breadcrumbs } from "./Breadcrumbs";
import { TitleDetailsTable, TitleDetailsRow } from "./TitleDetailsTable";

import styles from "./StepchartPage.module.css";

type StepchartPageProps = {
  stepchart: Stepchart;
  currentType: string;
};

const ARROW_HEIGHT = 40;
const MEASURE_HEIGHT = ARROW_HEIGHT * 4;

function StepchartPage({ stepchart, currentType }: StepchartPageProps) {
  const [speedMod, setSpeedMod] = useState(1);
  const isSingle = currentType.includes("single");
  const singleDoubleClass = isSingle ? "single" : "double";
  const currentTypeMeta = stepchart.availableTypes.find(
    (at) => at.slug === currentType
  )!;

  const { arrows, freezes } = stepchart.arrows[currentType];

  const arrowDivs = [];

  for (let ai = arrows.length - 1; ai >= 0; --ai) {
    const a = arrows[ai];
    const arrowSvgs = [];
    const isShockArrow = a.direction.indexOf("0") === -1;
    const isFreezeArrow = a.direction.indexOf("2") > -1;

    for (let i = 0; i < a.direction.length; ++i) {
      if (a.direction[i] !== "0") {
        arrowSvgs.push(
          <ArrowSvg
            key={i}
            size={ARROW_HEIGHT}
            position={i as ArrowSvgProps["position"]}
            beat={isShockArrow ? "shock" : isFreezeArrow ? "freeze" : a.beat}
          />
        );
      }
    }

    const el = (
      <div
        key={a.offset}
        className={clsx(
          styles.arrow,
          styles[`beat-${a.beat}`],
          "absolute text-xs transition-all ease-in-out duration-500"
        )}
        style={{
          top: a.offset * MEASURE_HEIGHT * speedMod,
        }}
      >
        {arrowSvgs}
      </div>
    );

    arrowDivs.push(el);
  }

  const barDivs = [];

  const barHeight = ARROW_HEIGHT * speedMod;
  const lastArrowOffset = (arrows[arrows.length - 1]?.offset ?? 0) + 0.25;
  const lastFreezeOffset = freezes[freezes.length - 1]?.endOffset ?? 0;
  const totalSongHeight =
    Math.max(lastArrowOffset, lastFreezeOffset) * MEASURE_HEIGHT * speedMod;

  for (let i = 0; i < totalSongHeight / barHeight; ++i) {
    barDivs.push(
      <div
        key={i}
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
          top: i * ARROW_HEIGHT * speedMod - (barHeight - ARROW_HEIGHT) / 2,
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
          top: f.startOffset * MEASURE_HEIGHT * speedMod + ARROW_HEIGHT / 2,
          left: f.direction * ARROW_HEIGHT,
          width: ARROW_HEIGHT,
          height:
            (f.endOffset - f.startOffset) * MEASURE_HEIGHT * speedMod -
            (ARROW_HEIGHT / 2) * speedMod,
        }}
      >
        <FreezeBody />
      </div>
    );
  });

  return (
    <Root
      title={`${stepchart.title.actualTitle} ${currentType.replace(
        /-/g,
        ", "
      )}`}
      subtitle={
        <Breadcrumbs
          stepchart={stepchart}
          leaf="chart"
          type={stepchart.availableTypes.find(
            (t) => currentType === `${t.mode}-${t.difficulty}`
          )}
        />
      }
      metaDescription={`${currentType.replace(/-/g, " ")} stepchart for ${
        stepchart.title.actualTitle
      }`}
    >
      <div className="sm:mt-16 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <ImageFrame className="z-10 mb-8 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <Banner
            banner={stepchart.title.banner}
            title={stepchart.title.actualTitle}
          />
          <TitleDetailsTable className="mt-4" stepchart={stepchart}>
            <TitleDetailsRow
              name="difficulty"
              value={`${currentTypeMeta.difficulty} (${currentTypeMeta.feet})`}
            />
          </TitleDetailsTable>
          <div className="hidden sm:block mt-6 bg-focal-400 text-focal-600 p-2 w-full">
            <h3 className="font-bold text-white">speedmod</h3>
            <div className="flex flex-row justify-around space-x-6">
              {[1, 1.5, 2, 3].map((sm) => {
                const id = `speedmod-${sm}`;
                return (
                  <div
                    key={sm}
                    className="flex flex-row items-center space-x-1"
                  >
                    <input
                      id={id}
                      type="radio"
                      value={sm}
                      checked={sm === speedMod}
                      onChange={() => setSpeedMod(sm)}
                    />
                    <label className="cursor-pointer" htmlFor={id}>
                      {sm}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </ImageFrame>
        <div
          className={clsx(
            styles.container,
            styles[`container-${singleDoubleClass}`],
            "relative flex flex-col bg-indigo-100 overflow-hidden"
          )}
          style={
            {
              height: totalSongHeight,
              "--arrow-size": `${ARROW_HEIGHT}px`,
            } as CSSProperties
          }
          role="image"
          aria-label={`${currentType} step chart for ${stepchart.title.actualTitle}`}
        >
          {barDivs}
          {freezeDivs}
          {!isSingle && (
            <div className={clsx(styles.doubleDivider, "h-full")} />
          )}
          {arrowDivs}
        </div>
      </div>
    </Root>
  );
}

export { StepchartPage };
