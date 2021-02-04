import React, { CSSProperties, useState } from "react";
import clsx from "clsx";

import styles from "./StepchartPage.module.css";
import { ArrowSvg, ArrowSvgProps } from "./ArrowSvg";
import { Root } from "./layout/Root";
import { Banner } from "./Banner";
import { ImageFrame } from "./ImageFrame";
import { Breadcrumbs } from "./Breadcrumbs";
import { TitleDetailsTable } from "./TitleDetailsTable";

type StepchartPageProps = {
  stepchart: Stepchart;
  currentType: string;
};

const ARROW_HEIGHT = 40;

function StepchartPage({ stepchart, currentType }: StepchartPageProps) {
  const [speedMod, setSpeedMod] = useState(1.5);
  const isSingle = currentType.includes("single");
  const singleDoubleClass = isSingle ? "single" : "double";

  const offsets = {
    4: ARROW_HEIGHT,
    6: (ARROW_HEIGHT * 2) / 3,
    8: ARROW_HEIGHT / 2,
    12: ARROW_HEIGHT / 3,
    16: ARROW_HEIGHT / 4,
  };

  let offset = 0;
  let arrowSeen = true;

  const arrowDivs = stepchart.arrows[currentType].map((a, index) => {
    // for now, skip the empty intro
    arrowSeen =
      arrowSeen || (a.direction !== "0000" && a.direction !== "00000000");
    if (!arrowSeen) {
      return null;
    }

    const arrowSvgs = [];

    for (let i = 0; i < a.direction.length; ++i) {
      if (a.direction[i] !== "0") {
        arrowSvgs.push(
          <ArrowSvg
            key={i}
            size={ARROW_HEIGHT}
            position={i as ArrowSvgProps["position"]}
            beat={a.beat}
          />
        );
      }
    }

    const el = (
      <div
        key={index}
        className={clsx(
          styles.arrow,
          styles[`beat-${a.beat}`],
          "absolute text-xs transition-all ease-in-out duration-500"
        )}
        style={{
          top: offset,
        }}
      >
        {arrowSvgs}
      </div>
    );
    offset += offsets[a.measureBeatHeight as 4 | 8 | 16] * speedMod;
    return el;
  });

  const barDivs = [];

  for (let i = 0; i < offset / ARROW_HEIGHT; ++i) {
    barDivs.push(
      <div
        key={i}
        className={clsx(
          styles.bar,
          "even:bg-blue-200 odd:bg-blue-100 w-full absolute",
          {
            "border-b border-black": (i + 1) % 4 === 0,
            "border-b border-blue-500 border-dashed": (i + 1) % 4 !== 0,
            hidden: (i + 1) % 4 !== 0 && speedMod !== 1,
          }
        )}
        style={{
          left: 0,
          top: i * ARROW_HEIGHT * speedMod,
          height: ARROW_HEIGHT * speedMod,
        }}
      />
    );
  }

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
        <ImageFrame className="mb-8 sticky top-0 z-10 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <Banner banner={stepchart.title.banner} />
          <TitleDetailsTable className="mt-4" stepchart={stepchart} />
          <div className="mt-6 bg-focal-400 text-focal-600 p-2 w-full">
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
            "relative flex flex-col bg-indigo-100"
          )}
          style={
            {
              height: offset,
              "--arrow-size": `${ARROW_HEIGHT}px`,
            } as CSSProperties
          }
        >
          {barDivs}
          {!isSingle && (
            <div className={styles.doubleDivider} style={{ height: offset }} />
          )}
          {arrowDivs}
        </div>
      </div>
    </Root>
  );
}

export { StepchartPage };
