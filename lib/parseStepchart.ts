import * as fs from "fs";
import * as path from "path";
import { parseSm } from "./parseSm";

type Parser = (chart: string, mix: string) => Stepchart;

const parsers: Record<string, Parser> = {
  ".sm": parseSm,
};

function getSongFile(songDir: string): string {
  const files = fs.readdirSync(songDir);

  // TODO: support more than .sm
  return files.find((f) => f.endsWith(".sm"))!;
}

function parseStepchart(stepchartSongDirPath: string): Stepchart {
  // const bannerUrl = copyBannerToPublic(stepchartSongDirPath);

  const songFile = getSongFile(stepchartSongDirPath);
  const stepchartPath = path.join(stepchartSongDirPath, songFile);
  const extension = path.extname(stepchartPath);

  const pathParts = stepchartPath.split("/");
  const mix = pathParts[1];

  const parser = parsers[extension];

  if (!parser) {
    throw new Error(`No parser registered for extension: ${extension}`);
  }

  const fileContents = fs.readFileSync(stepchartPath);
  const stepchart = parser(fileContents.toString(), mix);

  if (stepchart.banner) {
    const publicName = encodeURIComponent(
      `${mix}-${stepchart.title}-${stepchart.banner}`
    );
    fs.copyFileSync(
      path.join(stepchartSongDirPath, stepchart.banner),
      path.join("components/bannerImages", publicName)
    );
    stepchart.banner = publicName;
  }

  return stepchart;
}

export { parseStepchart };
