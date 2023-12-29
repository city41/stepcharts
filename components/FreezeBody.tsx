import React, { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./FreezeBody.module.css";

type FreezeBodyProps = {
  className?: string;
  style?: CSSProperties;
  includeTail: boolean;
  direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

function FreezeBody({
  className,
  style,
  includeTail,
  direction,
}: FreezeBodyProps) {
  return (
    <div
      className={clsx(className, styles.root, {
        [styles[`withTail_${direction}`]]: includeTail,
        [styles.withoutTail]: !includeTail,
      })}
      style={style}
    />
  );
}

export { FreezeBody };
