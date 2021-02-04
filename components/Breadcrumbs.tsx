import React, { ReactElement } from "react";
import clsx from "clsx";

import styles from "./Breadcrumbs.module.css";

type BreadcrumbsProps = {
  className?: string;
  leaf: "mix" | "title" | "chart";
  stepchart: Stepchart;
  type?: StepchartType;
};

const trail = ["home", "mix", "title", "chart"];

function buildLink(stepchart: Stepchart, crumb: typeof trail[number]): string {
  switch (crumb) {
    case "home":
      return "/";
    case "mix":
      return `/${stepchart.mix.mixDir}`;
    case "title":
      return `/${stepchart.mix.mixDir}/${stepchart.title.titleDir}`;
  }

  throw new Error(`Breadcrumb buildLink, invalid crumb: ${crumb}`);
}

function getDisplay(
  stepchart: Stepchart,
  type: StepchartType | undefined,
  crumb: typeof trail[number]
): string {
  switch (crumb) {
    case "home":
      return "Mixes";
    case "mix":
      return stepchart.mix.mixName;
    case "title":
      return stepchart.title.actualTitle;
  }

  if (!type) {
    throw new Error(
      "Breadcrumbs: building a stepchart breadcrumb but type was not provided"
    );
  }

  return `${type.mode} ${type.difficulty}`;
}

function Breadcrumbs({ className, leaf, stepchart, type }: BreadcrumbsProps) {
  const leafIndex = trail.indexOf(leaf);

  const entries = trail.reduce<ReactElement[]>((building, crumb, index) => {
    if (index > leafIndex) {
      return building;
    }

    if (crumb === leaf) {
      return building.concat(
        <li key={crumb} className={styles.breadcrumbEntry}>
          {getDisplay(stepchart, type, crumb)}
        </li>
      );
    }

    return building.concat(
      <li key={crumb} className={styles.breadcrumbEntry}>
        <a
          className="cursor-pointer border-b-2 border-transparent hover:border-focal"
          href={buildLink(stepchart, crumb)}
        >
          {getDisplay(stepchart, type, crumb)}
        </a>
      </li>
    );
  }, []);

  return <ul className={clsx(className, "flex flex-row")}>{entries}</ul>;
}

export { Breadcrumbs };
