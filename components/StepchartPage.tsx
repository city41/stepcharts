import React, { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./StepchartPage.module.css";

type StepchartPageProps = Stepchart & {
  currentType: string;
};

const ARROW_HEIGHT = 20;

const offsets = {
  4: ARROW_HEIGHT,
  8: ARROW_HEIGHT / 2,
  16: ARROW_HEIGHT / 4,
};

function StepchartPage({ title, currentType, arrows }: StepchartPageProps) {
  let offset = 0;

  let arrowSeen = true;

  const isSingle = currentType.includes("single");
  const singleDoubleClass = isSingle ? "single" : "double";

  const arrowDivs = arrows[currentType].map((a) => {
    // for now, skip the empty intro
    arrowSeen = arrowSeen || a.direction !== "none";
    if (!arrowSeen) {
      return null;
    }

    const el = (
      <div
        key={offset}
        className={clsx(
          styles.arrow,
          styles[a.direction],
          styles[`beat-${a.beat}`],
          "text-xs"
        )}
        style={{
          top: offset,
        }}
      />
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
    <div>
      <h1>{title}</h1>
      <h2>{currentType}</h2>
      <div
        className={clsx(
          styles.container,
          styles[`container-${singleDoubleClass}`],
          "relative flex flex-col flex-wrap"
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
