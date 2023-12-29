import React, { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./FreezeBody.module.css";

type FreezeBodyProps = {
  className?: string;
  style?: CSSProperties;
  includeTail: boolean;
  endOffset?: number;
  inRangeStartOffset?: number;
};

function FreezeBody({
  className,
  style,
  includeTail,
  endOffset,
  inRangeStartOffset,
}: FreezeBodyProps) {
  return (
    <div
      data-endOffset={endOffset}
      data-inRangeStartOffset={inRangeStartOffset}
      data-includeTail={includeTail}
      className={clsx(className, styles.root, {
        [styles.withTail]: includeTail,
        [styles.withoutTail]: !includeTail,
      })}
      style={style}
    />
  );
}

export { FreezeBody };
