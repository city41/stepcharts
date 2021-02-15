import { useState, useEffect } from "react";

type SortHookTitle = {
  title: {
    titleName: string;
    translitTitleName: string | null;
    titleDir: string;
    banner: string | null;
  };
  types: StepchartType[];
  displayBpm: string;
  stats: Stats;
};

const sorts = [
  "title",
  "bpm",
  "jumps",
  "drills",
  "freezes",
  "gallops",
  "stops",
];

function getMaxBpm(displayBpm: string): number {
  if (!isNaN(Number(displayBpm))) {
    return Number(displayBpm);
  }

  const range = displayBpm.split("-").map(Number);

  return Math.max(...range);
}

function getSortFunction(key: typeof sorts[number]) {
  switch (key) {
    case "title":
      return (a: SortHookTitle, b: SortHookTitle) => {
        return (a.title.translitTitleName || a.title.titleName)
          .toLowerCase()
          .localeCompare(
            (b.title.translitTitleName || b.title.titleName).toLowerCase()
          );
      };
    case "bpm":
      return (a: SortHookTitle, b: SortHookTitle) => {
        return getMaxBpm(b.displayBpm) - getMaxBpm(a.displayBpm);
      };

    default:
      return (a: SortHookTitle, b: SortHookTitle) => {
        return b.stats[key as keyof Stats] - a.stats[key as keyof Stats];
      };
  }
}

function useSort(titles: SortHookTitle[]) {
  const [sortedBy, _setSortBy] = useState(sorts[0]);

  function setSortBy(newSort: typeof sorts[number]) {
    window.history.replaceState(null, "", `?sort=${newSort}`);
    _setSortBy(newSort);
  }

  useEffect(() => {
    if (window.location.search) {
      const sort = window.location.search.split("=")[1];

      if (sort) {
        _setSortBy(sort);
      }
    }
  });

  const sortedTitles = titles.sort(getSortFunction(sortedBy));

  return { sortedBy, sorts, setSortBy, sortedTitles };
}

export { useSort };
