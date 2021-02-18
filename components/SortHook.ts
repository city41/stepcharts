import { useState, useEffect, useMemo } from "react";

const sorts = [
  "title",
  "bpm",
  "jumps",
  "drills",
  "freezes",
  "gallops",
  "stops",
  "t.shifts",
];

type SortFunction<T> = (a: T, b: T) => number;
type GetSortFunction<T> = (key: typeof sorts[number]) => SortFunction<T>;

function useSort<T>(
  titles: T[],
  getSortFunction: GetSortFunction<T>,
  sortExcludes: string[] = []
) {
  const usedSorts = sorts.filter((s) => sortExcludes.indexOf(s) === -1);
  const [sortedBy, _setSortBy] = useState(usedSorts[0]);

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

  return { sortedBy, sorts: usedSorts, setSortBy, sortedTitles };
}

export { useSort };
