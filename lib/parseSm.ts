import { RawStepchart } from "./parseStepchart";

const metaTagsToConsume = ["title", "artist", "banner"];

function getMeasureLines(lines: string[], i: number): string[] {
  const measureLines: string[] = [];

  while (
    i < lines.length &&
    !lines[i].startsWith(",") &&
    !lines[i].startsWith(";")
  ) {
    measureLines.push(lines[i++]);
  }

  return measureLines;
}

function determineBeat(index: number, measureLength: number): Arrow["beat"] {
  if (index === 0 || measureLength === 4) {
    return 4;
  }

  if (measureLength === 6) {
    if (index % 2 === 1) {
      return 6;
    } else {
      return 4;
    }
  }

  if (measureLength === 8) {
    if (index % 2 === 1) {
      return 8;
    } else {
      return 4;
    }
  }

  if (measureLength === 12) {
    if (index % 3 === 1) {
      return 12;
    } else if (index % 3 === 2) {
      return 6;
    } else {
      return 4;
    }
  }

  if (measureLength === 24) {
    if (index % 6 === 1) {
      return 24;
    } else if (index % 6 === 2) {
      return 12;
    } else if (index % 6 === 3) {
      return 6;
    } else {
      return 4;
    }
  }

  if (measureLength === 48) {
    if (index % 12 === 1) {
      return 48;
    } else if (index % 12 === 2) {
      return 24;
    } else if (index % 12 === 3) {
      return 12;
    } else if (index % 12 === 4) {
      return 6;
    } else {
      return 4;
    }
  }

  if (measureLength === 16) {
    if (index % 4 === 1) {
      return 16;
    } else if (index % 4 === 2) {
      return 8;
    } else if (index % 4 === 3) {
      return 16;
    } else {
      return 4;
    }
  }

  if (measureLength === 32) {
    if (index % 8 === 1) {
      return 32;
    } else if (index % 8 === 2) {
      return 16;
    } else if (index % 8 === 3) {
      return 8;
    } else {
      return 4;
    }
  }

  if (measureLength === 64) {
    if (index % 16 === 1) {
      return 64;
    } else if (index % 16 === 2) {
      return 32;
    } else if (index % 16 === 3) {
      return 16;
    } else if (index % 16 === 4) {
      return 8;
    } else {
      return 4;
    }
  }

  // TODO: figure this out...
  return 4;
}

function convertMeasureLinesToArrows(measureLines: string[]): Arrow[] {
  return measureLines.map((mline, i) => {
    return {
      direction: mline as Arrow["direction"],
      beat: determineBeat(i, measureLines.length),
      measureBeatHeight: measureLines.length as Arrow["measureBeatHeight"],
    };
  });
}

function parseSm(sm: string): RawStepchart {
  const lines = sm.split("\n").map((l) => l.trim());

  let i = 0;

  const sc: Partial<RawStepchart> = {
    arrows: {},
    availableTypes: [],
    banner: null,
  };

  function parseNotes(lines: string[], i: number): number {
    // move past #NOTES into the note metadata
    i++;
    const mode = lines[i++].replace("dance-", "").replace(":", "");
    i++; // skip author for now
    const difficulty = lines[i++].replace(":", "").toLowerCase();
    const feet = Number(lines[i++].replace(":", ""));
    i++; // skip groove meter data for now

    // skip couple, versus, etc for now
    if (mode !== "single" && mode !== "double") {
      return i + 1;
    }

    // now i is pointing at the first measure
    let arrows: Arrow[] = [];

    do {
      const measureLines = getMeasureLines(lines, i);
      i += measureLines.length;

      arrows = arrows.concat(convertMeasureLinesToArrows(measureLines));
    } while (i < lines.length && lines[i++].trim() !== ";");

    // trim off empty leading measures
    let startI = 0;
    while (
      startI < arrows.length &&
      (arrows[startI].direction === "0000" ||
        arrows[startI].direction === "00000000")
    ) {
      startI += 1;
    }

    arrows = arrows.slice(startI);

    // trim off empty trailing measures
    // TODO: I think this does trim right, but it
    // isn't showing up correctly in StepchartPage
    let endI = arrows.length - 1;
    while (
      endI > 0 &&
      (arrows[endI].direction === "0000" ||
        arrows[endI].direction === "00000000")
    ) {
      endI -= 1;
    }

    arrows = arrows.slice(0, endI);

    sc.arrows![`${mode}-${difficulty}`] = arrows;
    sc.availableTypes!.push({
      slug: `${mode}-${difficulty}`,
      mode,
      difficulty: difficulty as any,
      feet,
    });

    return i + 1;
  }

  function parseTag(lines: string[], index: number): number {
    const line = lines[index];

    const r = /#([A-Z]+):([^;]*)/;
    const result = r.exec(line);

    if (result) {
      const tag = result[1].toLowerCase();
      const value = result[2];

      if (metaTagsToConsume.includes(tag)) {
        // @ts-ignore
        sc[tag] = value;
      } else if (tag === "notes") {
        return parseNotes(lines, index);
      }
    }

    return index + 1;
  }

  try {
    while (i < lines.length) {
      const line = lines[i];

      if (!line.length || line.startsWith("//")) {
        i += 1;
        continue;
      }

      if (line.startsWith("#")) {
        i = parseTag(lines, i);
      } else {
        i += 1;
      }
    }

    return sc as RawStepchart;
  } catch (e) {
    throw new Error(`error, ${e.message}, ${e.stack}, parsing ${sm}`);
  }
}

export { parseSm };
