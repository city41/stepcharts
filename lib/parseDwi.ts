import fs from "fs";
import Fraction from "fraction.js";
import { RawStepchart } from "./parseStepchart";
import { determineBeat } from "./util";

const metaTagsToConsume = ["title", "artist"];

const dwiToSMDirection: Record<string, Arrow["direction"]> = {
  0: "0000",
  1: "1100", // down-left
  2: "0100", // down
  3: "0101", // down-right
  4: "1000", // left
  6: "0001", // right
  7: "1010", // up-left
  8: "0010", // up
  9: "0011", // up-right
  A: "0110", // up-down jump
  B: "1001", // left-right jump
};

const smToDwiDirection = Object.entries(dwiToSMDirection).reduce<
  Record<string, string>
>((building, entry) => {
  building[entry[1]] = entry[0];
  return building;
}, {});

type ArrowParseResult = {
  arrows: Arrow[];
  freezes: FreezeBody[];
};

function combinePadsIntoOneStream(
  p1: ArrowParseResult,
  p2: ArrowParseResult
): ArrowParseResult {
  const arrows = p1.arrows
    .concat(p2.arrows)
    .sort((a, b) => a.offset - b.offset);

  const combinedArrows = arrows.reduce<Arrow[]>((building, arrow, i, rest) => {
    const prevArrow = rest[i - 1];

    // since previous offset matches, the previous one already
    // grabbed and combined with this arrow, throw it away
    if (prevArrow?.offset === arrow.offset) {
      return building;
    }

    const nextArrow = rest[i + 1];

    if (nextArrow?.offset === arrow.offset) {
      return building.concat({
        ...arrow,
        direction: arrow.direction + nextArrow.direction,
      } as Arrow);
    }

    return building.concat({
      ...arrow,
      direction: p1.arrows.includes(arrow)
        ? `${arrow.direction}0000`
        : `0000${arrow.direction}`,
    } as Arrow);
  }, []);

  const bumpedP2Freezes = p2.freezes.map((f) => {
    return {
      ...f,
      direction: f.direction + 4,
    } as FreezeBody;
  });

  const freezes = p1.freezes
    .concat(bumpedP2Freezes)
    .sort((a, b) => a.startOffset - b.startOffset);

  return {
    arrows: combinedArrows,
    freezes,
  };
}

function concludesAFreeze(
  candidateNote: string,
  freezeNote: string | null
): boolean {
  if (freezeNote === null) {
    return false;
  }

  const cDirection = dwiToSMDirection[candidateNote];
  const fDirection = dwiToSMDirection[freezeNote];

  if (!cDirection || !fDirection) {
    return false;
  }

  for (let d = 0; d < fDirection.length; ++d) {
    if (fDirection[d] === "1" && cDirection[d] !== "1") {
      return false;
    }
  }

  return true;
}

function findFirstNonEmptyMeasure(
  p1Notes: string,
  p2Notes: string | undefined
): number {
  let i = 0;

  while (
    p1Notes.startsWith("00000000") &&
    (!p2Notes || p2Notes.startsWith("00000000"))
  ) {
    p1Notes = p1Notes.substring(8);
    p2Notes = p2Notes?.substring(8);
    i += 8;
  }

  return i;
}

