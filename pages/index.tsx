import React from "react";
import { GetStaticPropsResult } from "next";
import { getAllStepchartData } from "../lib/getAllStepchartData";
import { dateReleased } from "../lib/dateReleased";
import { IndexPage } from "../components/IndexPage";

export const config = {
  unstable_runtimeJS: false,
};

type NextIndexProps = {
  mixes: Mix[];
};

function sortByDateReleased(a: Mix, b: Mix): number {
  return dateReleased[a.mixDir]
    .toString()
    .localeCompare(dateReleased[b.mixDir].toString());
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<NextIndexProps>
> {
  const mixes = getAllStepchartData();

  return {
    props: { mixes: mixes.sort(sortByDateReleased) },
  };
}

export default function NextIndexPage(props: NextIndexProps) {
  return <IndexPage {...props} />;
}
