import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { parseStepchart } from "../../../../lib/parseStepchart";
import { getAllSongDifficultyTypes } from "../../../../lib/getAllSongDifficultyTypes";
import { StepchartPage } from "../../../../components/StepchartPage";

type NextSongDifficultyTypePageProps = Stepchart & {
  currentDifficulty: string;
  currentType: string;
};

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allSongs = getAllSongDifficultyTypes();

  return {
    paths: allSongs.map((sdt) => ({ params: sdt })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NextSongDifficultyTypePageProps>> {
  const sc = parseStepchart(
    `./stepcharts/${context.params!.mix}/${context.params!.title}`
  );

  const results = {
    props: {
      ...sc,
      currentDifficulty: context.params!.difficulty as string,
      currentType: context.params!.type as string,
    },
  };

  console.log("results", results);
  return results;
}

export default function NextSongDifficultyTypePage(
  props: NextSongDifficultyTypePageProps
) {
  return <StepchartPage {...props} />;
}
