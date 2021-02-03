import React, { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./StepchartPage.module.css";
import { ArrowSvg, ArrowSvgProps } from "./ArrowSvg";

type StepchartPageProps = Stepchart & {
  currentType: string;
};

function StepchartPage({ title, currentType, arrows }: StepchartPageProps) {
  const isSingle = currentType.includes("single");
  const singleDoubleClass = isSingle ? "single" : "double";

  const ARROW_HEIGHT = isSingle ? 80 : 40;

  const offsets = {
    4: ARROW_HEIGHT,
    6: (ARROW_HEIGHT * 2) / 3,
    8: ARROW_HEIGHT / 2,
    12: ARROW_HEIGHT / 3,
    16: ARROW_HEIGHT / 4,
  };

  let offset = 0;
  let arrowSeen = true;

  const arrowDivs = arrows[currentType].map((a) => {
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
        key={offset}
        className={clsx(
          styles.arrow,
          styles[`beat-${a.beat}`],
          "absolute text-xs"
        )}
        style={{
          top: offset,
        }}
      >
        {arrowSvgs}
      </div>
    );
    offset += offsets[a.measureBeatHeight as 4 | 8 | 16];
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
          }
        )}
        style={{ left: 0, top: i * ARROW_HEIGHT }}
      />
    );
  }

  return (
    <div className="w-full sm:max-w-4xl mx-auto flex flex-col items-center bg-red-100">
      <div className="w-full sm:w-auto text-center">
        {title.banner && (
          <img
            className="w-full h-auto"
            src={require(`./bannerImages/${title.banner}`)}
          />
        )}
        <h1 className="text-3xl mt-4">{title.actualTitle}</h1>
        <h2 className="text-2xl">{currentType}</h2>
      </div>
      <div
        className={clsx(
          styles.container,
          styles[`container-${singleDoubleClass}`],
          "relative flex flex-col flex-wrap my-8"
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
  );
}

export { StepchartPage };
