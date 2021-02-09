import React from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { getAllStepchartData } from "../lib/getAllStepchartData";
import { AllSongsPage } from "../components/AllSongsPage";
import type { AllSongsPageProps } from "../components/AllSongsPage";

export async function getStaticProps(
  _context: GetStaticPropsContext
): Promise<GetStaticPropsResult<AllSongsPageProps>> {
  const allData = getAllStepchartData();

  const allStepcharts = allData.reduce<Stepchart[]>((building, mix) => {
    return building.concat(mix.stepcharts);
  }, []);

  const results = {
    props: {
      titles: allStepcharts.map((sc) => {
        return {
          title: {
            titleName: sc.title.titleName,
            translitTitleName: sc.title.translitTitleName,
            titleDir: sc.title.titleDir,
          },
          mix: {
            mixName: sc.mix.mixName,
            mixDir: sc.mix.mixDir,
          },
          types: sc.availableTypes,
          bpm: sc.bpm,
        };
      }),
    },
  };

  return results;
}

export default function NextAllSongsPage(props: AllSongsPageProps) {
  return <AllSongsPage {...props} />;
}
