import React from "react";

type TitlePageProps = {
  mix: string;
  title: Title;
  types: string[];
};

function buildTypeUrl(mix: string, title: string, type: string) {
  return `/${mix}/${title}/${type}`;
}

function TitlePage({ mix, title, types }: TitlePageProps) {
  return (
    <>
      <h1>{title.actualTitle}</h1>
      <ul>
        {types.map((type) => (
          <li key={type}>
            <a href={buildTypeUrl(mix, title.titleDir, type)}>{type}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export { TitlePage };
