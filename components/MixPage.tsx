import React from "react";
import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Banner } from "./Banner";

type MixPageProps = {
  mix: Mix;
  titles: Title[];
};

function buildTitleUrl(mix: Mix, title: string) {
  return `/${mix.mixDir}/${title}`;
}

function MixPage({ mix, titles }: MixPageProps) {
  return (
    <Root
      title={mix.mixName}
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <div className="grid grid-cols-2">
        <ul>
          {titles.map((title) => {
            return (
              <li key={title.actualTitle}>
                <a href={buildTitleUrl(mix, title.titleDir)}>
                  <Banner banner={title.banner} />
                  <div>{title.actualTitle}</div>
                </a>
              </li>
            );
          })}
        </ul>
        <div>
          <ImageFrame>
            <img
              src={require(`../stepcharts/${mix.mixDir}/mix-banner.png`)}
              width={280}
              height={80}
              alt={`${mix.mixName} banner`}
            />
          </ImageFrame>
        </div>
      </div>
    </Root>
  );
}

export { MixPage };
