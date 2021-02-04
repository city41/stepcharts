import React from "react";

type TitleDetailsTableProps = {
  className?: string;
  stepchart: Stepchart;
};

function Row({ name, value }: { name: string; value: string }) {
  return (
    <tr>
      <td className="text-right text-focal-400 pr-1">{name}</td>
      <td className="pl-1">{value}</td>
    </tr>
  );
}

function TitleDetailsTable({ className, stepchart }: TitleDetailsTableProps) {
  return (
    <table className={className}>
      <tbody>
        <Row name="BPM" value={stepchart.bpm.join(", ")} />
        <Row name="Artist" value={stepchart.artist} />
        <Row name="Mix" value={stepchart.mix.mixName} />
      </tbody>
    </table>
  );
}

export { TitleDetailsTable };
