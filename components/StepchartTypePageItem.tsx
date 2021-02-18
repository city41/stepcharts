import React from "react";
import clsx from "clsx";

import singleSvg from "./single.svg";
import doubleSvg from "./double.svg";

import styles from "./difficultyBackgroundColors.module.css";

type StepchartTypePageItemProps = {
  className?: string;
  type: StepchartType;
  isLast?: boolean;
  showMode?: boolean;
};

const modeSvgs = {
  single: singleSvg,
  double: doubleSvg,
};

const modeSvgWidths = {
  single: 16,
  double: 32,
};

function StepchartTypePageItem({
  className,
  type,
  isLast,
  showMode,
}: StepchartTypePageItemProps) {
  return (
    <div
      className={clsx(className, styles.root, "grid grid-cols-2 bg-gray-900")}
    >
      <div
        className={clsx(
          "flex flex-row justify-between bg-focal-100 text-focal-700 p-2 border-b border-gray-900",
          { "border-none": isLast }
        )}
      >
        {showMode && (
          <img
            src={modeSvgs[type.mode]}
            width={modeSvgWidths[type.mode]}
            alt={`${type.mode} mode icon`}
          />
        )}
        <div className="text-right">{type.difficulty}</div>
      </div>
      <div
        className="px-2 flex-1 flex flex-row pr-3 items-center justify-start"
        aria-label={`difficulty rating of ${type.feet}`}
      >
        <div className={clsx(styles[type.difficulty], "w-7 h-7")} />
        <div className="ml-2 text-white">{type.feet}</div>
      </div>
    </div>
  );
}

export { StepchartTypePageItem };
