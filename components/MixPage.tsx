import React from "react";
import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Banner } from "./Banner";
import { PageItem } from "./PageItem";

type MixPageProps = {
  mix: Mix;
  stepcharts: Stepchart[];
};

function buildTitleUrl(mix: Mix, title: string) {
  return `/${mix.mixDir}/${title}`;
}

function MixPage({ mix, stepcharts }: MixPageProps) {
  return (
    <Root
      title={mix.mixName}
      metaForTitle=""
      metaDescription=""
      socialMediaImg=""
    >
      <div className="sm:mt-16 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <ImageFrame className="mb-8 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <img
            src={require(`../prodStepcharts/${mix.mixDir}/mix-banner.png`)}
            width={280}
            height={80}
            alt={`${mix.mixName} banner`}
          />
        </ImageFrame>
        <ul className="flex flex-col items-center space-y-4">
          {stepcharts.map((stepchart) => {
            return (
              <li key={stepchart.title.actualTitle}>
                <a href={buildTitleUrl(mix, stepchart.title.titleDir)}>
                  <PageItem title={stepchart.title.actualTitle}>
                    <Banner banner={stepchart.title.banner} />
                  </PageItem>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Root>
  );
}

export { MixPage };
