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

type NextTitleIndexPageProps = {
  mix: string;
  title: string;
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
  const mix = context.params!.mix as string;
  const title = context.params!.title as string;

  const types = getTypesForTitle(mix, title);

  const results = {
    props: {
      mix,
      title,
      types,
    },
  };

  return results;
}

export default function NextTitleIndexPage(props: NextTitleIndexPageProps) {
  return <TitlePage {...props} />;
}
