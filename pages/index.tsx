import React from "react";
import { GetStaticPropsResult } from "next";
import { getAllSongDifficultyTypes } from "../lib/getAllSongDifficultyTypes";
import { IndexPage } from "../components/IndexPage";

type NextIndexProps = {
  songs: SongDifficultyType[];
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<NextIndexProps>
> {
  const songs = getAllSongDifficultyTypes();

  return {
    props: { songs },
  };
}

export default function NextIndexPage({ songs }: NextIndexProps) {
  return <IndexPage songs={songs} />;
}
