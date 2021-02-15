import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { useTable, useExpanded, usePagination, Cell, Row } from "react-table";
import Slider from "@material-ui/core/Slider";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import debounce from "lodash.debounce";

import { Root } from "./layout/Root";

import { shortMixNames } from "../lib/meta";
import { FilterInput } from "./FilterInput";
import { useSort } from "./SortHook";
import { SortBar } from "./SortBar";

import styles from "./AllSongsPage.module.css";
import difficultyBgStyles from "./difficultyBackgroundColors.module.css";

type AllSongsPageStepchartType = StepchartType & { stats: Stats };

type AllSongsPageTitle = {
  id: number;
  title: {
    titleName: string;
    translitTitleName: string | null;
    titleDir: string;
    banner: string | null;
  };
  mix: {
    mixName: string;
    mixDir: string;
  };
  types: AllSongsPageStepchartType[];
  artist: string;
  displayBpm: string;
  stopCount: number;
  tempoShiftCount: number;
};

type AllSongsPageProps = {
  titles: AllSongsPageTitle[];
};

const columns = [
  {
    // Make an expander cell
    Header: () => null, // No header
    id: "expander", // It needs an ID
    Cell: ({ row }: { row: Row<AllSongsPageTitle> }) => (
      // Use Cell to render an expander for each row.
      // We can use the getToggleRowExpandedProps prop-getter
      // to build the expander.
      <span {...row.getToggleRowExpandedProps()}>
        {row.isExpanded ? <MdExpandMore /> : <MdExpandLess />}
      </span>
    ),
    // We can override the cell renderer with a SubCell to be used with an expanded row
    SubCell: () => null, // No expander on an expanded row
  },
  {
    Header: "Title",
    accessor: (t: AllSongsPageTitle) =>
      t.title.translitTitleName || t.title.titleName,
  },
  {
    Header: "Mix",
    accessor: (t: AllSongsPageTitle) => shortMixNames[t.mix.mixDir],
  },
  {
    Header: "Artist",
    accessor: (t: AllSongsPageTitle) => t.artist,
  },
  {
    Header: "bpm",
    accessor: (t: AllSongsPageTitle) => t.displayBpm,
  },
  {
    Header: "tempo shifts",
    accessor: (t: AllSongsPageTitle) => t.tempoShiftCount || "-",
  },
  {
    Header: "stops",
    accessor: (t: AllSongsPageTitle) => t.stopCount || "-",
  },
];

function buildStepchartUrl(t: AllSongsPageTitle, type: StepchartType): string {
  return `/${t.mix.mixDir}/${t.title.titleDir}/${type.slug}`;
}

function sortTypes(
  types: AllSongsPageStepchartType[],
  sortBy: string
): AllSongsPageStepchartType[] {
  if (sortBy in types[0].stats) {
    return [...types].sort(
      (a: AllSongsPageStepchartType, b: AllSongsPageStepchartType) => {
        const aValue = a.stats[sortBy as keyof Stats];
        const bValue = b.stats[sortBy as keyof Stats];

        return bValue - aValue;
      }
    );
  }

  return [...types];
}

