import * as fs from "fs";
import * as path from "path";
import { parseDwi } from "./parseDwi";
import { parseSm } from "./parseSm";

type RawSimfile = Omit<Simfile, "mix" | "title"> & {
  title: string;
  titletranslit: string | null;
  banner: string | null;
  displayBpm: string | undefined;
};
type Parser = (simfileSource: string, titleDir: string) => RawSimfile;

const parsers: Record<string, Parser> = {
  ".sm": parseSm,
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

function getBpms(sm: RawSimfile): number[] {
  const chart = Object.values(sm.charts)[0];

  return chart.bpm.map((b) => b.bpm);
}

function parseSimfile(
  rootDir: string,
  mixDir: string,
  titleDir: string
): Omit<Simfile, "mix"> {
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

  if (
    rawStepchart.banner &&
    fs.existsSync(path.join(stepchartSongDirPath, rawStepchart.banner))
  ) {
    const publicName = toSafeName(`${mixDir}-${rawStepchart.banner}`);
    const srcPath = path.resolve(stepchartSongDirPath, rawStepchart.banner);
    const destPath = path.resolve("public/bannerImages", publicName);
    console.log("parseSimFile copying", srcPath, destPath, __dirname);
    fs.copyFileSync(srcPath, destPath);
    rawStepchart.banner = publicName;
  } else {
    rawStepchart.banner = null;
  }

  const bpms = getBpms(rawStepchart);
  const minBpm = Math.round(Math.min(...bpms));
  const maxBpm = Math.round(Math.max(...bpms));

  const displayBpm =
    minBpm === maxBpm ? minBpm.toString() : `${minBpm}-${maxBpm}`;

  return {
    ...rawStepchart,
    title: {
      titleName: rawStepchart.title,
      translitTitleName: rawStepchart.titletranslit ?? null,
      titleDir,
      banner: rawStepchart.banner,
    },
    minBpm,
    maxBpm,
    displayBpm,
    stopCount: Object.values(rawStepchart.charts)[0].stops.length,
  };
}

export { parseSimfile };
export type { RawSimfile };
