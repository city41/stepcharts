import React, { CSSProperties } from "react";
import clsx from "clsx";

import arrow4Svg from "./arrow4.svg";
import arrow6Svg from "./arrow6.svg";
import arrow8Svg from "./arrow8.svg";
import arrow16Svg from "./arrow16.svg";
import arrowShockSvg from "./arrowShock.svg";
import arrowFreezeSvg from "./arrowFreeze.svg";

import styles from "./ArrowImg.module.css";

type ArrowImgProps = {
  className?: string;
  style?: React.CSSProperties;
  position: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  beat: Arrow["beat"] | "shock" | "freeze";
};

const arrowClasses = {
  0: styles.left1,
  1: styles.down1,
  2: styles.up1,
  3: styles.right1,
  4: styles.left2,
  5: styles.down2,
  6: styles.up2,
  7: styles.right2,
};

const arrowImgs: Record<ArrowImgProps["beat"], string> = {
  4: arrow4Svg.src,
  6: arrow6Svg.src,
  8: arrow8Svg.src,
  12: arrow6Svg.src,
  16: arrow16Svg.src,
  shock: arrowShockSvg.src,
  freeze: arrowFreezeSvg.src,
};

function ArrowImg({ className, style, position, beat }: ArrowImgProps) {
  return (
    <img
      className={clsx(
        className,
        styles.arrowSvg,
        arrowClasses[position],
        styles[`beat${beat}`],
        "pointer-events-none"
      )}
      style={style}
      src={arrowImgs[beat]}
      alt={`${beat} arrow`}
      data-beat={beat}
    />
  );
}

export { ArrowImg };
export type { ArrowImgProps };
