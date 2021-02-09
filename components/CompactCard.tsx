import React from "react";
import clsx from "clsx";
import { ImageFrame } from "./ImageFrame";
import { shortMixNames } from "../lib/meta";

import styles from "./CompactCard.module.css";

type CompactCardProps = {
  className?: string;
  title: {
    titleName: string;
    translitTitleName: string | null;
    titleDir: string;
  };
  mix: {
    mixName: string;
    mixDir: string;
  };
  bpm: number[];
  types: StepchartType[];
};

function buildTitleUrl(
  mix: CompactCardProps["mix"],
  title: CompactCardProps["title"]
): string {
  return `/${mix.mixDir}/${title.titleDir}`;
}

function buildStepchartUrl(
  mix: CompactCardProps["mix"],
  title: CompactCardProps["title"],
  type: StepchartType
): string {
  return `/${mix.mixDir}/${title.titleDir}/${type.mode}-${type.difficulty}`;
}

function getBpmRange(bpm: number[]) {
  const min = Math.min(...bpm);
  const max = Math.max(...bpm);

  if (min === max) {
    return min;
  }

  return `${min}-${max}`;
}

function Types({
  className,
  mix,
  title,
  types,
}: {
  className?: string;
  mix: CompactCardProps["mix"];
  title: CompactCardProps["title"];
  types: StepchartType[];
}) {
  if (types.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        className,
        "w-full bg-gray-900 grid text-white font-bold items-center justify-items-center"
      )}
      style={{ gridAutoFlow: "column" }}
    >
      <div>{types[0].mode[0].toUpperCase()}</div>
      {types.map((t) => {
        return (
          <div
            key={`${t.mode}-${t.difficulty}`}
            className={clsx(styles[t.difficulty])}
          >
            <a href={buildStepchartUrl(mix, title, t)}>{t.feet}</a>
          </div>
        );
      })}
    </div>
  );
}

function CompactCard({ className, title, mix, bpm, types }: CompactCardProps) {
  return (
    <div>
      <ImageFrame
        className={clsx(className, "flex flex-col bg-gray-200")}
        customColor
      >
        <div
          className="grid bg-focal-400 items-start xpy-1 pl-3 pr-1"
          style={{ gridTemplateColumns: "1fr max-content" }}
        >
          <div className="font-bold text-white py-2">
            <a href={buildTitleUrl(mix, title)}>
              {title.translitTitleName || title.titleName}
            </a>
          </div>
          <div className="ml-2 px-2 py-0.5 bg-focal-700 text-xs text-white grid place-items-center rounded-b-lg">
            <a href={`/${mix.mixDir}`}>{shortMixNames[mix.mixDir]}</a>
          </div>
        </div>

        <div className="flex flex-row justify-items-stretch xmx-2 xmy-2 xspace-x-0.5">
          <Types
            mix={mix}
            title={title}
            types={types.filter((t) => t.mode === "single")}
          />
          <Types
            mix={mix}
            title={title}
            types={types.filter((t) => t.mode === "double")}
          />
        </div>
        <div className="text-gray-100 bg-gray-400 text-sm px-2 py-1 text-center flex flex-row justify-between">
          <div className="px-2 -ml-2 -my-1  bg-gray-700 text-gray-200 grid place-items-center">
            <div>
              <span className="font-bold">{getBpmRange(bpm)}</span>
            </div>
          </div>
          <div>
            J <span className="font-bold">21</span>
          </div>
          <div>
            C <span className="font-bold">40</span>
          </div>
          <div>
            D <span className="font-bold">60</span>
          </div>
          <div>
            F <span className="font-bold">30</span>
          </div>
          <div>
            G <span className="font-bold">48</span>
          </div>
        </div>
      </ImageFrame>
    </div>
  );
}

export { CompactCard };
