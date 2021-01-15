import React from "react";
import clsx from "clsx";

import styles from "./StepchartPage.module.css";

type StepchartPageProps = Stepchart & {
  currentType: string;
};

const ARROW_HEIGHT = 50;

const offsets = {
  4: ARROW_HEIGHT,
  8: ARROW_HEIGHT / 2,
};

function StepchartPage({ title, currentType, arrows }: StepchartPageProps) {
  let offset = 0;

  let arrowSeen = false;

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
        className={clsx(styles.arrow, styles[a.direction])}
        style={{ top: offset - offsets[a.beat as 4 | 8] }}
      />
    );
  });

  return (
    <div>
      <h1>{title}</h1>
      <h2>{currentType}</h2>
      <div className="relative" style={{ height: offset }}>
        {arrowDivs}
      </div>
    </div>
  );
}

export { StepchartPage };
