import React, { CSSProperties } from "react";
import clsx from "clsx";

import styles from "./FreezeBody.module.css";

type FreezeBodyProps = {
  className?: string;
  style?: CSSProperties;
  includeTail: boolean;
};

function FreezeBody({ className, style, includeTail }: FreezeBodyProps) {
  return (
    <div
      className={clsx(className, styles.root, {
        [styles.withTail]: includeTail,
        [styles.withoutTail]: !includeTail,
      })}
      style={style}
    />
  );
}

export { FreezeBody };
