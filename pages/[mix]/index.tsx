import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { getAllStepchartData } from "../../lib/getAllStepchartData";
import { MixPage } from "../../components/MixPage";
import type { MixPageProps } from "../../components/MixPage";
import { calculateStats } from "../../lib/calculateStats";

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allData = getAllStepchartData();

  return {
    paths: allData.map((mix) => ({ params: { mix: mix.mixDir } })),
    fallback: false,
  };
}

// used as the tie breaker when one song has more than one chart with the same max feet
const difficultyPriority = [
  "expert",
  "challenge",
  "difficult",
  "basic",
  "beginner",
];

function getMostDifficultChart(sm: Simfile) {
  const { availableTypes: types, charts } = sm;
  const maxFeet = Math.max(...types.map((t) => t.feet));

  const maxFeetTypes = types.filter((t) => t.feet === maxFeet);

  for (let i = 0; i < difficultyPriority.length; ++i) {
    const matchingType = maxFeetTypes.find(
      (mft) => mft.difficulty === difficultyPriority[i]
    );

    if (matchingType) {
      return charts[matchingType.slug];
    }
  }

  throw new Error("getMostDifficultChart, failed to get a chart");
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<MixPageProps>> {
  const mixDir = context.params!.mix as string;
  const allData = getAllStepchartData();
  const mix = allData.find((m) => m.mixDir === mixDir)!;

  const results = {
    props: {
      mix,
      titles: mix.stepcharts.map((sc) => {
        return {
          title: {
            titleDir: sc.title.titleDir,
            titleName: sc.title.titleName,
            translitTitleName: sc.title.translitTitleName,
            banner: sc.title.banner,
          },
          types: sc.availableTypes,
          displayBpm: sc.displayBpm,
          stats: calculateStats(getMostDifficultChart(sc)),
        };
      }),
    },
  };

  return results;
}

export default function NextMixIndexPage(props: MixPageProps) {
  return <MixPage {...props} />;
}
