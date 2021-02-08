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

function buildUrl(
  mix: CompactCardProps["mix"],
  title: CompactCardProps["title"]
): string {
  return `/${mix.mixDir}/${title.titleDir}`;
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
  types,
}: {
  className?: string;
  types: StepchartType[];
}) {
  if (types.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        className,
        "w-1/2 flex flex-col items-center place-content-stretch space-y-1"
      )}
    >
      <div className="text-black">{types[0].mode}</div>
      <div className="w-full flex flex-row items-stretch">
        {types.map((t) => {
          return (
            <div
              key={`${t.mode}-${t.difficulty}`}
              className={clsx(
                styles[t.difficulty],
                "w-full py-1 text-center bg-gray-900 font-bold"
              )}
            >
              {t.feet}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompactCard({ className, title, mix, bpm, types }: CompactCardProps) {
  return (
    <a href={buildUrl(mix, title)}>
      <ImageFrame
        className={clsx(className, "flex flex-col bg-gray-200")}
        customColor
      >
        <div
          className="grid bg-focal-400 items-center py-1 px-2"
          style={{ gridTemplateColumns: "1fr max-content" }}
        >
          <div className="font-bold text-white">
            {title.translitTitleName || title.titleName}
          </div>
          <div className="ml-2 px-2 py-0.5 bg-focal-700 text-xs text-white grid place-items-center xrounded-full">
            {shortMixNames[mix.mixDir]}
          </div>
        </div>

        <div className="flex flex-row justify-items-stretch pt-1 mx-2 mb-2 space-x-2">
          <Types types={types.filter((t) => t.mode === "single")} />
          <Types types={types.filter((t) => t.mode === "double")} />
        </div>
        <div className="text-gray-100 bg-gray-400 text-sm px-2 py-1 text-center flex flex-row justify-between">
          <div className="px-1 -ml-2 -my-1  bg-gray-900 text-gray-200 grid place-items-center">
            {getBpmRange(bpm)} bpm
          </div>
          <div>
            jmp <span className="font-bold">21</span>
          </div>
          <div>
            crs <span className="font-bold">40</span>
          </div>
          <div>
            drl <span className="font-bold">60</span>
          </div>
          <div>
            frz <span className="font-bold">30</span>
          </div>
          <div>
            glp <span className="font-bold">48</span>
          </div>
        </div>
      </ImageFrame>
    </a>
  );
}

export { CompactCard };
