import React from "react";
import { Banner } from "./Banner";
import { Root } from "./layout/Root";
import { StepchartTypePageItem } from "./StepchartTypePageItem";
import { ImageFrame } from "./ImageFrame";

type TitlePageProps = {
  mix: Mix;
  title: Title;
  types: StepchartType[];
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
      <div className="sm:mt-16 flex flex-col sm:flex-row items-center sm:items-start">
        <ImageFrame className="mb-8 sticky top-0 w-full py-4 bg-focal grid place-items-center">
          <Banner banner={title.banner} />
        </ImageFrame>
        <ul className="flex flex-col items-center space-y-4">
          {types.map((type) => (
            <li key={type.slug}>
              <a href={buildTypeUrl(mix, title.titleDir, type.slug)}>
                <StepchartTypePageItem type={type} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Root>
  );
}

export { TitlePage };
