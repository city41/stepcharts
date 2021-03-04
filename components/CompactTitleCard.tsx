import React from "react";
import clsx from "clsx";
import { GiStopSign } from "react-icons/gi";

import { ImageFrame } from "./ImageFrame";
import { shortMixNames } from "../lib/meta";
import singleSvg from "./single.svg";
import doubleSvg from "./double.svg";

import styles from "./CompactTitleCard.module.css";
import { Banner } from "./Banner";

type CompactTitleCardProps = {
  className?: string;
  title: {
    titleName: string;
    translitTitleName: string | null;
    titleDir: string;
    banner: string | null;
  };
  mix: {
    mixName: string;
    mixDir: string;
  };
  displayBpm: string;
  types: StepchartType[];
  hideMix?: boolean;
  stats: Stats;
};

const modeSvgs = {
  single: singleSvg,
  double: doubleSvg,
};

const modeSvgWidths = {
  single: 18,
  double: 39,
};

function buildTitleUrl(
  mix: CompactTitleCardProps["mix"],
  title: CompactTitleCardProps["title"]
): string {
  return `/${mix.mixDir}/${title.titleDir}`;
}

function buildStepchartUrl(
  mix: CompactTitleCardProps["mix"],
  title: CompactTitleCardProps["title"],
  type: StepchartType
): string {
  return `/${mix.mixDir}/${title.titleDir}/${type.mode}-${type.difficulty}`;
}

const difficulties = {
  single: ["beginner", "basic", "difficult", "expert", "challenge"],
  double: ["basic", "difficult", "expert", "challenge"],
};

function Types({
  mix,
  title,
  types,
}: {
  mix: CompactTitleCardProps["mix"];
  title: CompactTitleCardProps["title"];
  types: StepchartType[];
}) {
  if (types.length === 0) {
    return null;
  }

  const { mode } = types[0];

  return (
    <div
      className={clsx(
        "w-full flex flex-row justify-around text-white font-bold items-center"
      )}
    >
      <img src={modeSvgs[mode]} width={modeSvgWidths[mode]} />
      {difficulties[mode].map((d) => {
        const t = types.find((t) => t.difficulty === d);

        if (!t) {
          return (
            <div key={`${mode}-${d}`} className="text-gray-500">
              -
            </div>
          );
        }

        return (
          <a
            href={buildStepchartUrl(mix, title, t)}
            key={`${mode}-${d}`}
            className={clsx(
              styles[t.difficulty],
              "block hover:bg-gray-600 transform hover:scale-150 w-6 h-6 text-center"
            )}
          >
            {t.feet}
          </a>
        );
      })}
    </div>
  );
}

function CompactTitleCard({
  className,
  title,
  mix,
  displayBpm,
  types,
  stats,
  hideMix,
}: CompactTitleCardProps) {
  return (
    <ImageFrame
      className={clsx(
        className,
        clsx(
          "flex flex-col bg-gray-900 overflow-hidden rounded-tl-2xl rounded-br-2xl"
        )
      )}
    >
      <div
        className={clsx("grid bg-gray-600 items-center xpy-1 pl-3 xpr-1", {
          "pr-3": !!hideMix,
        })}
        style={{ gridTemplateColumns: "1fr max-content" }}
      >
        <div>
          <a
            href={buildTitleUrl(mix, title)}
            className="inline-block font-bold text-white px-1"
          >
            {title.translitTitleName || title.titleName}
          </a>
        </div>
        {!hideMix && (
          <div
            className="ml-2 px-2 py-0.5 bg-gray-400 text-xs text-gray-800 grid place-items-center rounded-bl-lg mb-2"
            style={{ alignSelf: "start" }}
          >
            <a href={`/${mix.mixDir}`}>{shortMixNames[mix.mixDir]}</a>
          </div>
        )}
      </div>

      <div className="pb-2 xpx-3">
        <a href={buildTitleUrl(mix, title)}>
          <Banner
            className="w-full h-full border-b border-t border-white"
            title={title}
          />
        </a>
      </div>

      <div className="flex flex-row justify-items-stretch xmx-2 xmy-2 p-2 pt-0">
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
      <div className="text-gray-100 bg-gray-400 text-sm px-2 pr-4 py-1 text-center flex flex-row justify-between">
        <div className="px-2 -ml-2 -my-1  bg-gray-700 text-gray-200 grid place-items-center">
          <div>
            <span className="font-bold">{displayBpm}</span>
          </div>
        </div>
        <div>
          Jmp <span className="font-bold">{stats.jumps}</span>
        </div>
        {/*<div>*/}
        {/*  C <span className="font-bold">{stats.crossovers}</span>*/}
        {/*</div>*/}
        <div>
          Jck <span className="font-bold">{stats.jacks}</span>
        </div>
        <div>
          Frz <span className="font-bold">{stats.freezes}</span>
        </div>
        <div>
          Glp <span className="font-bold">{stats.gallops}</span>
        </div>
      </div>
    </ImageFrame>
  );
}

export { CompactTitleCard };
