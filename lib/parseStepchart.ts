import * as fs from "fs";
import * as path from "path";
import { parseSm } from "./parseSm";

type RawStepchart = Omit<Stepchart, "mix" | "title"> & { title: string };
type Parser = (chart: string) => RawStepchart;

const parsers: Record<string, Parser> = {
  ".sm": parseSm,
};

function getSongFile(songDir: string): string {
  const files = fs.readdirSync(songDir);

  // TODO: support more than .sm
  return files.find((f) => f.endsWith(".sm"))!;
}

function toSafeName(name: string): string {
  name = name.replace(".png", "");
  name = name.replace(/\s/g, "-").replace(/[^\w]/g, "_");

  return `${name}.png`;
}

function parseStepchart(
  rootDir: string,
  mixDir: string,
  titleDir: string
): Omit<Stepchart, "mix"> {
  const stepchartSongDirPath = path.join(rootDir, mixDir, titleDir);
  const songFile = getSongFile(stepchartSongDirPath);
  const stepchartPath = path.join(stepchartSongDirPath, songFile);
  const extension = path.extname(stepchartPath);

  const parser = parsers[extension];

  if (!parser) {
    throw new Error(`No parser registered for extension: ${extension}`);
  }

  const fileContents = fs.readFileSync(stepchartPath);
  const rawStepchart = parser(fileContents.toString());

  if (rawStepchart.banner) {
    const publicName = toSafeName(`${mixDir}-${rawStepchart.banner}`);
    fs.copyFileSync(
      path.join(stepchartSongDirPath, rawStepchart.banner),
      path.join("components/bannerImages", publicName)
    );
    rawStepchart.banner = publicName;
  }

  return {
    ...rawStepchart,
    title: {
      actualTitle: rawStepchart.title,
      titleDir,
    },
  };
}

export { parseStepchart };
export type { RawStepchart };
