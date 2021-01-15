import React from "react";

type MixPageProps = {
  mix: string;
  titles: string[];
};

function buildTitleUrl(mix: string, title: string) {
  return `/${mix}/${title}`;
}

function MixPage({ mix, titles }: MixPageProps) {
  return (
    <>
      <h1>{mix}</h1>
      <ul>
        {titles.map((title) => (
          <li key={title}>
            <a href={buildTitleUrl(mix, title)}>{title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export { MixPage };
