import fs from "fs";
import path from "path";

const ROOT = "stepcharts";

function getTitlesForMix(mix: string): string[] {
  const titleDirs = fs.readdirSync(path.join(ROOT, mix));
  return titleDirs;
}

export { getTitlesForMix };
