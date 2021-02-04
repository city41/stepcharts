import React from "react";
import { GetStaticPropsResult } from "next";
import { getAllStepchartData } from "../lib/getAllStepchartData";
import { yearReleased } from "../lib/yearReleased";
import { IndexPage } from "../components/IndexPage";

export const config = {
  unstable_runtimeJS: false,
};

type NextIndexProps = {
  mixes: Mix[];
};

function sortByYearReleased(a: Mix, b: Mix): number {
  return yearReleased[a.mixName]
    .toString()
    .localeCompare(yearReleased[b.mixName].toString());
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<NextIndexProps>
> {
  const mixes = getAllStepchartData();

  return {
    props: { mixes: mixes.sort(sortByYearReleased) },
  };
}

export default function NextIndexPage(props: NextIndexProps) {
  return <IndexPage {...props} />;
}
