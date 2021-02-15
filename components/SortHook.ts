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

type SortFunction = (a: any, b: any) => number;
type GetSortFunction = (key: typeof sorts[number]) => SortFunction;

function useSort(titles: SortHookTitle[], getSortFunction: GetSortFunction) {
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
