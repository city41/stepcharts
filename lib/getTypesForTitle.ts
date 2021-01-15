import * as fs from "fs";
import * as path from "path";
import { parseStepchart } from "./parseStepchart";

const ROOT = "stepcharts";

function getTypesForTitle(mix: string, title: string): string[] {
  const stepchart = parseStepchart(path.join(ROOT, mix, title));

  return stepchart.availableTypes;
}

export { getTypesForTitle };
