import React, { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./StepchartPage.module.css";
import { ArrowSvg, ArrowSvgProps } from "./ArrowSvg";
import { Root } from "./layout/Root";
import { Banner } from "./Banner";
import { ImageFrame } from "./ImageFrame";

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
    <Root
      title={`${title.actualTitle} ${currentType.replace(/-/g, ", ")}`}
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <ImageFrame className="mb-8 sticky top-0 py-4 bg-focal grid place-items-center">
          <Banner banner={title.banner} />
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