function parseArrowStream(
  notes: string,
  firstNonEmptyMeasureIndex: number
): ArrowParseResult {
  const arrows: Arrow[] = [];
  const freezes: FreezeBody[] = [];

  let currentFreezeDirection: string | null = null;
  let openFreezes: Array<Partial<FreezeBody>> = [];

  let curOffset = new Fraction(0);
  // dwi's default increment is 8th notes
  let curMeasureFraction = new Fraction(1).div(8);

  for (
    let i = firstNonEmptyMeasureIndex;
    i < notes.length && notes[i] !== ";";
    ++i
  ) {
    let note = notes[i];
    const nextNote = notes[i + 1];

    if (concludesAFreeze(note, currentFreezeDirection)) {
      openFreezes.forEach((of) => {
        of.endOffset = curOffset.n / curOffset.d + 0.25;
        freezes.push(of as FreezeBody);
      });

      // now when closing out a freeze, any arrows not part of the freeze
      // become normal arrows, see Max, Candy, single, maniac as a good example

      const smDirection = dwiToSMDirection[note].split("");

      for (let i = 0; i < smDirection.length; ++i) {
        if (openFreezes[i]) {
          smDirection[i] = "0";
        }
      }

      note = smToDwiDirection[smDirection.join("")];

      openFreezes = [];
      currentFreezeDirection = null;
    }

    if (nextNote === "!") {
      // B!602080B
      // this means the freeze starts with B (left and right), but then only right (6) has the freeze body
      // during the freeze there is down (2) then up (8), concluding with the second B

      const freezeNote = notes[i + 2];

      const smDirection = dwiToSMDirection[freezeNote];

      for (let d = 0; d < smDirection.length; ++d) {
        if (smDirection[d] === "1") {
          openFreezes[d] = {
            direction: d as FreezeBody["direction"],
            startOffset: curOffset.n / curOffset.d,
          };
        }
      }

      // the head of a freeze is still an arrow
      arrows.push({
        direction: dwiToSMDirection[note].replace(
          /1/g,
          "2"
        ) as Arrow["direction"],
        beat: determineBeat(curOffset),
        offset: curOffset.n / curOffset.d,
      });

      // remember the direction to know when to close the freeze
      currentFreezeDirection = freezeNote;

      // move past the exclamation and trailing note
      i += 2;
      curOffset = curOffset.add(curMeasureFraction);
    } else if (concludesAFreeze(note, currentFreezeDirection)) {
      openFreezes.forEach((of) => {
        of.endOffset = curOffset.n / curOffset.d + 0.25;
        freezes.push(of as FreezeBody);
      });

      // now when closing out a freeze, any arrows not part of the freeze
      // become normal arrows, see Max, Candy, single, maniac as a good example

      const smDirection = dwiToSMDirection[note].split("");

      for (let i = 0; i < smDirection.length; ++i) {
        if (openFreezes[i]) {
          smDirection[i] = "0";
        }
      }

      arrows.push({
        direction: smDirection.join("") as Arrow["direction"],
        beat: determineBeat(curOffset),
        offset: curOffset.n / curOffset.d,
      });

      openFreezes = [];
      curOffset = curOffset.add(curMeasureFraction);
      currentFreezeDirection = null;
    } else if (note === "(") {
      curMeasureFraction = new Fraction(1).div(16);
    } else if (note === "[") {
      curMeasureFraction = new Fraction(1).div(24);
    } else if (note === "{") {
      curMeasureFraction = new Fraction(1).div(64);
    } else if (note === "`") {
      curMeasureFraction = new Fraction(1).div(192);
    } else if ([")", "]", "}", "'"].includes(note)) {
      curMeasureFraction = new Fraction(1).div(8);
    } else if (note === "0") {
      curOffset = curOffset.add(curMeasureFraction);
    } else {
      const direction = dwiToSMDirection[note];

      if (direction) {
        arrows.push({
          direction,
          beat: determineBeat(curOffset),
          offset: curOffset.n / curOffset.d,
        });
      }

      curOffset = curOffset.add(curMeasureFraction);
    }
  }

  return { arrows, freezes };
}

function findBanner(titlePath: string): string | null {
  const files = fs.readdirSync(titlePath);

  const bannerFile = files.find(
    (f) => f.endsWith(".png") && f.indexOf("-bg.png") === -1
  );

  return bannerFile ?? null;
}

function parseDwi(dwi: string, titlePath: string): RawStepchart {
  const lines = dwi.split("\n").map((l) => l.trim());

  let i = 0;

  const sc: Partial<RawStepchart> = {
    arrows: {},
    availableTypes: [],
    banner: findBanner(titlePath),
  };

  function parseNotes(mode: "single" | "double", rawNotes: string) {
    const values = rawNotes.split(":");
    const difficulty = values[0].toLowerCase();
    const feet = Number(values[1]);
    const notes = values[2];
    const playerTwoNotes = values[3];

    const firstNonEmptyMeasureIndex = findFirstNonEmptyMeasure(
      notes,
      playerTwoNotes
    );

    let arrowResult = parseArrowStream(notes, firstNonEmptyMeasureIndex);

    if (mode === "double") {
      const playerTwoResult = parseArrowStream(
        playerTwoNotes,
        firstNonEmptyMeasureIndex
      );

      arrowResult = combinePadsIntoOneStream(arrowResult, playerTwoResult);
    }

    sc.availableTypes!.push({
      slug: `${mode}-${difficulty}`,
      mode,
      difficulty: difficulty as any,
      feet,
    });

    sc.arrows![`${mode}-${difficulty}`] = {
      arrows: arrowResult.arrows,
      freezes: arrowResult.freezes,
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
      } else if (tag === "single" || tag === "double") {
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
      throw new Error(`No BPM found for ${titlePath}`);
    }

    sc.bpm = ((displaybpm ?? bpm) as unknown) as Stepchart["bpm"];

    return sc as RawStepchart;
  } catch (e) {
    throw new Error(`error, ${e.message}, ${e.stack}, parsing ${dwi}`);
  }
}

export { parseDwi };
