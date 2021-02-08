import * as fs from "fs";
import * as path from "path";
import { parseStepchart } from "./parseStepchart";

const ROOT =
  process.env.NODE_ENV === "production" ? "prodStepcharts" : "devStepcharts";

type EntireMix = Mix & {
  stepcharts: Stepchart[];
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
    const mixSongDirs = getDirectories(ROOT, mixDir);

    const mix = {
      mixName: mixDir.replace(/-/g, " "),
      mixDir,
      songCount: mixSongDirs.length,
    };

    const stepcharts = mixSongDirs.map((songDir) => {
      try {
        return {
          ...parseStepchart(ROOT, mixDir, songDir),
          mix,
        };
      } catch (e) {
        throw new Error(
          `parseStepchart failed for ${ROOT}/${mixDir}/${songDir}: ${e.message} ${e.stack}`
        );
      }
    });

    return {
      ...mix,
      stepcharts,
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
