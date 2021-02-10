import Fraction from "fraction.js";
import { RawStepchart } from "./parseStepchart";
import {
  determineBeat,
  mergeSimilarBpmRanges,
  normalizedDifficultyMap,
} from "./util";

const metaTagsToConsume = ["title", "titletranslit", "artist", "banner"];

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
): { firstNonEmptyMeasureIndex: number; numMeasuresSkipped: number } {
  let numMeasuresSkipped = 0;
  let measureIndex = i;

  for (; i < lines.length && !concludesANoteTag(lines[i]); ++i) {
    const line = lines[i];
    if (line.trim() === "") {
      continue;
    }

    if (line.startsWith(",")) {
      measureIndex = i + 1;
      numMeasuresSkipped += 1;
      continue;
    }

    if (!isRest(trimNoteLine(line, mode))) {
      return { firstNonEmptyMeasureIndex: measureIndex, numMeasuresSkipped };
    }
  }

  throw new Error(
    "findFirstNonEmptyMeasure, failed to find a non-empty measure in entire song"
  );
}

function parseSm(sm: string, _titlePath: string): RawStepchart {
  const lines = sm.split("\n").map((l) => l.trim());

  let i = 0;
  let bpmString: string | null = null;
  let stopsString: string | null = null;

  const sc: Partial<RawStepchart> = {
    charts: {},
    availableTypes: [],
    banner: null,
  };

  function parseStops(
    stopsString: string | null,
    emptyOffsetInMeasures: number
  ) {
    if (!stopsString) {
      return [];
    }

    const entries = stopsString.split(",");

    return entries.map((s) => {
      const [stopS, durationS] = s.split("=");
      return {
        offset: Number(stopS) * 0.25 - emptyOffsetInMeasures,
        duration: Number(durationS),
      };
    });
  }

  function parseBpms(bpmString: string, emptyOffsetInMeasures: number) {
    // 0=79.3,4=80,33=79.8,36=100,68=120,100=137,103=143,106=139,108=140,130=141.5,132=160,164=182,166=181,168=180;
    const entries = bpmString.split(",");

    const bpms = entries.map((e, i, a) => {
      const [beatS, bpmS] = e.split("=");
      const nextBeatS = a[i + 1]?.split("=")[0] ?? null;

      return {
        startOffset: Number(beatS) * 0.25 - emptyOffsetInMeasures,
        endOffset:
          nextBeatS === null
            ? null
            : Number(nextBeatS) * 0.25 - emptyOffsetInMeasures,
        bpm: Number(bpmS),
      };
    });

    const mergedBpms = mergeSimilarBpmRanges(bpms);

    const minBpm = Math.min(...mergedBpms.map((b) => b.bpm));
    const maxBpm = Math.max(...mergedBpms.map((b) => b.bpm));

    if (Math.abs(minBpm - maxBpm) < 2) {
      sc.displayBpm = Math.round(minBpm).toString();
    } else {
      sc.displayBpm = `${Math.round(minBpm)}-${Math.round(maxBpm)}`;
    }

    return mergedBpms;
  }

  function parseFreezes(
    lines: string[],
    i: number,
    mode: string,
    difficulty: string
  ): FreezeBody[] {
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
            throw new Error(
              `${sc.title}, ${mode}, ${difficulty} -- error parsing freezes, found a new starting freeze before a previous one finished`
            );
          }
          const startBeatFraction = curOffset;
          open[d] = {
            direction: d as FreezeBody["direction"],
            startOffset: startBeatFraction.n / startBeatFraction.d,
          };
        } else if (cleanedLine[d] === "3") {
          if (!open[d]) {
            throw new Error(
              `${sc.title}, ${mode}, ${difficulty} -- error parsing freezes, needed to close a freeze that never opened`
            );
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

  function parseNotes(lines: string[], i: number, bpmString: string): number {
    // move past #NOTES into the note metadata
    i++;
    const mode = lines[i++].replace("dance-", "").replace(":", "");
    i++; // skip author for now
    const difficulty =
      normalizedDifficultyMap[lines[i++].replace(":", "").toLowerCase()];
    const feet = Number(lines[i++].replace(":", ""));
    i++; // skip groove meter data for now

    // skip couple, versus, etc for now
    if (mode !== "single" && mode !== "double") {
      return i + 1;
    }

    // now i is pointing at the first measure
    let arrows: Arrow[] = [];

    const {
      firstNonEmptyMeasureIndex,
      numMeasuresSkipped,
    } = findFirstNonEmptyMeasure(mode, lines, i);
    i = firstNonEmptyMeasureIndex;

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

    const freezes = parseFreezes(lines, firstMeasureIndex, mode, difficulty);

    sc.charts![`${mode}-${difficulty}`] = {
      arrows,
      freezes,
      bpm: parseBpms(bpmString, numMeasuresSkipped),
      stops: parseStops(stopsString, numMeasuresSkipped),
    };

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
        bpmString = value;
      } else if (tag === "stops") {
        stopsString = value;
      } else if (tag === "notes") {
        if (!bpmString) {
          throw new Error("parseSm: about to parse notes but never got bpm");
        }
        return parseNotes(lines, index, bpmString);
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
