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

export const config = {
  unstable_runtimeJS: false,
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

function getMinMaxFeet(stepchart: Stepchart): [number, number] {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;

  stepchart.availableTypes.forEach((type) => {
    if (type.feet < min) {
      min = type.feet;
    }

    if (type.feet > max) {
      max = type.feet;
    }
  });

  return [min, max];
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
          titleDir: sc.title.titleDir,
          titleName: sc.title.actualTitle,
          banner: sc.title.banner,
          feet: getMinMaxFeet(sc),
        };
      }),
    },
  };

  return results;
}

export default function NextMixIndexPage(props: MixPageProps) {
  return <MixPage {...props} />;
}
