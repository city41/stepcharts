import React from "react";
import { GetStaticPropsResult } from "next";
import { getAllMixes } from "../lib/getAllMixes";
import { IndexPage } from "../components/IndexPage";

type NextIndexProps = {
  mixes: string[];
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<NextIndexProps>
> {
  const mixes = getAllMixes();

  return {
    props: { mixes },
  };
}

export default function NextIndexPage(props: NextIndexProps) {
  return <IndexPage {...props} />;
}
