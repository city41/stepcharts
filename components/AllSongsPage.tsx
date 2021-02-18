import React, { useMemo, useRef, useState } from "react";
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
import { PageBar } from "./PageBar";

import styles from "./AllSongsPage.module.css";
import difficultyBgStyles from "./difficultyBackgroundColors.module.css";
import { ImageFrame } from "./ImageFrame";
import { StepchartTypePageItem } from "./StepchartTypePageItem";

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
  minBpm: number;
  maxBpm: number;
  filterString: string;
  stopCount: number;
  tempoShiftCount: number;
};

type AllSongsPageProps = {
  titles: AllSongsPageTitle[];
};

function buildStepchartUrl(t: AllSongsPageTitle, type: StepchartType): string {
  return `/${t.mix.mixDir}/${t.title.titleDir}/${type.slug}`;
}

function buildTitleUrl(t: AllSongsPageTitle): string {
  return `/${t.mix.mixDir}/${t.title.titleDir}`;
}

function buildMixUrl(t: AllSongsPageTitle): string {
  return `/${t.mix.mixDir}`;
}

function Null() {
  return <span className="text-focal-300">-</span>;
}

const columns = [
  {
    Header: () => null, // No header
    id: "expander",
    Cell: ({ row }: { row: Row<AllSongsPageTitle> }) => (
      <div
        {...row.getToggleRowExpandedProps()}
        className="grid place-items-center w-8 h-full hover:bg-focal-200 text-2xl"
      >
        {row.isExpanded ? <MdExpandMore /> : <MdExpandLess />}
      </div>
    ),
  },
  {
    Header: "Title",
    accessor: (t: AllSongsPageTitle) => (
      <a className="hover:underline" href={buildTitleUrl(t)}>
        {t.title.translitTitleName || t.title.titleName}
      </a>
    ),
  },
  {
    Header: "Mix",
    accessor: (t: AllSongsPageTitle) => (
      <a className="hover:underline" href={buildMixUrl(t)}>
        {shortMixNames[t.mix.mixDir]}
      </a>
    ),
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
    accessor: (t: AllSongsPageTitle) => t.tempoShiftCount || <Null />,
  },
  {
    Header: "stops",
    accessor: (t: AllSongsPageTitle) => t.stopCount || <Null />,
  },
];

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
  const maxStat = Math.max(
    ...row.original.types.map((t) => t.stats[sortedBy as keyof Stats])
  );
  return (
    <tr>
      <td colSpan={7} className="text-focal-100" style={{ padding: 0 }}>
        <table className={clsx(styles.innerTable, "w-full")}>
          <thead>
            <tr className="bg-focal-50 text-focal-700">
              <th className="w-2/6"></th>
              {Object.keys(row.original.types[0].stats).map((k) => (
                <th key={k} className="text-left py-2 w-1/6">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {row.original.types.map((t, i) => {
              return (
                <tr key={t.slug}>
                  <td className="pl-16 py-2">
                    <a
                      className="block"
                      href={buildStepchartUrl(row.original, t)}
                    >
                      <StepchartTypePageItem type={t} showMode />
                    </a>
                  </td>
                  {Object.keys(t.stats).map((k) => (
                    <td
                      key={k}
                      className={clsx({
                        [`inline-block px-1 py-4 -mx-1 text-white ${
                          difficultyBgStyles[t.difficulty]
                        }`]:
                          t.stats[k as keyof Stats] === maxStat &&
                          sortedBy === k,
                      })}
                    >
                      {t.stats[k as keyof Stats]}
                    </td>
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

function getMaxBpmForAllTitles(titles: AllSongsPageTitle[]): number {
  const bpms = titles.map((t) => t.maxBpm);
  return Math.round(Math.max(...bpms));
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
        return b.maxBpm - a.maxBpm;
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

function ThumbComponent(props: any) {
  return (
    <div
      {...props}
      className="absolute top-0 w-8 h-6 inline-block bg-focal-50 rounded-lg text-focal-500 text-xs grid place-items-center"
    >
      {props["aria-valuenow"]}
    </div>
  );
}

type Filter = {
  bpm: [number, number];
  text: string;
};

const AllSongsTable = React.memo(function AllSongsTable({
  titles,
  totalTitleCount,
  filter,
  sortedBy,
}: {
  titles: AllSongsPageTitle[];
  totalTitleCount: number;
  filter: Filter;
  sortedBy: string;
}) {
  const maxBpm = useRef(filter.bpm[1]);

  const currentTitles = useMemo(() => {
    let currentTitles = titles;

    if (filter.text.trim()) {
      const compare = filter.text.trim().toLowerCase();

      currentTitles = currentTitles.filter((t) => {
        return t.filterString.includes(compare);
      });
    }

    if (filter.bpm[0] > 0 || filter.bpm[1] < maxBpm.current) {
      currentTitles = currentTitles.filter((t) => {
        if (t.minBpm === t.maxBpm) {
          return filter.bpm[0] <= t.minBpm && filter.bpm[1] >= t.minBpm;
        } else {
          return (
            (filter.bpm[0] <= t.minBpm && filter.bpm[1] >= t.minBpm) ||
            (filter.bpm[0] <= t.maxBpm && filter.bpm[1] >= t.maxBpm)
          );
        }
      });
    }

    return currentTitles;
  }, [titles, filter, sortedBy]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: currentTitles,
      initialState: {
        pageSize: 100,
        expanded: {},
      },
      getRowId: (row) => row.id.toString(),
    },
    useExpanded,
    usePagination
  );

  return (
    <>
      <div className="my-6 ml-8">
        {currentTitles.length === totalTitleCount ? (
          <span>{currentTitles.length} total songs</span>
        ) : (
          <span>
            <span className="font-bold">{currentTitles.length}</span> songs
            matching{" "}
            <span className="text-focal-400">
              (out of {totalTitleCount} total)
            </span>
          </span>
        )}
      </div>
      <table
        {...getTableProps()}
        className={clsx(styles.table, "table-fixed")}
        cellPadding={0}
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
        <div className="my-4 flex flex-row items-center justify-center space-x-2">
          <div className="text-sm">pages</div>
          <PageBar
            pageCount={pageCount}
            currentPageIndex={pageIndex}
            onGotoPage={gotoPage}
          />
        </div>
      )}
    </>
  );
});

function AllSongsPage({ titles }: AllSongsPageProps) {
  const maxBpm = getMaxBpmForAllTitles(titles);
  const [textFilter, _setTextFilter] = useState("");
  const [curBpmRange, _setCurBpmRange] = useState<[number, number]>([
    0,
    maxBpm,
  ]);
  const { sortedBy, setSortBy, sorts, sortedTitles } = useSort(
    titles,
    getSortFunction
  );

  const [currentFilter, setCurrentFilter] = useState<Filter>({
    bpm: curBpmRange,
    text: textFilter,
  });

  const debouncedSetCurrentFilter = useMemo(() => {
    return debounce(setCurrentFilter, 200);
  }, [setCurrentFilter]);

  function setCurBpmRange(newRange: [number, number]) {
    _setCurBpmRange(newRange);
    debouncedSetCurrentFilter((f) => {
      return {
        ...f,
        bpm: newRange,
      };
    });
  }

  function setTextFilter(newText: string) {
    _setTextFilter(newText);
    debouncedSetCurrentFilter((f) => {
      return {
        ...f,
        text: newText,
      };
    });
  }

  return (
    <Root
      title="All Songs"
      metaDescription={`All ${titles.length} songs available at stepcharts.com`}
    >
      <noscript>
        <div className="bg-red-200 text-red-900 w-96 p-2 m-2 mt-8 mx-auto text-center">
          This page requires JavaScript to be enabled
        </div>
      </noscript>
      <ImageFrame className="grid grid-cols-1 sm:grid-cols-4 mt-0 gap-y-4 sm:gap-x-2 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 w-full p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl">
        <div className="sm:col-span-1">
          <div className="text-xs ml-2">Filter</div>
          <FilterInput
            value={textFilter}
            onChange={(newValue) => setTextFilter(newValue)}
          />
        </div>
        <div className="sm:col-span-2 sm:justify-self-center">
          <div className="text-xs ml-2">Sort</div>
          <SortBar sorts={sorts} sortedBy={sortedBy} onSortChange={setSortBy} />
        </div>
        <div className="sm:col-span-1 pr-8">
          <div className="text-xs ml-2">BPM</div>
          <Slider
            classes={{ rail: styles.sliderRail, track: styles.sliderTrack }}
            value={curBpmRange}
            max={maxBpm}
            min={0}
            step={10}
            onChange={(_e, r) => setCurBpmRange(r as [number, number])}
            valueLabelDisplay="off"
            ThumbComponent={ThumbComponent}
            aria-labelledby="range-slider"
            getAriaValueText={(v) => `${v}bpm`}
          />
        </div>
      </ImageFrame>
      <AllSongsTable
        titles={sortedTitles}
        totalTitleCount={titles.length}
        filter={currentFilter}
        sortedBy={sortedBy}
      />
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
