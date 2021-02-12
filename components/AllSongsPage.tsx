import React from "react";
import { useTable } from "react-table";

import { Root } from "./layout/Root";

type AllSongsPageTitle = {
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
    Header: "Title",
    accessor: (t: AllSongsPageTitle) =>
      t.title.translitTitleName || t.title.titleName,
  },
  {
    Header: "Mix",
    accessor: (t: AllSongsPageTitle) => t.mix.mixName,
  },
];

function AllSongsPage({ titles }: AllSongsPageProps) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: titles,
  });

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
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
