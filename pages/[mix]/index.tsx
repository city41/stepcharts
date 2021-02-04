import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { getAllStepchartData } from "../../lib/getAllStepchartData";
import { MixPage } from "../../components/MixPage";

export const config = {
  unstable_runtimeJS: false,
};

type NextMixIndexPageProps = {
  mix: Mix;
  stepcharts: Stepchart[];
};

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
): Promise<GetStaticPropsResult<NextMixIndexPageProps>> {
  const mixDir = context.params!.mix as string;
  const allData = getAllStepchartData();
  const mix = allData.find((m) => m.mixDir === mixDir)!;

  const results = {
    props: {
      mix,
      stepcharts: mix.songs.map((s) => s),
    },
  };

  return results;
}

export default function NextMixIndexPage(props: NextMixIndexPageProps) {
  return <MixPage {...props} />;
}
