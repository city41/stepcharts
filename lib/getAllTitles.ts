import * as fs from "fs";
import * as path from "path";
import { parseStepchart } from "./parseStepchart";

const ROOT = "stepcharts";

function getAllTitles(): SongMix[] {
  const mixDirs = fs.readdirSync(ROOT);

  return mixDirs.reduce<SongMix[]>((building, mixDir) => {
    const songDirs = fs.readdirSync(path.join(ROOT, mixDir));

    const songMixes = songDirs.map((songDir) => ({
      mix: mixDir,
      title: songDir,
    }));

    return building.concat(songMixes);
  }, []);
}

export { getAllTitles };
