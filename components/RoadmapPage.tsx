import React, { ReactNode } from "react";
import clsx from "clsx";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

import { Root } from "./layout/Root";
import { ImageFrame } from "./ImageFrame";

function Feature({
  complete,
  children,
}: {
  complete?: boolean;
  children: ReactNode;
}) {
  const Icon = complete ? ImCheckboxChecked : ImCheckboxUnchecked;
  return (
    <div
      className="my-4 p-2 bg-focal grid gap-2"
      style={{ gridTemplateColumns: "32px 1fr" }}
    >
      <Icon
        className={clsx("text-2xl", {
          "text-yellow-500": complete,
        })}
      />
      <p>{children}</p>
    </div>
  );
}

function RoadmapPage() {
  return (
    <Root
      title="Roadmap"
      metaDescription="Upcoming features for stepcharts.com"
    >
      <ImageFrame className="text-white p-4 mt-8 mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Roadmap</h1>
        <p className="mb-4">
          Stepcharts.com's goal is to be a useful resource for the dance game
          community. These upcoming features will allow us to reach that goal.
        </p>
        <p className="text-center text-focal-300">
          (listed in no particular order)
        </p>
        <ul>
          <li>
            <Feature complete>Basic site with most DDR arcade mixes</Feature>
            <Feature>All DDR mixes, including console</Feature>
            <Feature>
              Sort songs by difficulty, jumps, freezes, gallops, etc
            </Feature>
            <Feature>
              List songs either with banners on cards, or as a compact list
            </Feature>
            <Feature>
              Index page with all songs in a table, easily searchable
            </Feature>
            <Feature>
              Stepcharts: permalink to a specific measure in the song
            </Feature>
            <Feature>
              Stepcharts: printer friendly. So when you go to print off a
              stepchart, you get a nice concise page that fits on one sheet of
              paper
            </Feature>
            <Feature>Stepcharts: modifiers like left, little, etc</Feature>
            <Feature>Other dance games such as ITG and PIU</Feature>
            <Feature>
              Load your own stepchart, for unofficial stepcharts
            </Feature>
          </li>
        </ul>
        <h2 className="text-2xl text-white font-bold mt-6 mb-2">Contact Me</h2>
        <p>
          If you have some ideas for the site, you can{" "}
          <a className="text-focal" href="mailto:matt.e.greer@gmail.com">
            email me
          </a>
          ,{" "}
          <a className="text-focal" href="https://twitter.com/mattegreer">
            talk with me on Twitter
          </a>
          , or we can also chat over at{" "}
          <a className="text-focal" href="https://github.com/city41/stepcharts">
            the GitHub repo
          </a>
          .
        </p>
      </ImageFrame>
    </Root>
  );
}

export { RoadmapPage };
