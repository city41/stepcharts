import fs from "fs";
import path from "path";
import {parseStepchart} from "./parseStepchart";

const ROOT = "stepcharts";

function getTitlesForMix(mixDir: string): string[] {
  const titleDirs = fs.readdirSync(path.join(ROOT, mixDir));
  return titleDirs.map(titleDir => {
    const stepchart = parseStepchart(path.join(ROOT, mixDir, titleDir);
    return stepchart.title;
  });
}

export { getTitlesForMix };
