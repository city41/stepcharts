import React from "react";
import clsx from "clsx";
import { ImageFrame } from "./ImageFrame";
import { shortMixNames } from "../lib/meta";
import singleSvg from "./single.svg";
import doubleSvg from "./double.svg";

import styles from "./CompactCard.module.css";

type CompactCardProps = {
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
  bpm: number[];
  types: StepchartType[];
  hideMix?: boolean;
};

const modeSvgs = {
  single: singleSvg,
  double: doubleSvg,
};

const modeSvgWidths = {
  single: 18,
  double: 36,
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

const difficulties = {
  single: ["beginner", "basic", "difficult", "expert", "challenge"],
  double: ["basic", "difficult", "expert", "challenge"],
};

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
        "w-full grid text-white xtext-sm font-bold items-center justify-items-center"
      )}
      style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
    >
      <img src={singleSvg} width={18} />
      {types[0].mode === "double" && <img src={singleSvg} width={18} />}
      {difficulties[types[0].mode].map((d) => {
        const t = types.find((t) => t.difficulty === d);

        if (!t) {
          return <span className="text-gray-500">-</span>;
        }

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

function CompactCard({
  className,
  title,
  mix,
  bpm,
  types,
  hideMix,
}: CompactCardProps) {
  const bannerUrl = title.banner
    ? require(`./bannerImages/${title.banner}`)
    : null;

  return (
    <ImageFrame
      className={clsx(
        className,
        clsx(
          "flex flex-col bg-gray-900 overflow-hidden rounded-tl-2xl rounded-br-2xl"
        )
      )}
      customColor
    >
      <div
        className={clsx("grid bg-gray-600 items-center xpy-1 pl-3 xpr-1", {
          "pr-3": !!hideMix,
        })}
        style={{ gridTemplateColumns: "1fr max-content" }}
      >
        <div className="font-bold text-white">
          <a href={buildTitleUrl(mix, title)}>
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
          <div
            className="bg-cover border-b border-t border-white"
            style={{
              paddingTop: "calc(80 / 256 * 100%)",
              backgroundImage: `url(${bannerUrl})`,
            }}
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
  );
}

export { CompactCard };
