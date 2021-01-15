import React from "react";
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { getAllTitles } from "../../../lib/getAllTitles";
import { getTypesForTitle } from "../../../lib/getTypesForTitle";
import { TitlePage } from "../../../components/TitlePage";
import { parseStepchart } from "../../../lib/parseStepchart";

type NextTitleIndexPageProps = {
  mix: string;
  title: Title;
  types: string[];
};

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  const allTitles = getAllTitles();

  return {
    paths: allTitles.map((title) => ({ params: title })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NextTitleIndexPageProps>> {
  const mixDir = context.params!.mix as string;
  const titleDir = context.params!.title as string;

  const stepchart = parseStepchart(`stepcharts/${mixDir}/${titleDir}`);

  const types = getTypesForTitle(mixDir, titleDir);

  const results = {
    props: {
      mix: stepchart.mix,
      title: {
        actualTitle: stepchart.title,
        titleDir,
      },
      types,
    },
  };

  return results;
}

export default function NextTitleIndexPage(props: NextTitleIndexPageProps) {
  return <TitlePage {...props} />;
}
