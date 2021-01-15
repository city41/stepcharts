import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { getAllMixes } from "../../lib/getAllMixes";
import { getTitlesForMix } from "../../lib/getTitlesForMix";
import { MixPage } from "../../components/MixPage";

type NextMixIndexPageProps = {
  mix: string;
  titles: Title[];
};

export async function getStaticPaths(
  _context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allMixes = getAllMixes();

  return {
    paths: allMixes.map((mix) => ({ params: { mix } })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NextMixIndexPageProps>> {
  const mix = context.params!.mix as string;
  const titles = getTitlesForMix(mix);

  const results = {
    props: {
      mix,
      titles,
    },
  };

  return results;
}

export default function NextMixIndexPage(props: NextMixIndexPageProps) {
  return <MixPage {...props} />;
}
