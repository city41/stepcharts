import * as fs from "fs";
import * as path from "path";
import { parseStepchart } from "./parseStepchart";

const ROOT = "stepcharts";

function getAllSongDifficultyTypes(): SongDifficultyType[] {
  const mixDirs = fs.readdirSync(ROOT);

  return mixDirs.reduce<SongDifficultyType[]>((building, mixDir) => {
    const songDirs = fs.readdirSync(path.join(ROOT, mixDir));

    const sdts = songDirs.reduce<SongDifficultyType[]>(
      (songBuilding, songDir) => {
        const songDirPath = path.join(ROOT, mixDir, songDir);
        const stepchart = parseStepchart(songDirPath);

        // TODO: support more than just single
        const allDifficulties = stepchart.availableDifficulties.map(
          (difficulty) => {
            return {
              title: stepchart.title,
              mix: stepchart.mix,
              difficulty,
              type: "single",
            };
          }
        );

        return songBuilding.concat(allDifficulties);
      },
      []
    );

    return building.concat(sdts);
  }, []);
}

export { getAllSongDifficultyTypes };
