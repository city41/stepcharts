import React from "react";
import clsx from "clsx";

import { Foot } from "./Foot";
import { ImageFrame } from "./ImageFrame";

import styles from "./StepchartTypePageItem.module.css";

type StepchartTypePageItemProps = {
  className?: string;
  type: StepchartType;
};

function StepchartTypePageItem({
  className,
  type,
}: StepchartTypePageItemProps) {
  return (
    <ImageFrame className={clsx(className, styles.root)}>
      <div className="grid grid-cols-2">
        <div className="p-2 text-right">{type.difficulty}</div>
        <div
          className="px-2 flex-1 flex flex-row bg-gray-900 pr-3 items-center justify-start"
          aria-label={`difficulty rating of ${type.feet}`}
        >
          <Foot difficulty={type.difficulty} />
          <div className="ml-2">{type.feet}</div>
        </div>
      </div>
    </ImageFrame>
  );
}

export { StepchartTypePageItem };
