import React from "react";
import clsx from "clsx";

import styles from "./StepchartTypePageItem.module.css";

type StepchartTypePageItemProps = {
  className?: string;
  type: StepchartType;
  isLast: boolean;
};

function StepchartTypePageItem({
  className,
  type,
  isLast,
}: StepchartTypePageItemProps) {
  return (
    <div
      className={clsx(className, styles.root, "grid grid-cols-2 bg-gray-900")}
    >
      <div
        className={clsx(
          "p-2 text-right bg-focal-100 border-b border-gray-900",
          { "border-none": isLast }
        )}
      >
        {type.difficulty}
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
