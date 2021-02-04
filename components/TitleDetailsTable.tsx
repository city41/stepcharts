import React from "react";

type TitleDetailsTableProps = {
  className?: string;
  mix: Mix;
};

function TitleDetailsTable({ className, mix }: TitleDetailsTableProps) {
  return (
    <table>
      <tbody>
        <tr>
          <td>Artist</td>
          <td>TaQ</td>
        </tr>
        <tr>
          <td>Mix</td>
          <td>{mix.mixName}</td>
        </tr>
      </tbody>
    </table>
  );
}

export { TitleDetailsTable };
