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
        if (process.env.NODE_ENV === "production" && songDir === "AUDIT") {
          return songBuilding;
        }

        const songDirPath = path.join(ROOT, mixDir, songDir);
        const stepchart = parseStepchart(songDirPath);

        // TODO: support more than just single
        const allTypes = stepchart.availableTypes.map((type) => {
          return {
            title: songDir,
            mix: mixDir,
            type,
          };
        });

        return songBuilding.concat(allTypes);
      },
      []
    );

    return building.concat(sdts);
  }, []);
}

export { getAllSongDifficultyTypes };