function TitleSubRows({
  row,
  sortedBy,
}: {
  row: Row<AllSongsPageTitle>;
  sortedBy: string;
}) {
  const sortedTypes = sortTypes(row.original.types, sortedBy);

  return (
    <tr>
      <td colSpan={6} className="p-4 bg-indigo-700 text-indigo-100">
        <table className="w-full">
          <thead>
            <tr>
              <td>Difficulty</td>
              {Object.keys(row.original.types[0].stats).map((k) => (
                <td key={k}>{k}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTypes.map((t) => {
              return (
                <tr key={t.slug}>
                  <td>
                    <a href={buildStepchartUrl(row.original, t)}>
                      {t.mode} {t.difficulty} - {t.feet}
                    </a>
                  </td>
                  {Object.keys(t.stats).map((k) => (
                    <td key={k}>{t.stats[k as keyof Stats]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </td>
    </tr>
  );
}

function getMinBpm(displayBpm: string): number | "*" {
  if (displayBpm === "*") {
    return "*";
  }

  if (!isNaN(Number(displayBpm))) {
    return Number(displayBpm);
  }

  const range = displayBpm.split("-").map(Number);

  return Math.min(...range);
}

function getMaxBpm(displayBpm: string): number | "*" {
  if (displayBpm === "*") {
    return "*";
  }

  if (!isNaN(Number(displayBpm))) {
    return Number(displayBpm);
  }

  const range = displayBpm.split("-").map(Number);

  return Math.max(...range);
}

function getMaxBpmForAllTitles(titles: AllSongsPageTitle[]): number {
  const bpms = titles.reduce<number[]>((building, t) => {
    const maxBpmForTitle = getMaxBpm(t.displayBpm);

    if (maxBpmForTitle === "*") {
      return building;
    }

    if (isNaN(maxBpmForTitle)) {
      return building;
    }
    return building.concat(maxBpmForTitle);
  }, []);

  return Math.max(...bpms);
}

function getSortFunction(key: string) {
  switch (key) {
    case "title":
      return (a: AllSongsPageTitle, b: AllSongsPageTitle) => {
        return (a.title.translitTitleName || a.title.titleName)
          .toLowerCase()
          .localeCompare(
            (b.title.translitTitleName || b.title.titleName).toLowerCase()
          );
      };
    case "bpm":
      return (a: AllSongsPageTitle, b: AllSongsPageTitle) => {
        const aMax =
          a.displayBpm === "*" ? 999999 : (getMaxBpm(a.displayBpm) as number);
        const bMax =
          b.displayBpm === "*" ? 999999 : (getMaxBpm(b.displayBpm) as number);

        return bMax - aMax;
      };

    default:
      return (a: AllSongsPageTitle, b: AllSongsPageTitle) => {
        const aStats = a.types.map((t) => t.stats[key as keyof Stats]);
        const bStats = b.types.map((t) => t.stats[key as keyof Stats]);

        return Math.max(...bStats) - Math.max(...aStats);
      };
  }
}

function isSortingOnStats(sortKey: string, title: AllSongsPageTitle): boolean {
  return sortKey in title.types[0].stats;
}

function depluralize(s: string, count: number): string {
  if (count === 1) {
    return s.substring(0, s.length - 1);
  }

  return s;
}

function TopStatLink({
  className,
  title,
  stat,
}: {
  className?: string;
  title: AllSongsPageTitle;
  stat: keyof Stats;
}) {
  const topType = title.types.reduce<AllSongsPageStepchartType>(
    (champ, contender) => {
      const champValue = champ.stats[stat];
      const contenderValue = contender.stats[stat];

      if (champValue >= contenderValue) {
        return champ;
      }

      return contender;
    },
    title.types[0]
  );

  const topStatValue = topType.stats[stat];

  return (
    <a
      className={clsx(className, difficultyBgStyles[topType.difficulty])}
      href={buildStepchartUrl(title, topType)}
    >
      {topStatValue} {depluralize(stat, topStatValue)}
    </a>
  );
}

function AllSongsPageCell({
  row,
  cell,
  sortedBy,
}: {
  row: Row<AllSongsPageTitle>;
  cell: Cell<AllSongsPageTitle>;
  sortedBy: string;
}) {
  if (cell.column.id === "Title" && isSortingOnStats(sortedBy, row.original)) {
    return (
      <td {...cell.getCellProps()}>
        <div className="flex flex-row items-center justify-between pr-2">
          <div>{cell.render("Cell")}</div>
          <TopStatLink
            className="whitespace-nowrap px-1 py-0.5 text-xs text-white"
            title={row.original}
            stat={sortedBy as keyof Stats}
          />
        </div>
      </td>
    );
  }

  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
}

function AllSongsPage({ titles }: AllSongsPageProps) {
  const maxBpm = getMaxBpmForAllTitles(titles);
  const [filter, setFilter] = useState("");
  const [curBpmRange, setCurBpmRange] = useState([0, maxBpm]);
  const { sortedBy, setSortBy, sorts, sortedTitles } = useSort(
    titles,
    getSortFunction
  );

  const debouncedSetCurBpmRange = useMemo(
    () => debounce(setCurBpmRange, 1000),
    [setCurBpmRange]
  );

  const currentTitles = useMemo(() => {
    let filteredTitles = sortedTitles;

    if (filter.trim()) {
      const compare = filter.trim().toLowerCase();

      filteredTitles = sortedTitles.filter((t) => {
        return (
          t.title.translitTitleName?.toLowerCase().includes(compare) ||
          t.title.titleName.toLowerCase().includes(compare) ||
          t.mix.mixName.toLowerCase().includes(compare) ||
          t.artist.toLowerCase().includes(compare)
        );
      });
    }

    if (curBpmRange[0] > 0 || curBpmRange[1] < maxBpm) {
      filteredTitles = filteredTitles.filter((t) => {
        return (
          t.displayBpm === "*" ||
          (getMinBpm(t.displayBpm) >= curBpmRange[0] &&
            getMaxBpm(t.displayBpm) <= curBpmRange[1])
        );
      });
    }

    return filteredTitles;
  }, [filter, sortedTitles, curBpmRange, maxBpm]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: currentTitles,
      initialState: { pageSize: 500, expanded: {} },
      getRowId: (row) => row.id.toString(),
    },
    useExpanded,
    usePagination
  );

  return (
    <Root
      title="All Songs"
      metaDescription={`All ${titles.length} songs available at stepcharts.com`}
    >
      <div className="mt-8">
        <div className={styles.controlsContainer}>
          <div>Filter</div>
          <div>Sort</div>
          <div>BPM range</div>
          <FilterInput
            value={filter}
            onChange={(newValue) => setFilter(newValue)}
          />
          <SortBar sorts={sorts} sortedBy={sortedBy} onSortChange={setSortBy} />
          <Slider
            value={curBpmRange}
            max={maxBpm}
            min={0}
            onChange={(_e, r) => debouncedSetCurBpmRange(r as number[])}
            valueLabelDisplay="on"
            aria-labelledby="range-slider"
            getAriaValueText={(v) => `${v}bpm`}
          />
        </div>
        <div>{currentTitles.length} matching songs</div>
        <table
          {...getTableProps()}
          className={clsx(styles.table, "table-fixed")}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className={column.id}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <React.Fragment key={rowProps.key}>
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <AllSongsPageCell
                          key={cell.getCellProps().key}
                          row={row}
                          cell={cell}
                          sortedBy={sortedBy}
                        />
                      );
                    })}
                  </tr>
                  {row.isExpanded && (
                    <TitleSubRows row={row} sortedBy={sortedBy} />
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {pageCount > 1 && (
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>{" "}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>{" "}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>{" "}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>{" "}
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
          </div>
        )}
      </div>
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
