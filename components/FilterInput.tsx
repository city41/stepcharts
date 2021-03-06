import React from "react";
import clsx from "clsx";
import { MdClose, MdFilterList } from "react-icons/md";

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
        "flex flex-row items-center border border-focal-400 rounded-xl h-10 overflow-hidden bg-focal-50"
      )}
    >
      <MdFilterList className="w-10 text-xl text-focal-500" />
      <input
        className="w-full h-full outline-none bg-transparent"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
      <MdClose
        className="w-10 text-xl text-focal-500 cursor-pointer"
        onClick={() => onChange("")}
      />
    </div>
  );
}

export { FilterInput };
