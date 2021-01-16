import React from "react";

type MixPageProps = {
  mix: Mix;
  titles: Title[];
};

function buildTitleUrl(mix: Mix, title: string) {
  return `/${mix.mixDir}/${title}`;
}

function MixPage({ mix, titles }: MixPageProps) {
  return (
    <>
      <h1>{mix.mixName}</h1>
      <img
        src={require(`../stepcharts/${mix.mixDir}/mix-banner.png`)}
        width={280}
        height={80}
        alt={`${mix.mixName} banner`}
      />
      <ul>
        {titles.map((title) => (
          <li key={title.actualTitle}>
            <a href={buildTitleUrl(mix, title.titleDir)}>{title.actualTitle}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export { MixPage };
