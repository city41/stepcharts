import React, { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./StepchartPage.module.css";

type StepchartPageProps = Stepchart & {
  currentType: string;
};

const ARROW_HEIGHT = 25;

const offsets = {
  4: ARROW_HEIGHT,
  8: ARROW_HEIGHT / 2,
  16: ARROW_HEIGHT / 4,
};

function StepchartPage({ title, currentType, arrows }: StepchartPageProps) {
  let offset = 0;

  let arrowSeen = false;

  const isSingle = currentType.includes("single");
  const singleDoubleClass = isSingle ? "single" : "double";

  const arrowDivs = arrows[currentType].map((a) => {
    // for now, skip the empty intro
    arrowSeen = arrowSeen || a.direction !== "none";
    if (!arrowSeen) {
      return null;
    }

    offset += offsets[a.beat as 4 | 8];
    return (
      <div
        key={offset}
        className={clsx(
          styles.arrow,
          styles[a.direction],
          styles[`beat-${a.beat}`]
        )}
        style={{
          top: offset - offsets[a.beat as 4 | 8],
        }}
      />
    );
  });

  const barDivs = [];

  for (let i = 0; i < offset / ARROW_HEIGHT; ++i) {
    barDivs.push(
      <div
        key={i}
        className={clsx(
          styles.bar,
          "bg-blue-200 w-full border-b border-blue-500"
        )}
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
          "relative flex flex-col"
        )}
        style={
          {
            height: offset,
            "--arrow-size": `${ARROW_HEIGHT}px`,
          } as CSSProperties
        }
      >
        {barDivs}
        {arrowDivs}
      </div>
    </div>
  );
}

export { StepchartPage };
