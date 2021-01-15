import React from "react";

type TitlePageProps = {
  mix: string;
  title: string;
  types: string[];
};

function buildTypeUrl(mix: string, title: string, type: string) {
  return `/${mix}/${title}/${type}`;
}

function TitlePage({ mix, title, types }: TitlePageProps) {
  return (
    <>
      <h1>{title}</h1>
      <ul>
        {types.map((type) => (
          <li key={type}>
            <a href={buildTypeUrl(mix, title, type)}>{type}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export { TitlePage };
