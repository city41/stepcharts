import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { parseStepchart } from "../../../lib/parseStepchart";
import { getAllStepchartData } from "../../../lib/getAllStepchartData";
import { StepchartPage } from "../../../components/StepchartPage";

type NextSongDifficultyTypePageProps = Stepchart & {
  currentType: string;
};

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allData = getAllStepchartData();

  const allStepcharts = allData.reduce<Stepchart[]>((building, mix) => {
    return building.concat(mix.songs);
  }, []);

  const allSdts = allStepcharts.reduce<SongDifficultyType[]>(
    (building, stepchart) => {
      const sdts = stepchart.availableTypes.map((type) => {
        return {
          title: stepchart.title,
          mix: stepchart.mix,
          type,
        };
      });

      return building.concat(sdts);
    },
    []
  );

  return {
    paths: allSdts.map((sdt) => ({
      params: {
        mix: sdt.mix.mixDir,
        title: sdt.title.titleDir,
        type: sdt.type,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NextSongDifficultyTypePageProps>> {
  const mixDir = context.params!.mix as string;
  const titleDir = context.params!.title as string;
  const type = context.params!.type as string;

  const allData = getAllStepchartData();
  const sc = allData
    .find((m) => m.mixDir === mixDir)!
    .songs.find((s) => s.title.titleDir === titleDir)!;

  const results = {
    props: {
      ...sc,
      currentType: type,
    },
  };

  return results;
}

export default function NextSongDifficultyTypePage(
  props: NextSongDifficultyTypePageProps
) {
  return <StepchartPage {...props} />;
}
