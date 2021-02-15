import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useTable, useExpanded, usePagination, Row } from "react-table";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

import { Root } from "./layout/Root";

import styles from "./AllSongsPage.module.css";
import { shortMixNames } from "../lib/meta";
import { FilterInput } from "./FilterInput";
import { useSort } from "./SortHook";
import { SortBar } from "./SortBar";

type AllSongPageStepchartType = StepchartType & { stats: Stats };

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
  types: AllSongPageStepchartType[];
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

function getTypesToShow(
  sortedBy: string,
  types: AllSongPageStepchartType[]
): AllSongPageStepchartType[] {
  if (sortedBy in types[0].stats) {
    const maxType = types.reduce<AllSongPageStepchartType>(
      (champ, contender) => {
        const champValue = champ.stats[sortedBy as keyof Stats];
        const contenderValue = contender.stats[sortedBy as keyof Stats];

        if (champValue >= contenderValue) {
          return champ;
        }
        return contender;
      },
      types[0]
    );
    return [maxType];
  }

  return types;
}

function TitleSubRows({
  row,
  sortedBy,
}: {
  row: Row<AllSongsPageTitle>;
  sortedBy: string;
}) {
  const typesToShow = getTypesToShow(sortedBy, row.original.types);

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
            {typesToShow.map((t) => {
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

function getMaxBpm(displayBpm: string): number {
  if (!isNaN(Number(displayBpm))) {
    return Number(displayBpm);
  }

  const range = displayBpm.split("-").map(Number);

  return Math.max(...range);
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
        return getMaxBpm(b.displayBpm) - getMaxBpm(a.displayBpm);
      };

    default:
      return (a: AllSongsPageTitle, b: AllSongsPageTitle) => {
        const aStats = a.types.map((t) => t.stats[key as keyof Stats]);
        const bStats = b.types.map((t) => t.stats[key as keyof Stats]);

        return Math.max(...bStats) - Math.max(...aStats);
      };
  }
}

const dontExpandFor = ["title", "bpm", "stops"];

function AllSongsPage({ titles }: AllSongsPageProps) {
  const [filter, setFilter] = useState("");
  const { sortedBy, setSortBy, sorts, sortedTitles } = useSort(
    titles,
    getSortFunction
  );

  const currentTitles = useMemo(() => {
    if (!filter) {
      return sortedTitles;
    }

    const compare = filter.toLowerCase();

    return sortedTitles.filter((t) => {
      return (
        t.title.translitTitleName?.toLowerCase().includes(compare) ||
        t.title.titleName.toLowerCase().includes(compare) ||
        t.mix.mixName.toLowerCase().includes(compare) ||
        t.artist.toLowerCase().includes(compare)
      );
    });
  }, [filter, sortedTitles]);

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
    toggleAllRowsExpanded,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: currentTitles,
      initialState: { pageSize: 100, expanded: {} },
      getRowId: (row) => row.id.toString(),
    },
    useExpanded,
    usePagination
  );

  useEffect(() => {
    if (dontExpandFor.includes(sortedBy)) {
      toggleAllRowsExpanded(false);
    } else {
      toggleAllRowsExpanded(true);
    }
  }, [sortedBy]);

  return (
    <Root
      title="All Songs"
      metaDescription="All songs available at stepcharts.com"
    >
      <div className="mt-8">
        <div className="flex flex-row justify-items-stretch">
          <FilterInput
            value={filter}
            onChange={(newValue) => setFilter(newValue)}
          />
          <SortBar sorts={sorts} sortedBy={sortedBy} onSortChange={setSortBy} />
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
                        <td {...cell.getCellProps()} className={cell.column.id}>
                          {cell.render("Cell")}
                        </td>
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
