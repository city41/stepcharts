import * as fs from "fs";
import * as path from "path";
import { parseDwi } from "./parseDwi";
import { parseSm } from "./parseSm";
import { calculateStats } from "./calculateStats";

type RawStepchart = Omit<Stepchart, "mix" | "title"> & {
  title: string;
  titletranslit: string | null;
  banner: string | null;
};
type Parser = (chart: string, titleDir: string) => RawStepchart;

const parsers: Record<string, Parser> = {
  ".sm": parseSm,
  // TODO: actual ssc parser
  ".ssc": parseSm,
  ".dwi": parseDwi,
};

function getSongFile(songDir: string): string {
  const files = fs.readdirSync(songDir);

  // TODO: support more than .sm
  const extensions = Object.keys(parsers);

  const songFile = files.find((f) => extensions.some((ext) => f.endsWith(ext)));

  if (!songFile) {
    throw new Error(`No song file found in ${songDir}`);
  }

  return songFile;
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
  const rawStepchart = parser(fileContents.toString(), stepchartSongDirPath);

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
      titleName: rawStepchart.title,
      translitTitleName: rawStepchart.titletranslit ?? null,
      titleDir,
      banner: rawStepchart.banner,
    },
    stats: calculateStats(rawStepchart.availableTypes, rawStepchart.charts),
  };
}

export { parseStepchart };
export type { RawStepchart };
