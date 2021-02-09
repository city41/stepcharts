import React, { useState } from "react";
import { Root } from "./layout/Root";
import { ImSortAlphaAsc, ImSortAlphaDesc } from "react-icons/im";
import { CompactTitleCard } from "./CompactTitleCard";

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
  bpm: number[];
};

type AllSongsPageProps = {
  titles: AllSongsPageTitle[];
};

type Sorter = [string, "asc" | "desc"];

function buildTitleUrl(title: AllSongsPageProps["titles"][number]): string {
  return `/${title.mix.mixDir}/${title.title.titleDir}`;
}

function buildMixUrl(mix: AllSongsPageProps["titles"][number]["mix"]): string {
  return `/${mix.mixDir}`;
}

function getSorter([key, dir]: [string, "asc" | "desc"]) {
  switch (key) {
    case "mix":
      return (a: AllSongsPageTitle, b: AllSongsPageTitle) => {
        if (dir === "asc") {
          return a.mix.mixName.localeCompare(b.mix.mixName);
        } else {
          return b.mix.mixName.localeCompare(a.mix.mixName);
        }
      };
    case "title":
      return (a: AllSongsPageTitle, b: AllSongsPageTitle) => {
        if (dir === "asc") {
          return (a.title.translitTitleName || a.title.titleName).localeCompare(
            b.title.translitTitleName || b.title.titleName
          );
        } else {
          return (b.title.translitTitleName || b.title.titleName).localeCompare(
            a.title.translitTitleName || a.title.titleName
          );
        }
      };
  }
}

function AllSongsPage({ titles }: AllSongsPageProps) {
  const [sortBy, _setSortBy] = useState<Sorter>(["title", "asc"]);

  titles.sort(getSorter(sortBy));

  function setSortBy(key: string) {
    if (sortBy[0] === key) {
      _setSortBy([sortBy[0], sortBy[1] === "asc" ? "desc" : "asc"]);
    } else {
      _setSortBy([key, "asc"]);
    }
  }

  const SortIcon = sortBy[1] === "asc" ? ImSortAlphaAsc : ImSortAlphaDesc;

  return (
    <Root
      title="All Songs"
      metaDescription="All songs available at stepcharts.com"
      noBackgroundImage
    >
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
              bpm={t.bpm}
              types={t.types}
            />
          );
        })}
      </div>
    </Root>
  );
}

export { AllSongsPage };
export type { AllSongsPageProps };
