import React, { ReactNode } from "react";
import { Root } from "./layout/Root";

import printPreviewPng from "./printPreview.png";

function dateToHumanString(input: string): string {
  const date = new Date(input);

  const month = date.toLocaleDateString("en-us", {
    month: "short",
  });

  const day = date.toLocaleDateString("en-us", {
    day: "numeric",
  });

  const year = date.toLocaleDateString("en-us", {
    year: "numeric",
  });

  return `${day} ${month} ${year}`;
}

function NewEntry({
  title,
  date,
  children,
}: {
  title: string;
  date: string;
  children: ReactNode;
}) {
  return (
    <div className="xmt-8 py-8 px-4 sm:px-0 border-b border-dashed border-focal-300 last:border-transparent">
      <h3 className="text-focal-700 font-bold mb-4 text-xl flex flex-row justify-between">
        <span className="flex-1">{title}</span>
        <time className="text-focal-400 text-sm" dateTime={date}>
          {dateToHumanString(date)}
        </time>
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function WhatsNewPage() {
  return (
    <Root
      title="What’s New"
      metaDescription="A list of the latest features and additions to stepcharts.com"
    >
      <div className="mt-12 max-w-xl">
        <h2 className="text-focal-700 mb-12 text-2xl pl-4 sm:pl-0">
          What’s new
        </h2>
        <NewEntry title="Printer friendly step charts" date="2021-02-22">
          <p>
            The step charts are now printer friendly. Just print the page like
            you normally would, and you should find the chart fits nicely on the
            page.
          </p>
          <p>
            Most songs can fit on two pages, with really fast songs taking four
            or more pages. The print out should look something like this:
          </p>
          <img
            className="block w-1/2 shadow-lg"
            style={{ margin: "3rem auto" }}
            src={printPreviewPng}
            alt="print preview of a step chart"
            width={495}
            height={654}
          />
          <p>
            If you see something weird, please let me know by clicking "report
            an issue" up at the top.
          </p>
        </NewEntry>
        <NewEntry title="Banner fixes" date="2020-02-21">
          <p>
            Some banners for 5th mix, Max, Max2 and Extreme were incorrect. They
            have now been fixed.
          </p>
        </NewEntry>
        <NewEntry title="All songs page" date="2020-02-17">
          <p>
            The all songs page is now live! It's a good way to explore songs. I
            will keep improving this page, adding things like sort by
            crossovers, spins, difficulty, etc. This page is a big reason I made
            this site, I want to find cool songs I didn't know about.
          </p>
        </NewEntry>
      </div>
    </Root>
  );
}

export { WhatsNewPage };
