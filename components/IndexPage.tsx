import React from "react";

type IndexPageProps = {
  mixes: string[];
};

function buildMixUrl(mix: string): string {
  return `/${mix}`;
}

function IndexPage({ mixes }: IndexPageProps) {
  return (
    <div>
      <ul>
        {mixes.map((m) => (
          <li key={m}>
            <a href={buildMixUrl(m)}>{m}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { IndexPage };
