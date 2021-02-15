import React from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { getAllStepchartData } from "../lib/getAllStepchartData";
import { AllSongsPage } from "../components/AllSongsPage";
import type { AllSongsPageProps } from "../components/AllSongsPage";
import { calculateStats } from "../lib/calculateStats";

function getTempShiftCount(sf: Simfile): number {
  const chart = Object.values(sf.charts)[0];

  return chart.bpm.length - 1;
}

export async function getStaticProps(
  _context: GetStaticPropsContext
): Promise<GetStaticPropsResult<AllSongsPageProps>> {
  const allData = getAllStepchartData();

  const allStepcharts = allData.reduce<Simfile[]>((building, mix) => {
    return building.concat(mix.stepcharts);
  }, []);

  const results = {
    props: {
      titles: allStepcharts.map((sc, index) => {
        return {
          id: index,
          title: {
            titleName: sc.title.titleName,
            translitTitleName: sc.title.translitTitleName,
            titleDir: sc.title.titleDir,
            banner: sc.title.banner ?? null,
          },
          mix: {
            mixName: sc.mix.mixName,
            mixDir: sc.mix.mixDir,
          },
          artist: sc.artist || "",
          types: sc.availableTypes.map((t) => {
            return {
              ...t,
              stats: calculateStats(sc.charts[t.slug]),
            };
          }),
          displayBpm: sc.displayBpm,
          stopCount: sc.stopCount,
          tempoShiftCount: getTempShiftCount(sc),
        };
      }),
    },
  };

  return results;
}

export default function NextAllSongsPage(props: AllSongsPageProps) {
  return <AllSongsPage {...props} />;
}
