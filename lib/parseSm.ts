const metaTagsToConsume = ["title", "artist", "mix", "banner"];

function getMeasureLines(lines: string[], i: number): string[] {
  const measureLines: string[] = [];

  while (lines[i] !== "," && lines[i] !== ";") {
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

  throw new Error(`measureLength was: ${measureLength}`);
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

function parseSm(sm: string, mix: string): Stepchart {
  const lines = sm.split("\n").map((l) => l.trim());

  let i = 0;

  const sc: Partial<Stepchart> = {
    mix,
    arrows: {},
    availableTypes: [],
    banner: null,
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
