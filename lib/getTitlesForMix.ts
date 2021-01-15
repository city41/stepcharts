import fs from "fs";
import path from "path";
import { parseStepchart } from "./parseStepchart";

const ROOT = "stepcharts";

function getTitlesForMix(mixDir: string): Title[] {
  const titleDirs = fs.readdirSync(path.join(ROOT, mixDir));
  return titleDirs.map((titleDir) => {
    const stepchart = parseStepchart(path.join(ROOT, mixDir, titleDir));
    return {
      actualTitle: stepchart.title,
      titleDir,
    };
  });
}

export { getTitlesForMix };
