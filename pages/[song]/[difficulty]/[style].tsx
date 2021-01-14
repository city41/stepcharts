import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";

type NextSongDifficultyStylePageProps = {
  song: string;
  difficulty: string;
  style: string;
};

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: [
      { params: { song: "Afronova", difficulty: "maniac", style: "single" } },
    ],
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NextSongDifficultyStylePageProps>> {
  return {
    props: {
      song: context.params!.song as string,
      difficulty: context.params!.difficulty as string,
      style: context.params!.style as string,
    },
  };
}

export default function NextSongDifficultyStylePage({
  song,
  difficulty,
  style,
}: NextSongDifficultyStylePageProps) {
  return (
    <div>
      <h1>{song}</h1>
      <h2>
        {difficulty} - {style}
      </h2>
    </div>
  );
}
