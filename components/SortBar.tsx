import React from "react";
import { ToggleBar } from "./ToggleBar";

type SortBarProps = {
  className?: string;
  sorts: string[];
  sortedBy: string;
  onSortChange: (newSort: string) => void;
};

function SortBar({ className, sorts, sortedBy, onSortChange }: SortBarProps) {
  return (
    <ToggleBar
      className={className}
      namespace="sortBar"
      entries={sorts.map((s) => (
        <div key={s} className="text-lg">
          {s}
        </div>
      ))}
      onToggle={(i) => onSortChange(sorts[i])}
      checkedIndex={sorts.indexOf(sortedBy)}
    />
  );
}

export { SortBar };
