import React from "react";
import { GetStaticPropsResult } from "next";
import { getAllStepchartData } from "../lib/getAllStepchartData";
import { dateReleased, groupedOrder } from "../lib/meta";
import { IndexPage } from "../components/IndexPage";

export const config = {
  unstable_runtimeJS: false,
};

type NextIndexProps = {
  mixes: Record<string, Mix[]>;
};

export async function getStaticProps(): Promise<
  GetStaticPropsResult<NextIndexProps>
> {
  const entireMixes = getAllStepchartData();
  const mixes: Mix[] = entireMixes.map((em) => {
    return {
      mixName: em.mixName,
      mixDir: em.mixDir,
      songCount: em.songCount,
      yearReleased: new Date(dateReleased[em.mixDir]).getFullYear(),
    };
  });

  const grouped = Object.keys(groupedOrder).reduce<Record<string, Mix[]>>(
    (building, groupTitle) => {
      building[groupTitle] = (groupedOrder[groupTitle] as string[]).reduce<
        Mix[]
      >((buildingGroup, mixDir) => {
        const mix = mixes.find((m) => m.mixDir === mixDir);

        if (mix) {
          return buildingGroup.concat(mix);
        } else {
          return buildingGroup;
        }
      }, []);

      return building;
    },
    {}
  );

  return {
    props: { mixes: grouped },
  };
}

export default function NextIndexPage(props: NextIndexProps) {
  return <IndexPage {...props} />;
}
