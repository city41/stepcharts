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
  "1000": "S-L",
  "0100": "S-D",
  "0010": "S-U",
  "0001": "S-R",
  "1100": "S-LD",
  "1010": "S-LU",
  "0110": "S-UD",
  "0101": "S-RD",
  "0011": "S-RU",
  "1001": "S-LR",
  "00000000": "none",
  "10000000": "D-1-L",
  "01000000": "D-1-D",
  "00100000": "D-1-U",
  "00010000": "D-1-R",
  "11000000": "D-1-LD",
  "10100000": "D-1-LU",
  "01100000": "D-1-UD",
  "01010000": "D-1-RD",
  "00110000": "D-1-RU",
  "10010000": "D-1-LR",
  "00001000": "D-2-L",
  "00000100": "D-2-D",
  "00000010": "D-2-U",
  "00000001": "D-2-R",
  "00001100": "D-2-LD",
  "00001010": "D-2-LU",
  "00000110": "D-2-UD",
  "00000101": "D-2-RD",
  "00000011": "D-2-RU",
  "00001001": "D-2-LR",
  "00100010": "D-1-U-2-U",
  "01000100": "D-1-D-2-D",
  "00011000": "D-1-R-2-L",
  "00100001": "D-1-U-2-R",
  "00101000": "D-1-U-2-L",
  "01000001": "D-1-D-2-R",
  "01001000": "D-1-D-2-L",
  "00010010": "D-1-R-2-U",
  "10000010": "D-1-L-2-U",
  "00010100": "D-1-R-2-D",
  "10000100": "D-1-L-2-D",
};

function convertMeasureLinesToArrows(measureLines: string[]): Arrow[] {
  // const measureType = measureLines.length;
  return measureLines.map((mline) => {
    const direction = smToArrowDirections[mline];

    if (!direction) {
      throw new Error(`No direction found for ${mline}`);
    }

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

    // skip couple, versus, etc for now
    if (type !== "single" && type !== "double") {
      return i + 1;
    }

    // now i is pointing at the first measure
    let arrows: Arrow[] = [];

    do {
      const measureLines = getMeasureLines(lines, i);
      i += measureLines.length;

      arrows = arrows.concat(convertMeasureLinesToArrows(measureLines));
    } while (lines[i++].trim() !== ";");

    sc.arrows![`${type}-${difficulty}`] = arrows;
    sc.availableTypes!.push(`${type}-${difficulty}`);

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
