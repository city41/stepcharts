import React from "react";
import { GetStaticPropsResult } from "next";
import { getAllStepchartData } from "../lib/getAllStepchartData";
import { IndexPage } from "../components/IndexPage";

type NextIndexProps = {
  mixes: Mix[];
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<NextIndexProps>
> {
  const mixes = getAllStepchartData();

  return {
    props: { mixes },
  };
}

export default function NextIndexPage(props: NextIndexProps) {
  return <IndexPage {...props} />;
}
