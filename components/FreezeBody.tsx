import React from "react";

import styles from "./FreezeBody.module.css";

type FreezeBodyProps = {
  direction: FreezeBody["direction"];
};

const repeatStyles = {
  0: styles.repeatLeft,
  1: styles.repeatDown,
  2: styles.repeatUp,
  3: styles.repeatRight,
  4: styles.repeatLeft,
  5: styles.repeatDown,
  6: styles.repeatUp,
  7: styles.repeatRight,
};

const tailStyles = {
  0: styles.tailLeft,
  1: styles.tailDown,
  2: styles.tailUp,
  3: styles.tailRight,
  4: styles.tailLeft,
  5: styles.tailDown,
  6: styles.tailUp,
  7: styles.tailRight,
};

function FreezeBody({ direction }: FreezeBodyProps) {
  return (
    <div className="w-full h-full">
      <div className={repeatStyles[direction]} />
      <div className={tailStyles[direction]} />
    </div>
  );
}

export { FreezeBody };
