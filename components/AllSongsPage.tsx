import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { useTable, useExpanded, usePagination, Row } from "react-table";

import { Root } from "./layout/Root";

import styles from "./AllSongsPage.module.css";

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
  types: Array<StepchartType & { stats: Stats }>;
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
        {row.isExpanded ? "👇" : "👉"}
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
    accessor: (t: AllSongsPageTitle) => t.mix.mixName,
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

function TitleSubRows({ row }: { row: Row<AllSongsPageTitle> }) {
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
            {row.original.types.map((t) => {
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

function AllSongsPage({ titles }: AllSongsPageProps) {
  const [filter, setFilter] = useState("");

  const currentTitles = useMemo(() => {
    if (!filter) {
      return titles;
    }

    const compare = filter.toLowerCase();

    return titles.filter((t) => {
      return (
        t.title.translitTitleName?.toLowerCase().includes(compare) ||
        t.title.titleName.toLowerCase().includes(compare) ||
        t.mix.mixName.toLowerCase().includes(compare)
      );
    });
  }, [filter]);

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
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: currentTitles,
      initialState: { pageSize: 50, expanded: { 3000: true } },
      getRowId: (row) => row.id.toString(),
    },
    useExpanded,
    usePagination
  );

  return (
    <Root
      title="All Songs"
      metaDescription="All songs available at stepcharts.com"
    >
      <input
        type="text"
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
      />
      <table {...getTableProps()} className={clsx(styles.table, "table-fixed")}>
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
                {row.isExpanded && <TitleSubRows row={row} />}
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
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
