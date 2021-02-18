import React, { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

import styles from "./ToggleBar.module.css";

type ToggleBarProps = {
  className?: string;
  namespace: string;
  entries: ReactNode[];
  entryWidth?: string;
  onToggle: (index: number) => void;
  checkedIndex: number;
};

function ToggleBar({
  className,
  namespace,
  entries,
  entryWidth = "5rem",
  onToggle,
  checkedIndex,
}: ToggleBarProps) {
  const style = { "--entry-width": entryWidth } as CSSProperties;

  return (
    <div className={clsx(className, styles.root)} style={style}>
      {entries.map((entry, i) => {
        const id = `toggle-${namespace}-${i}`;
        return (
          <React.Fragment key={id}>
            <input
              type="radio"
              name={namespace}
              id={id}
              checked={i === checkedIndex}
              onChange={() => onToggle(i)}
            />
            <label htmlFor={id}>{entry}</label>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export { ToggleBar };
