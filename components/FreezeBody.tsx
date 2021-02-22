import React from "react";
import clsx from "clsx";

import styles from "./FreezeBody.module.css";

type FreezeBodyProps = {
  includeTail: boolean;
};

function FreezeBody({ includeTail }: FreezeBodyProps) {
  return (
    <div
      className={clsx(styles.root, {
        [styles.withTail]: includeTail,
        [styles.withoutTail]: !includeTail,
      })}
    />
  );
}

export { FreezeBody };
