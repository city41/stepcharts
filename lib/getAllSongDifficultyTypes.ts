import * as fs from "fs";
import * as path from "path";
import { parseStepchart } from "./parseStepchart";

const ROOT = "stepcharts";

function getAllSongDifficultyTypes(): SongDifficultyType[] {
  const mixDirs = fs.readdirSync(ROOT);

  return mixDirs.reduce<SongDifficultyType[]>((building, mixDir) => {
    const songDirs = fs.readdirSync(path.join(ROOT, mixDir));

    const sdts = songDirs.map((songDir) => {
      const songDirPath = path.join(ROOT, mixDir, songDir);
      const Stepchart = parseStepchart(songDirPath);

      // TODO: grab all difficulties and type combos
      return {
        title: Stepchart.title,
        mix: Stepchart.mix,
        difficulty: Stepchart.availableDifficulties[0],
        type: Stepchart.availableTypes[0],
      };
    });

    return building.concat(sdts);
  }, []);
}

export { getAllSongDifficultyTypes };
