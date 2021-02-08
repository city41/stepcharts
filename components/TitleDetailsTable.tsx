import React from "react";
import clsx from "clsx";

type TitleDetailsTableProps = {
  className?: string;
  children?: React.ReactNode;
};

function TitleDetailsRow({ name, value }: { name: string; value: string }) {
  return (
    <tr>
      <td className="text-right text-focal-400 pr-1">{name}</td>
      <td className="pl-1">{value}</td>
    </tr>
  );
}

function TitleDetailsTable({ className, children }: TitleDetailsTableProps) {
  return (
    <table className={clsx(className, "text-xs sm:text-base")}>
      <tbody>{children}</tbody>
    </table>
  );
}

export { TitleDetailsTable, TitleDetailsRow };
