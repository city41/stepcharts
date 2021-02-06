import React from "react";
import clsx from "clsx";

type TitleDetailsTableProps = {
  className?: string;
  stepchart: Stepchart;
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

function TitleDetailsTable({
  className,
  stepchart,
  children,
}: TitleDetailsTableProps) {
  return (
    <table className={clsx(className, "text-xs sm:text-base")}>
      <tbody>
        <TitleDetailsRow name="BPM" value={stepchart.bpm.join(", ")} />
        <TitleDetailsRow name="Artist" value={stepchart.artist} />
        <TitleDetailsRow name="Mix" value={stepchart.mix.mixName} />
        {children}
      </tbody>
    </table>
  );
}

export { TitleDetailsTable, TitleDetailsRow };
