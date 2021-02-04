import React, { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./ArrowSvg.module.css";

type ArrowSvgProps = {
  className?: string;
  size: number;
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

function ArrowSvg({ className, size, position, beat }: ArrowSvgProps) {
  return (
    <svg
      className={clsx(
        className,
        styles.arrowSvg,
        arrowClasses[position],
        styles[`beat${beat}`]
      )}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ "--arrow-size": `${size}px` } as CSSProperties}
    >
      <g>
        <path
          className={clsx(styles.outerBorder, "arrow-border")}
          d="M 48.986564,0 0,47.403201 v 12.89912 l 10.225258,10.281641 h 12.703525 l 9.087065,-9.136943 V 84.262264 L 47.667531,100 h 4.664938 L 67.984158,84.262264 V 61.447019 l 9.087056,9.136943 H 89.774743 L 100,60.302321 V 47.403201 L 51.013436,0 h -0.658357 -0.710388 z"
        />
        <path
          className={clsx(styles.arrowColor, "arrow-color")}
          d="M 48.438278,6.7345167 5.3447994,50.389939 v 8.519573 l 6.9163516,6.954489 h 9.587478 L 37.171254,50.456674 v 33.512139 l 11.087809,11.14893 h 1.805569 0.478452 1.805569 L 63.436462,83.968813 V 50.456674 l 15.322624,15.407327 h 9.587479 l 6.916351,-6.954489 V 50.389939 L 52.169438,6.7345167 h -0.732819 -0.867172 z"
        />
        <path
          className={styles.innerWhite}
          d="m 48.556907,58.245206 -4.23944,4.262821 v 17.13915 l 3.957085,3.978899 h 0.998063 1.779207 0.997834 l 3.957087,-3.978899 V 62.508027 L 51.76753,58.245206 h -0.947184 -1.316255 z"
        />
        <path
          className={styles.innerWhite}
          d="m 48.341615,35.403004 -4.019293,4.041456 v 19.462732 l 4.509765,-4.534396 h 0.249518 2.049306 0.249518 l 4.509767,4.534396 V 39.44446 L 51.8709,35.403004 h -0.710387 -2.10851 z"
        />
        <path
          className={styles.innerWhite}
          d="M 48.506959,15.383382 14.991941,49.083163 v 6.303651 h 5.53396 L 36.302233,39.523516 h 4.227642 l 8.05154,-8.096161 h 0.210429 2.464858 0.210431 l 8.051543,8.096161 h 4.227648 l 15.776331,15.863298 h 5.533959 V 49.083163 L 51.541589,15.383382 h -0.47359 -2.087465 z"
        />
      </g>
    </svg>
  );
}

export { ArrowSvg };
export type { ArrowSvgProps };
