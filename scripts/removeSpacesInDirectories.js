const path = require("path");
const fs = require("fs");

function removeSpaces(dirPath) {
  const stat = fs.statSync(dirPath);

  if (stat.isDirectory()) {
    const children = fs.readdirSync(dirPath);

    children.forEach((child) => {
      const childPath = path.join(dirPath, child);
      removeSpaces(childPath);
    });

    const filename = path.basename(dirPath);
    const filenameWithoutSpaces = filename.replace(/\s/g, "-");
    const newPath = dirPath.replace(filename, filenameWithoutSpaces);

    fs.renameSync(dirPath, newPath);
  }
}

function main() {
  if (!process.argv[2]) {
    console.log("usage: node removeSpacesInDirectories.js [root-dir]");
    process.exit(1);
  }

  removeSpaces(path.join(process.cwd(), process.argv[2]));
}

main();
