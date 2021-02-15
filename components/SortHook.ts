import { useState, useEffect, useMemo } from "react";

const sorts = [
  "title",
  "bpm",
  "jumps",
  "drills",
  "freezes",
  "gallops",
  "stops",
];

type SortFunction<T> = (a: T, b: T) => number;
type GetSortFunction<T> = (key: typeof sorts[number]) => SortFunction<T>;

function useSort<T>(titles: T[], getSortFunction: GetSortFunction<T>) {
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
  }, []);

  const sortedTitles = useMemo(() => {
    // sort() sorts in place, so forcing a new array
    return [...titles].sort(getSortFunction(sortedBy));
  }, [sortedBy]);

  return { sortedBy, sorts, setSortBy, sortedTitles };
}

export { useSort };
