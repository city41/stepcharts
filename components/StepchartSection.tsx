import React, { CSSProperties } from "react";
import clsx from "clsx";
import { FreezeBody } from "./FreezeBody";
import { GiStopSign } from "react-icons/gi";
import { ArrowImg, ArrowImgProps } from "./ArrowImg";

import styles from "./StepchartSection.module.css";

type StepchartSectionProps = {
  className?: string;
  style?: CSSProperties;
  chart: Stepchart;
  speedMod: number;
  startOffset: number;
  endOffset: number;
};

const BPM_RANGE_COLOR = "rgba(100, 0, 60, 0.115)";

function StepchartSection({
  className,
  style,
  chart,
  speedMod,
  startOffset,
  endOffset,
}: StepchartSectionProps) {
  const { arrows, freezes, bpm, stops } = chart;

  const isSingle = arrows[0].direction.length === 4;
  const singleDoubleClass = isSingle ? "single" : "double";

  const barHeight = `var(--arrow-size) * ${speedMod}`;
  const measureHeight = `${barHeight} * 4`;
  const arrowAdjustment = `(${barHeight} - var(--arrow-size)) /2`;

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
              top: `calc((${a.offset} - ${startOffset}) * ${measureHeight} + ${arrowAdjustment})`,
            }}
            position={i as ArrowImgProps["position"]}
            beat={isShockArrow ? "shock" : isFreezeArrow ? "freeze" : a.beat}
          />
        );
      }
    }
  }

  const barDivs = [];

  for (let i = 0; i < Math.ceil(endOffset - startOffset) / 0.25; ++i) {
    const height = `calc(${barHeight})`;

    barDivs.push(
      <div
        key={`barDiv-${i}`}
        className={clsx(styles.bar, {
          "border-b-2 border-indigo-400": (i + 1) % 4 === 0,
          "border-b border-blue-500 border-dashed": (i + 1) % 4 !== 0,
        })}
        style={{
          height,
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

    const hasHead = f.startOffset >= startOffset && f.startOffset < endOffset;
    const hasTail = f.endOffset <= endOffset;

    // this is because freezes need to start halfway down their corresponding arrow
    const freezeOffset = `var(--arrow-size) / 2`;

    return (
      <div
        key={`${f.startOffset}-${f.direction}`}
        className={clsx("absolute")}
        data-hasHead={hasHead}
        style={{
          top: `calc(${inRangeStartOffset - startOffset}  * ${measureHeight} ${
            hasHead ? `+ ${freezeOffset} + ${arrowAdjustment}` : ""
          })`,
          left: `calc(${f.direction} * var(--arrow-size))`,
          width: "var(--arrow-size)",
          height: `calc(${
            inRangeEndOffset - inRangeStartOffset
          } * ${measureHeight} ${
            hasHead ? `- ${freezeOffset} * ${speedMod}` : ""
          })`,
        }}
      >
        <FreezeBody includeTail={hasTail} />
      </div>
    );
  });

  const bpmRangeDivs = [];
  const bpmLabelDivs = [];

  if (bpm.length > 1) {
    for (let i = 0; i < bpm.length; ++i) {
      const b = bpm[i];

      const inRangeStartOffset = Math.max(b.startOffset, startOffset);
      const inRangeEndOffset = Math.min(b.endOffset ?? endOffset, endOffset);

      if (inRangeStartOffset >= endOffset) {
        break;
      }

      if (inRangeEndOffset < startOffset) {
        continue;
      }

      const even = (i & 1) === 0;

      // if this bpm range is continuing from a previous section,
      // don't put the upper border
      const startsInThisSection =
        b.startOffset >= startOffset && b.startOffset < endOffset;

      bpmRangeDivs.push(
        <div
          key={b.startOffset}
          className={clsx("absolute left-0 w-full", {
            "border-t": startsInThisSection,
            "border-blue-500": even,
            "border-difficult": !even,
          })}
          style={{
            backgroundColor: even ? "transparent" : BPM_RANGE_COLOR,
            top: `calc(${inRangeStartOffset - startOffset} * ${measureHeight})`,
            height: `calc(${
              inRangeEndOffset - inRangeStartOffset
            } * ${measureHeight})`,
          }}
        />
      );

      // push negative starts to zero, as they still need to be seen
      const normalizedStartOffset = Math.max(0, b.startOffset);

      if (
        normalizedStartOffset >= startOffset &&
        normalizedStartOffset < endOffset
      ) {
        bpmLabelDivs.push(
          <div
            key={b.startOffset}
            className="absolute flex flex-row justify-end"
            style={{
              top: `calc(${
                inRangeStartOffset - startOffset
              } * ${measureHeight})`,
              left: -100,
              width: 100,
            }}
          >
            <div
              className={clsx("text-white p-0.5 rounded-l-lg", {
                "bg-blue-500": even,
                "bg-difficult": !even,
              })}
              style={{ fontSize: "0.675rem" }}
            >
              {Math.round(b.bpm)}
            </div>
          </div>
        );
      }
    }
  }

  const stopLabels = stops.map((s) => {
    if (s.offset < startOffset || s.offset >= endOffset) {
      return null;
    }

    return (
      <GiStopSign
        key={s.offset}
        className="text-red-600 text-2xl absolute -right-7"
        style={{
          top: `calc(${s.offset - startOffset} * ${measureHeight})`,
        }}
      />
    );
  });

  return (
    <div
      className={clsx(className, "relative", {
        "border-b-4 border-yellow-400": process.env.NODE_ENV !== "production",
      })}
      style={style}
    >
      <div
        className={clsx(
          styles.container,
          styles[`container-${singleDoubleClass}`],
          "relative bg-indigo-100"
        )}
        style={
          {
            height: `calc(${Math.ceil(
              endOffset - startOffset
            )} * ${measureHeight})`,
          } as CSSProperties
        }
      >
        {barDivs}
        {bpmRangeDivs}
        {freezeDivs}
        {!isSingle && <div className={clsx(styles.doubleDivider, "h-full")} />}
        {arrowImgs}
      </div>
      {bpmLabelDivs}
      {stopLabels}
    </div>
  );
}

export { StepchartSection };
