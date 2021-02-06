import Fraction from "fraction.js";
import { RawStepchart } from "./parseStepchart";
import { determineBeat } from "./util";

const metaTagsToConsume = ["title", "artist"];

const dwiToSMDirection: Record<string, Arrow["direction"]> = {
  0: "0000", // rest
  1: "1100", // down-left
  2: "0100", // down
  3: "0101", // down-right
  4: "1000", // left
  6: "0001", // right
  7: "1010", // up-left
  8: "0010", // up
  9: "0011", // up-right
  A: "1001", // left-right jump
  B: "0110", // up-down jump
};

function parseDwi(dwi: string, titleDir: string): RawStepchart {
  const lines = dwi.split("\n").map((l) => l.trim());

  let i = 0;

  const sc: Partial<RawStepchart> = {
    arrows: {},
    availableTypes: [],
    banner: `${titleDir}.png`,
  };

  function parseNotes(mode: "single" | "double", rawNotes: string) {
    const values = rawNotes.split(":");
    const difficulty = values[0].toLowerCase();
    const feet = Number(values[1]);
    const notes = values[2];

    sc.availableTypes!.push({
      slug: `${mode}-${difficulty}`,
      mode,
      difficulty: difficulty as any,
      feet,
    });

    const arrows: Arrow[] = [];

    let curOffset = new Fraction(0);
    // dwi's default increment is 8th notes
    let curMeasureFraction = new Fraction(1).div(8);

    for (let i = 0; i < notes.length && notes[i] !== ";"; ++i) {
      const note = notes[i];

      // TODO: implement freeze arrows
      if (note === "!") {
        continue;
      }

      if (note === "(") {
        curMeasureFraction = new Fraction(1).div(16);
      } else if (note === "[") {
        curMeasureFraction = new Fraction(1).div(24);
      } else if (note === "{") {
        curMeasureFraction = new Fraction(1).div(64);
      } else if (note === "`") {
        curMeasureFraction = new Fraction(1).div(192);
      } else if ([")", "]", "}", "'"].includes(note)) {
        curMeasureFraction = new Fraction(1).div(8);
      } else {
        const direction = dwiToSMDirection[note];

        if (!direction) {
          throw new Error(`Failed to find a value for dwi note ${note}`);
        }

        arrows.push({
          direction,
          beat: determineBeat(curOffset),
          offset: curOffset.n / curOffset.d,
        });

        curOffset = curOffset.add(curMeasureFraction);
      }
    }

    sc.arrows![`${mode}-${difficulty}`] = {
      arrows,
      freezes: [],
    };
  }

  let bpm = null;
  let displaybpm = null;

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
      } else if (tag === "displaybpm") {
        displaybpm = [Math.round(Number(value))];
      } else if (tag === "bpm") {
        bpm = [Math.round(Number(value))];
      } else if (tag === "single") {
        //|| tag === "double") {
        parseNotes(tag, value);
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

    if (!displaybpm && !bpm) {
      throw new Error(`No BPM found for ${titleDir}`);
    }

    sc.bpm = ((displaybpm ?? bpm) as unknown) as Stepchart["bpm"];

    return sc as RawStepchart;
  } catch (e) {
    throw new Error(`error, ${e.message}, ${e.stack}, parsing ${dwi}`);
  }
}

export { parseDwi };
