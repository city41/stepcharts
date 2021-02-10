import React, { useEffect, useState } from "react";
import { Root } from "./layout/Root";
import { CompactTitleCard } from "./CompactTitleCard";
import { ToggleBar } from "./ToggleBar";
import { ImageFrame } from "./ImageFrame";

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

const sorts = ["title", "jumps", "drills", "freezes", "gallops", "stops"];

function getSortFunction(key: typeof sorts[number]) {
  switch (key) {
    case "title":
      return (a: AllSongsPageTitle, b: AllSongsPageTitle) => {
        return (a.title.translitTitleName || a.title.titleName)
          .toLowerCase()
          .localeCompare(
            (b.title.translitTitleName || b.title.titleName).toLowerCase()
          );
      };
    default:
      return (a: AllSongsPageTitle, b: AllSongsPageTitle) => {
        return b.stats[key as keyof Stats] - a.stats[key as keyof Stats];
      };
  }
}

function AllSongsPage({ titles }: AllSongsPageProps) {
  const [sortBy, _setSortBy] = useState(0);

  function setSortBy(newSortBy: number) {
    window.history.replaceState(null, "", `?sort=${sorts[newSortBy]}`);
    _setSortBy(newSortBy);
  }

  useEffect(() => {
    if (window.location.search) {
      const sort = window.location.search.split("=")[1];

      if (sort) {
        const newSortBy = sorts.indexOf(sort.toLowerCase());
        _setSortBy(newSortBy);
      }
    }
  });

  titles.sort(getSortFunction(sorts[sortBy]));

  return (
    <Root
      title="All Songs"
      metaDescription="All songs available at stepcharts.com"
    >
      <ImageFrame className="mt-0 w-screen sm:w-auto border-none sm:border-solid sm:border-1 -mx-4 sm:mx-auto sm:mt-8 mb-8 sticky top-0 z-10 w-full p-4 bg-focal-300 sm:rounded-tl-xl sm:rounded-br-xl flex flex-col items-center justify-center sm:justify-start sm:space-x-4">
        <p className="p-2 mt-2 mb-4 bg-red-200 text-red-900">
          This page is still a work in progress and might not work well for you
          just yet.
        </p>
        <div className="hide-if-noscript flex flex-row sm:flex-col mt-2 sm:mt-0">
          <div className="hidden sm:block text-sm ml-2 mb-1">sort by</div>
          <ToggleBar
            namespace="mixSort"
            entries={sorts.map((s) => (
              <div key={s} className="text-sm sm:text-xl">
                {s}
              </div>
            ))}
            onToggle={(i) => setSortBy(i)}
            checkedIndex={sortBy}
          />
        </div>
      </ImageFrame>
      <div
        className="grid mt-8 items-start"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
          columnGap: "2rem",
          rowGap: "2rem",
        }}
      >
        {titles.map((t) => {
          return (
            <CompactTitleCard
              className="w-full h-auto"
              key={`${t.mix.mixDir}-${t.title.titleDir}`}
              title={t.title}
              mix={t.mix}
              displayBpm={t.displayBpm}
              types={t.types}
              stats={t.stats}
            />
          );
        })}
      </div>
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
