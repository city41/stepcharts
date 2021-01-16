import * as fs from "fs";
import * as path from "path";
import { parseStepchart } from "./parseStepchart";

const ROOT = "stepcharts";

type EntireMix = Mix & {
  songs: Stepchart[];
};

function getFiles(...dirPath: string[]): string[] {
  const builtPath = dirPath.reduce((building, d) => {
    return path.join(building, d);
  }, "");

  return fs.readdirSync(builtPath);
}

function getDirectories(...dirPath: string[]): string[] {
  const builtPath = dirPath.reduce((building, d) => {
    return path.join(building, d);
  }, "");

  return getFiles(builtPath).filter((d) => {
    return fs.statSync(path.join(builtPath, d)).isDirectory();
  });
}

function _getAllStepchartData(): EntireMix[] {
  const mixDirs = getDirectories(ROOT);

  return mixDirs.map((mixDir) => {
    const mixBannerFile = getFiles(ROOT, mixDir).find((f) =>
      f.endsWith(".png")
    );
    const mixSongDirs = getDirectories(ROOT, mixDir);

    const mix = {
      mixName: mixDir,
      mixDir,
    };

    const songs = mixSongDirs.map((songDir) => {
      return {
        ...parseStepchart(ROOT, mixDir, songDir),
        mix,
      };
    });

    return {
      ...mix,
      songs,
    };
  });
}

let allData: EntireMix[] | null = null;

function getAllStepchartData(): EntireMix[] {
  if (!allData) {
    allData = _getAllStepchartData();
  }

  return allData;
}

export { getAllStepchartData };
