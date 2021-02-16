import React from "react";
import clsx from "clsx";
import { MdFilterList } from "react-icons/md";

type FilterInputProps = {
  className?: string;
  value: string;
  onChange: (newValue: string) => void;
};

function FilterInput({ className, value, onChange }: FilterInputProps) {
  return (
    <div
      className={clsx(
        className,
        "flex flex-row items-center border border-focal-400 rounded-xl h-8 overflow-hidden bg-focal-50"
      )}
    >
      <MdFilterList className="w-10 text-xl text-focal-500" />
      <input
        className="w-full h-full outline-none"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  );
}

export { FilterInput };
