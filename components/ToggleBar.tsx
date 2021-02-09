import React, { ReactNode } from "react";
import clsx from "clsx";

import styles from "./ToggleBar.module.css";

type ToggleBarProps = {
  className?: string;
  namespace: string;
  entries: ReactNode[];
  onToggle: (index: number) => void;
  checkedIndex: number;
};

function ToggleBar({
  className,
  namespace,
  entries,
  onToggle,
  checkedIndex,
}: ToggleBarProps) {
  return (
    <div className={clsx(className, styles.root, "flex flex-row")}>
      {entries.map((entry, i) => {
        const id = `toggle-${namespace}-${i}`;
        return (
          <>
            <input
              key={i}
              type="radio"
              name={namespace}
              id={id}
              checked={i === checkedIndex}
              onChange={() => onToggle(i)}
            />
            <label htmlFor={id}>{entry}</label>
          </>
        );
      })}
    </div>
  );
}

export { ToggleBar };
