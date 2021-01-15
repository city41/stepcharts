const metaTagsToConsume = ["title", "artist", "mix"];

function getMeasureLines(lines: string[], i: number): string[] {
  const measureLines: string[] = [];

  while (lines[i] !== "," && lines[i] !== ";") {
    measureLines.push(lines[i++]);
  }

  return measureLines;
}

const smToArrowDirections: Record<string, Arrow["direction"]> = {
  "0000": "none",
  "1000": "L",
  "0100": "D",
  "0010": "U",
  "0001": "R",
  "1100": "LD",
  "1010": "LU",
  "0110": "UD",
  "0101": "RD",
  "0011": "RU",
  "1001": "LR",
};

function convertMeasureLinesToArrows(measureLines: string[]): Arrow[] {
  // const measureType = measureLines.length;

  return measureLines.map((mline) => {
    return {
      direction: smToArrowDirections[mline],
      // TODO: figure out actual beat
      beat: 4,
    };
  });
}

function parseSm(sm: string, mix: string): Stepchart {
  const lines = sm.split("\n").map((l) => l.trim());

  let i = 0;

  const sc: Partial<Stepchart> = {
    mix,
    arrows: {},
    availableDifficulties: [],
    availableTypes: [],
  };

  function parseNotes(lines: string[], i: number): number {
    // move past #NOTES into the note metadata
    i++;
    const type = lines[i++].replace("dance-", "").replace(":", "");
    i++; // skip author for now
    const difficulty = lines[i++].replace(":", "").toLowerCase();
    const feet = Number(lines[i++].replace(":", ""));
    i++; // skip groove meter data for now

    // TODO: support more than just single
    if (type !== "single") {
      return i + 1;
    }

    // now i is pointing at the first measure
    let arrows: Arrow[] = [];

    do {
      const measureLines = getMeasureLines(lines, i);
      i += measureLines.length;

      arrows = arrows.concat(convertMeasureLinesToArrows(measureLines));
    } while (lines[i++].trim() !== ";");

    sc.arrows![`${difficulty}-${type}`] = arrows;
    sc.availableDifficulties.push(difficulty);
    sc.availableTypes.push(type);

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

  return sc as Stepchart;
}

export { parseSm };
