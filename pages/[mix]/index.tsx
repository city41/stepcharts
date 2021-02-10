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

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allData = getAllStepchartData();

  return {
    paths: allData.map((mix) => ({ params: { mix: mix.mixDir } })),
    fallback: false,
  };
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
          stats: sc.stats,
        };
      }),
    },
  };

  return results;
}

export default function NextMixIndexPage(props: MixPageProps) {
  return <MixPage {...props} />;
}
