import React from "react";
import { Banner } from "./Banner";
import { Root } from "./layout/Root";

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
    <Root
      title={title.actualTitle}
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <Banner banner={title.banner} />
      <ul>
        {types.map((type) => (
          <li key={type}>
            <a href={buildTypeUrl(mix, title.titleDir, type)}>{type}</a>
          </li>
        ))}
      </ul>
    </Root>
  );
}

export { TitlePage };
