import React from "react";
import { ToggleBar } from "./ToggleBar";

type PageBarProps = {
  className?: string;
  pageCount: number;
  currentPageIndex: number;
  onGotoPage: (pageIndex: number) => void;
};

function PageBar({
  className,
  pageCount,
  currentPageIndex,
  onGotoPage,
}: PageBarProps) {
  const pageEls = [];

  for (let i = 0; i < pageCount; ++i) {
    pageEls.push(<div>{i + 1}</div>);
  }

  return (
    <ToggleBar
      className={className}
      checkedIndex={currentPageIndex}
      onToggle={onGotoPage}
      entries={pageEls}
      namespace="pageBar"
    />
  );
}

export { PageBar };
