import React from "react";
import { useTable, useExpanded, usePagination, Row } from "react-table";

import { Root } from "./layout/Root";

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
  types: StepchartType[];
  displayBpm: string;
  stats: Stats;
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
];

function buildStepchartUrl(t: AllSongsPageTitle, type: StepchartType): string {
  return `/${t.mix.mixDir}/${t.title.titleDir}/${type.slug}`;
}

function TitleSubRows({ row }: { row: Row<AllSongsPageTitle> }) {
  return (
    <table>
      <tbody>
        {row.original.types.map((t) => {
          return (
            <tr key={t.slug}>
              <td>
                <a href={buildStepchartUrl(row.original, t)}>
                  {t.mode} {t.difficulty} - {t.feet}
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function AllSongsPage({ titles }: AllSongsPageProps) {
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
      data: titles,
      initialState: { pageSize: 50, expanded: { 3: true } },
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
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
                  {row.cells.map((cell: any) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                {row.isExpanded && <TitleSubRows row={row} />}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
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
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
