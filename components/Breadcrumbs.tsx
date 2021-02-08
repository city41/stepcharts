import React, { ReactElement } from "react";
import clsx from "clsx";

import styles from "./Breadcrumbs.module.css";

type Crumb = {
  display: string;
  pathSegment: string;
};

type BreadcrumbsProps = {
  className?: string;
  crumbs: Crumb[];
};

function buildLink(crumb: Crumb, crumbs: Crumb[]): string {
  const targetCrumbIndex = crumbs.indexOf(crumb);

  return crumbs.reduce<string>((building, curCrumb, index) => {
    if (index > targetCrumbIndex) {
      return building;
    }

    return `${building}/${curCrumb.pathSegment}`;
  }, "");
}

const ROOT_CRUMB = { display: "Mixes", pathSegment: "/" };

function Breadcrumbs({ className, crumbs }: BreadcrumbsProps) {
  const entries = [ROOT_CRUMB].concat(crumbs).map((crumb, index, array) => {
    if (index === array.length - 1) {
      return (
        <li key={crumb.pathSegment} className={styles.breadcrumbEntry}>
          {crumb.display}
        </li>
      );
    }

    return (
      <li key={crumb.pathSegment} className={styles.breadcrumbEntry}>
        <a
          className="cursor-pointer border-b-2 border-transparent hover:border-focal"
          href={buildLink(crumb, array)}
        >
          {crumb.display}
        </a>
      </li>
    );
  }, []);

  return (
    <nav>
      <ul className={clsx(className, "flex flex-row")}>{entries}</ul>
    </nav>
  );
}

export { Breadcrumbs };
