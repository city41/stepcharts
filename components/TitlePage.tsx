import React from "react";

type TitlePageProps = {
  mix: Mix;
  title: Title;
  types: string[];
};

function buildTypeUrl(mix: Mix, title: string, type: string) {
  return `/${mix.mixDir}/${title}/${type}`;
}

function TitlePage({ mix, title, types }: TitlePageProps) {
  return (
    <>
      <h1>{title.actualTitle}</h1>
      {title.banner && <img src={require(`./bannerImages/${title.banner}`)} />}
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
