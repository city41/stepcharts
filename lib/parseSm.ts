import Fraction from "fraction.js";
import { RawStepchart } from "./parseStepchart";

const metaTagsToConsume = ["title", "artist", "banner"];

function getMeasureLines(lines: string[], i: number): string[] {
  const measureLines: string[] = [];

  while (
    i < lines.length &&
    !lines[i].startsWith(",") &&
    !lines[i].startsWith(";")
  ) {
    const line = lines[i++];
    measureLines.push(line);
  }

  return measureLines;
}

const beats = [
  new Fraction(1).div(4),
  new Fraction(1).div(6),
  new Fraction(1).div(8),
  new Fraction(1).div(12),
  new Fraction(1).div(16),
];

function determineBeat(index: number, measureLength: number): Arrow["beat"] {
  const fractionPerEntry = new Fraction(1).div(measureLength);
  const offset = fractionPerEntry.mul(index);

  const match = beats.find((b) => offset.mod(b).n === 0);

  if (!match) {
    // didn't find anything? then it's a weirdo like a 5th note or 32nd note, they get colored
    // the same as 6ths
    return 6;
  }

  return match.d as Arrow["beat"];
}

function convertMeasureLinesToArrows(measureLines: string[]): Arrow[] {
  return measureLines.map((mline, i) => {
    return {
      // remove freeze arrows, they are captured separately
      direction: mline.replace(/3/g, "0") as Arrow["direction"],
      beat: determineBeat(i, measureLines.length),
      measureBeatHeight: measureLines.length as Arrow["measureBeatHeight"],
    };
  });
}

function getMeasureLength(lines: string[], i: number): number {
  let measureLength = 0;

  for (; i < lines.length && lines[i][0] !== ";" && lines[i][0] !== ","; ++i) {
    measureLength += 1;
  }

  return measureLength;
}

function parseSm(sm: string, _titleDir: string): RawStepchart {
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

    let curBeat = new Fraction(0);
    let curMeasureFraction = new Fraction(1).div(getMeasureLength(lines, i));

    for (; i < lines.length && !lines[i].startsWith(";"); ++i) {
      const line = lines[i];

      if (line[0] === ",") {
        curMeasureFraction = new Fraction(1).div(
          getMeasureLength(lines, i + 1)
        );
        continue;
      }

      if (line.indexOf("2") === -1 && line.indexOf("3") === -1) {
        curBeat = curBeat.add(curMeasureFraction);
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
          const startBeatFraction = curBeat;
          open[d] = {
            direction: d as FreezeBody["direction"],
            startBeat: startBeatFraction.n / startBeatFraction.d,
          };
        } else if (cleanedLine[d] === "3") {
          if (!open[d]) {
            console.warn(
              sc.title,
              "error parsing freezes, needed to close a freeze that never opened"
            );
            continue;
          }

          const endBeatFraction = curBeat.add(new Fraction(1).div(4));
          open[d]!.endBeat = endBeatFraction.n / endBeatFraction.d;
          freezes.push(open[d] as FreezeBody);
          open[d] = undefined;
        }
      }

      curBeat = curBeat.add(curMeasureFraction);
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

    const firstMeasureIndex = i;

    do {
      const measureLines = getMeasureLines(lines, i);
      i += measureLines.length;

      arrows = arrows.concat(convertMeasureLinesToArrows(measureLines));
    } while (i < lines.length && !lines[i++].startsWith(";"));

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
    throw new Error(`error, ${e.message}, ${e.stack}, parsing ${sm}`);
  }
}

export { parseSm };
