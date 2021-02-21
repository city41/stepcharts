import React, { CSSProperties } from "react";
import clsx from "clsx";
import { FreezeBody } from "./FreezeBody";
import { GiStopSign } from "react-icons/gi";
import { ArrowImg, ArrowImgProps } from "./ArrowImg";

import styles from "./StepchartSection.module.css";

type StepchartSectionProps = {
  className?: string;
  chart: Stepchart;
  speedMod: number;
  startOffset: number;
  endOffset: number;
  zIndex: number;
};

const BPM_RANGE_COLOR = "rgba(100, 0, 60, 0.115)";

function StepchartSection({
  className,
  chart,
  speedMod,
  startOffset,
  endOffset,
  zIndex,
}: StepchartSectionProps) {
  const { arrows, freezes, bpm, stops } = chart;
  const isSingle = arrows[0].direction.length === 4;
  const singleDoubleClass = isSingle ? "single" : "double";

  const arrowImgs = [];

  for (let ai = arrows.length - 1; ai >= 0; --ai) {
    const a = arrows[ai];

    if (a.offset >= endOffset) {
      continue;
    }

    // moved past the current section? bail
    if (a.offset < startOffset) {
      break;
    }

    const isShockArrow = a.direction.indexOf("0") === -1;
    const isFreezeArrow = a.direction.indexOf("2") > -1;

    for (let i = 0; i < a.direction.length; ++i) {
      if (a.direction[i] !== "0") {
        arrowImgs.push(
          <ArrowImg
            key={`Arrow-${ai}-${i}`}
            className={clsx(styles.arrow, "absolute text-xs ease-in-out")}
            style={{
              top: `calc((${a.offset} - ${startOffset}) * var(--arrow-size) * 4 * ${speedMod})`,
            }}
            position={i as ArrowImgProps["position"]}
            beat={isShockArrow ? "shock" : isFreezeArrow ? "freeze" : a.beat}
          />
        );
      }
    }
  }

  const barDivs = [];

  for (let i = 0; i < (endOffset - startOffset) / 0.25; ++i) {
    barDivs.push(
      <div
        key={`barDiv-${i}`}
        className={clsx(styles.bar, "w-full absolute", {
          "border-b-2 border-indigo-400": (i + 1) % 4 === 0,
          "border-b border-blue-500 border-dashed": (i + 1) % 4 !== 0,
        })}
        style={{
          left: 0,
          top: `calc(${i} * var(--arrow-size) * ${speedMod} - ((var(--arrow-size) * ${speedMod}) - var(--arrow-size)) / 2)`,
          height: `calc(var(--arrow-size) * ${speedMod})`,
        }}
      />
    );
  }

  const freezeDivs = freezes.map((f) => {
    const inRangeStartOffset = Math.max(f.startOffset, startOffset);
    const inRangeEndOffset = Math.min(f.endOffset, endOffset);

    if (inRangeEndOffset < startOffset || inRangeStartOffset >= endOffset) {
      return null;
    }

    return (
      <div
        key={`${f.startOffset}-${f.direction}`}
        className={clsx("absolute")}
        style={{
          top: `calc(${
            inRangeStartOffset - startOffset
          } * var(--arrow-size) * 4 * ${speedMod} + var(--arrow-size) / 2)`,
          left: `calc(${f.direction} * var(--arrow-size))`,
          width: "var(--arrow-size)",
          height: `calc(${
            inRangeEndOffset - inRangeStartOffset
          } * var(--arrow-size) * 4 * ${speedMod} - var(--arrow-size) / 2 * ${speedMod})`,
        }}
      >
        <FreezeBody includeTail={f.endOffset <= endOffset} />
      </div>
    );
  });

  // const bpmRangeDivs = [];
  // const bpmLabelDivs = [];
  //
  // if (bpm.length > 1) {
  //   for (let i = 0; i < bpm.length; ++i) {
  //     const b = bpm[i];
  //
  //     const inRangeStartOffset = Math.max(b.startOffset, startOffset);
  //     const inRangeEndOffset = Math.min(b.endOffset ?? endOffset, endOffset);
  //
  //     if (inRangeStartOffset >= endOffset) {
  //       break;
  //     }
  //
  //     if (inRangeEndOffset < startOffset) {
  //       continue;
  //     }
  //
  //     const even = (i & 1) === 0;
  //
  //     bpmRangeDivs.push(
  //       <div
  //         key={b.startOffset}
  //         className={clsx("absolute left-0 w-full", {
  //           "border-t border-blue-500": even,
  //           "border-t border-difficult": !even,
  //         })}
  //         style={{
  //           backgroundColor: even ? "transparent" : BPM_RANGE_COLOR,
  //           top:
  //             b.startOffset * measureHeight * speedMod -
  //             (barHeight - arrowSize) / 2,
  //           height:
  //             ((b.endOffset ?? totalSongHeight) - b.startOffset) *
  //             measureHeight *
  //             speedMod,
  //         }}
  //       />
  //     );
  //
  //     bpmLabelDivs.push(
  //       <div
  //         key={b.startOffset}
  //         className="absolute flex flex-row justify-end"
  //         style={{
  //           top: Math.max(
  //             0,
  //             b.startOffset * measureHeight * speedMod -
  //               1 -
  //               (barHeight - arrowSize) / 2
  //           ),
  //           left: -100,
  //           width: 100,
  //         }}
  //       >
  //         <div
  //           className={clsx("text-white p-0.5 rounded-l-lg", {
  //             "bg-blue-500": even,
  //             "bg-difficult": !even,
  //           })}
  //           style={{ fontSize: "0.675rem" }}
  //         >
  //           {Math.round(b.bpm)}
  //         </div>
  //       </div>
  //     );
  //   }
  // }

  const stopLabels = stops.map((s) => {
    if (s.offset < startOffset || s.offset >= endOffset) {
      return null;
    }

    return (
      <GiStopSign
        key={s.offset}
        className="text-red-600 text-2xl absolute -right-7"
        style={{
          top: `calc(${
            s.offset - startOffset
          } * var(--arrow-size) * 4 * ${speedMod})`,
        }}
      />
    );
  });

  return (
    <div className={clsx(className, "relative")} style={{ zIndex }}>
      <div
        className={clsx(
          styles.container,
          styles[`container-${singleDoubleClass}`],
          "relative bg-indigo-100"
        )}
        style={
          {
            height: `calc((${endOffset} - ${startOffset}) * var(--arrow-size) * 4 * ${speedMod})`,
          } as CSSProperties
        }
      >
        {barDivs}
        {/*{bpmRangeDivs}*/}
        {freezeDivs}
        {!isSingle && <div className={clsx(styles.doubleDivider, "h-full")} />}
        {arrowImgs}
      </div>
      {/*{bpmLabelDivs}*/}
      {stopLabels}
    </div>
  );
}

export { StepchartSection };
