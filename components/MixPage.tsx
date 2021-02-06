import React from "react";
import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";
import { Banner } from "./Banner";
import { PageItem } from "./PageItem";
import { Foot } from "./Foot";
import { Breadcrumbs } from "./Breadcrumbs";

type MixPageProps = {
  mix: Mix;
  stepcharts: Stepchart[];
};

function buildTitleUrl(mix: Mix, title: string) {
  return `/${mix.mixDir}/${title}`;
}

function getFeetRange(stepchart: Stepchart): string {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;

  stepchart.availableTypes.forEach((type) => {
    if (type.feet < min) {
      min = type.feet;
    }

    if (type.feet > max) {
      max = type.feet;
    }
  });

  if (min === max) {
    return min.toString();
  }

  return `${min} - ${max}`;
}

function MixPage({ mix, stepcharts }: MixPageProps) {
  return (
    <Root
      title={mix.mixName}
      subtitle={<Breadcrumbs stepchart={stepcharts[0]} leaf="mix" />}
      metaDescription={`Step charts for DDR ${mix.mixName}`}
    >
      <div className="sm:mt-8 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
        <ImageFrame className="mb-8 sticky top-0 w-full sm:w-auto p-4 bg-focal grid place-items-center">
          <img
            className="border-2 border-white"
            src={require(`../prodStepcharts/${mix.mixDir}/mix-banner.png`)}
            width={280}
            height={80}
            alt={`${mix.mixName} banner`}
          />
        </ImageFrame>
        <ul className="flex flex-col items-center space-y-4">
          {stepcharts.map((stepchart) => {
            const supp = (
              <>
                <span>{getFeetRange(stepchart)}</span>
                <Foot difficulty="icon" />
              </>
            );

            return (
              <li key={stepchart.title.actualTitle}>
                <a href={buildTitleUrl(mix, stepchart.title.titleDir)}>
                  <PageItem
                    title={stepchart.title.actualTitle}
                    supplementary={supp}
                  >
                    <Banner
                      banner={stepchart.title.banner}
                      title={stepchart.title.actualTitle}
                    />
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
