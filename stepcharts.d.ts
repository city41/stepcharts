type Arrow = {
  // other beats such as 5ths and 32nds end up being colored
  // the same as 6ths. This probably should be "color" not "beat" TODO
  beat: 4 | 6 | 8 | 12 | 16;
  direction:
    | `${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}`
    | `${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}${
        | 0
        | 1
        | 2}${0 | 1 | 2}${0 | 1 | 2}`;
  offset: number;
};

type FreezeBody = {
  direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  startOffset: number;
  endOffset: number;
};

type Mode = "single" | "double";
type Difficulty =
  | "beginner"
  | "basic"
  | "difficult"
  | "expert"
  | "challenge"
  | "edit";

type StepchartType = {
  slug: string;
  mode: Mode;
  difficulty: Difficulty;
  feet: number;
};

type Stats = {
  jumps: number;
  crossovers: number;
  drills: number;
  freezes: number;
  gallops: number;
};

type Chart = {
  arrows: Arrow[];
  freezes: FreezeBody[];
};

type Stepchart = {
  title: Title;
  artist: string;
  mix: Mix;
  availableTypes: StepchartType[];
  charts: Record<string, Chart>;
  bpm: number[];
  stats: Stats;
};

type Mix = {
  mixName: string;
  mixDir: string;
  songCount: number;
};

type Title = {
  titleName: string;
  translitTitleName: string | null;
  titleDir: string;
  banner: string | null;
};

type SongDifficultyType = {
  title: Title;
  mix: Mix;
  type: StepchartType;
};
