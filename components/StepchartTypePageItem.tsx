import React from "react";
import clsx from "clsx";

type StepchartTypePageItemProps = {
  className?: string;
  type: StepchartType;
};

import singleSvg from "./single.svg";
import doubleSvg from "./double.svg";
import { Foot } from "./Foot";
import { PageItem } from "./PageItem";

const imgSrcs: Record<string, string> = {
  single: singleSvg,
  double: doubleSvg,
};

function StepchartTypePageItem({
  className,
  type,
}: StepchartTypePageItemProps) {
  const feets = [];

  for (let i = 0; i < type.feet; ++i) {
    feets.push(<Foot key={i} difficulty={type.difficulty} />);
  }

  return (
    <PageItem
      className={clsx(className)}
      title={type.difficulty}
      supplementary={type.mode}
    >
      <div className="flex flex-row space-x-2">
        <img
          src={imgSrcs[type.mode]}
          alt={type.mode}
          width={100}
          height="auto"
        />
        <div className="flex-1 flex flex-row bg-gray-900 p-1 items-center justify-center">
          {feets}
          <div className="ml-2">{type.feet}</div>
        </div>
      </div>
    </PageItem>
  );
}

export { StepchartTypePageItem };
