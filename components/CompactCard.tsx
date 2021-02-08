import React from "react";
import clsx from "clsx";
import { ImageFrame } from "./ImageFrame";

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

function CompactCard({ className, title, mix, bpm, types }: CompactCardProps) {
  return (
    <a href={buildUrl(mix, title)}>
      <ImageFrame className={clsx(className, "w-48")}>
        <div>{title.translitTitleName || title.titleName}</div>
        <div>
          <div>{mix.mixName}</div>
          <div>{bpm.join(", ")}</div>
        </div>
        <div>{types.length} types</div>
      </ImageFrame>
    </a>
  );
}

export { CompactCard };
