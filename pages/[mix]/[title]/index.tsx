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
  const allSimfiles = allData.reduce<Simfile[]>((building, mix) => {
    return building.concat(mix.simfiles);
  }, []);

  return {
    paths: allSimfiles.map((simfile) => ({
      params: { mix: simfile.mix.mixDir, title: simfile.title.titleDir },
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
  const simfile = allData
    .find((m) => m.mixDir === mixDir)!
    .simfiles.find((s) => s.title.titleDir === titleDir)!;

  const results: GetStaticPropsResult<TitlePageProps> = {
    props: {
      title: simfile.title,
      artist: simfile.artist ?? null,
      displayBpm: simfile.displayBpm,
      mix: {
        mixName: simfile.mix.mixName,
        mixDir: simfile.mix.mixDir,
      },
      types: simfile.availableTypes,
    },
  };

  return results;
}

export default function NextTitleIndexPage(props: TitlePageProps) {
  return <TitlePage {...props} />;
}
