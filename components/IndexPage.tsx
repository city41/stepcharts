import React from "react";
import { Root } from "./layout/Root";

type IndexPageProps = {
  mixes: string[];
};

function buildMixUrl(mix: string): string {
  return `/${mix}`;
}

function IndexPage({ mixes }: IndexPageProps) {
  return (
    <Root
      title="stepcharts"
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <h1 className="text-3xl">Choose a mix</h1>
      <ul className="flex flex-col gap-2">
        {mixes.map((m) => (
          <li key={m}>
            <a className="block h-36 w-72 bg-red-200" href={buildMixUrl(m)}>
              {m}
            </a>
          </li>
        ))}
      </ul>
    </Root>
  );
}

export { IndexPage };
