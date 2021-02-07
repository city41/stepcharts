import Fraction from "fraction.js";
import { RawStepchart } from "./parseStepchart";
import { determineBeat } from "./util";

const metaTagsToConsume = ["title", "artist", "banner"];

function concludesANoteTag(line: string | undefined): boolean {
  if (line === undefined) {
    return true;
  }

  return line[0] === ";" || (line[0] === "," && line[1] === ";");
}

function getMeasureLength(lines: string[], i: number): number {
  let measureLength = 0;

  for (
    ;
    i < lines.length && !concludesANoteTag(lines[i]) && lines[i][0] !== ",";
    ++i
  ) {
    if (lines[i].trim() !== "") {
      measureLength += 1;
    }
  }

  return measureLength;
}

function trimNoteLine(line: string, mode: "single" | "double"): string {
  if (mode === "single") {
    return line.substring(0, 4);
  } else {
    return line.substring(0, 8);
  }
}

function isRest(line: string): boolean {
  return line.split("").every((d) => d === "0");
}

function findFirstNonEmptyMeasure(
  mode: "single" | "double",
  lines: string[],
  i: number
): number {
  let measureIndex = i;

  for (; i < lines.length && !concludesANoteTag(lines[i]); ++i) {
    const line = lines[i];
    if (line.trim() === "") {
      continue;
    }

    if (line.startsWith(",")) {
      measureIndex = i + 1;
      i += 1;
      continue;
    }

    if (!isRest(trimNoteLine(line, mode))) {
      return measureIndex;
    }
  }

  throw new Error(
    "findFirstNonEmptyMeasure, failed to find a non-empty measure in entire song"
  );
}

function parseSm(sm: string, _titlePath: string): RawStepchart {
  const lines = sm.split("\n").map((l) => l.trim());

  let i = 0;

  const sc: Partial<RawStepchart> = {
    arrows: {},
    availableTypes: [],
    banner: null,
  };

  function parseBpms(bpmString: string) {
    const entries = bpmString.split(",");

    const bpms = entries.map((e) => {
      return Math.floor(Number(e.split("=")[1]));
    });

    // remove the simfile hacks like 190, 189
    const filteredBpms = bpms.filter((b, _index, others) => {
      return !others.some((o) => o - b === 1);
    });

    sc.bpm = Array.from(new Set(filteredBpms)).sort((a, b) => a - b);
  }

  function parseFreezes(lines: string[], i: number): FreezeBody[] {
    const freezes: FreezeBody[] = [];
    const open: Record<number, Partial<FreezeBody> | undefined> = {};

    let curOffset = new Fraction(0);
    let curMeasureFraction = new Fraction(1).div(
      getMeasureLength(lines, i) || 1
    );

    for (; i < lines.length && !concludesANoteTag(lines[i]); ++i) {
      const line = lines[i];

      if (line.trim() === "") {
        continue;
      }

      if (line[0] === ",") {
        curMeasureFraction = new Fraction(1).div(
          getMeasureLength(lines, i + 1) || 1
        );
        continue;
      }

      if (line.indexOf("2") === -1 && line.indexOf("3") === -1) {
        curOffset = curOffset.add(curMeasureFraction);
        continue;
      }

      const cleanedLine = line.replace(/[^23]/g, "0");

      for (let d = 0; d < cleanedLine.length; ++d) {
        if (cleanedLine[d] === "2") {
          if (open[d]) {
            console.warn(
              sc.title,
              "error parsing freezes, found a new starting freeze before a previous one finished"
            );
          }
          const startBeatFraction = curOffset;
          open[d] = {
            direction: d as FreezeBody["direction"],
            startOffset: startBeatFraction.n / startBeatFraction.d,
          };
        } else if (cleanedLine[d] === "3") {
          if (!open[d]) {
            console.warn(
              sc.title,
              "error parsing freezes, needed to close a freeze that never opened"
            );
            continue;
          }

          const endBeatFraction = curOffset.add(new Fraction(1).div(4));
          open[d]!.endOffset = endBeatFraction.n / endBeatFraction.d;
          freezes.push(open[d] as FreezeBody);
          open[d] = undefined;
        }
      }

      curOffset = curOffset.add(curMeasureFraction);
    }

    return freezes;
  }

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

    i = findFirstNonEmptyMeasure(mode, lines, i);

    const firstMeasureIndex = i;
    let curOffset = new Fraction(0);
    // in case the measure is size zero, fall back to dividing by one
    // this is just being defensive, this would mean the stepfile has no notes in it
    let curMeasureFraction = new Fraction(1).div(
      getMeasureLength(lines, i) || 1
    );

    for (; i < lines.length && !concludesANoteTag(lines[i]); ++i) {
      // for now, remove freeze ends as they are handled in parseFreezes
      // TODO: deal with freezes here, no need to have two functions doing basically the same thing
      const line = trimNoteLine(lines[i], mode).replace(/3/g, "0");

      if (line.trim() === "") {
        continue;
      }

      if (line.startsWith(",")) {
        curMeasureFraction = new Fraction(1).div(
          getMeasureLength(lines, i + 1) || 1
        );
        continue;
      }

      if (!isRest(line)) {
        arrows.push({
          beat: determineBeat(curOffset),
          offset: curOffset.n / curOffset.d,
          direction: line as Arrow["direction"],
        });
      }

      curOffset = curOffset.add(curMeasureFraction);
    }

    // // trim off empty leading measures
    // let startI = 0;
    // while (
    //   startI < arrows.length &&
    //   (arrows[startI].direction === "0000" ||
    //     arrows[startI].direction === "00000000")
    // ) {
    //   startI += 1;
    // }
    //
    // arrows = arrows.slice(startI);

    // TODO: actually trim empty ends, but there's more to it
    // for starters, need to ensure to leave entire measures intact
    // (think a measure who's last beat is a rest)
    // let endI = arrows.length - 1;
    // while (
    //   endI > 0 &&
    //   (arrows[endI].direction === "0000" ||
    //     arrows[endI].direction === "00000000")
    // ) {
    //   endI -= 1;
    // }

    // TODO: passing in startI as trim amount is only correct if the song has nothing but
    // quarter beat measures...
    const freezes = parseFreezes(lines, firstMeasureIndex);

    // arrows = arrows.slice(0, endI + 1);

    sc.arrows![`${mode}-${difficulty}`] = { arrows, freezes };
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

    const r = /#([A-Za-z]+):([^;]*)/;
    const result = r.exec(line);

    if (result) {
      const tag = result[1].toLowerCase();
      const value = result[2];

      if (metaTagsToConsume.includes(tag)) {
        // @ts-ignore
        sc[tag] = value;
      } else if (tag === "bpms") {
        parseBpms(value);
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
    throw new Error(
      `error, ${e.message}, ${e.stack}, parsing ${sm.substring(0, 300)}`
    );
  }
}

export { parseSm };
