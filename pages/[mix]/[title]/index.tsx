import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { getAllStepchartData } from "../../../lib/getAllStepchartData";
import { TitlePage } from "../../../components/TitlePage";
import type { TitlePageProps } from "../../../components/TitlePage";

export const config = {
  unstable_runtimeJS: false,
};

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allData = getAllStepchartData();
  const allStepcharts = allData.reduce<Simfile[]>((building, mix) => {
    return building.concat(mix.stepcharts);
  }, []);

  return {
    paths: allStepcharts.map((stepchart) => ({
      params: { mix: stepchart.mix.mixDir, title: stepchart.title.titleDir },
    })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<TitlePageProps>> {
  const mixDir = context.params!.mix as string;
  const titleDir = context.params!.title as string;

  const allData = getAllStepchartData();
  const stepchart = allData
    .find((m) => m.mixDir === mixDir)!
    .stepcharts.find((s) => s.title.titleDir === titleDir)!;

  const results: GetStaticPropsResult<TitlePageProps> = {
    props: {
      title: stepchart.title,
      artist: stepchart.artist ?? null,
      displayBpm: stepchart.displayBpm,
      mix: {
        mixName: stepchart.mix.mixName,
        mixDir: stepchart.mix.mixDir,
      },
      types: stepchart.availableTypes,
    },
  };

  return results;
}

export default function NextTitleIndexPage(props: TitlePageProps) {
  return <TitlePage {...props} />;
}
