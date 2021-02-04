import React from "react";
import { GetStaticPropsResult } from "next";
import { getAllStepchartData } from "../lib/getAllStepchartData";
import { yearReleased } from "../lib/yearReleased";
import { IndexPage } from "../components/IndexPage";

type NextIndexProps = {
  mixes: Mix[];
};

function sortByYearReleased(a: Mix, b: Mix) {
  return yearReleased[a.mixName] - yearReleased[b.mixName];
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
