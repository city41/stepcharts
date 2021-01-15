import fs from "fs";

const ROOT = "stepcharts";

function getAllMixes() {
  const mixDirs = fs.readdirSync(ROOT);
  return mixDirs;
}

export { getAllMixes };
