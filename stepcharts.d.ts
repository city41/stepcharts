type Arrow = {
  direction:
    | `${0 | 1}${0 | 1}${0 | 1}${0 | 1}`
    | `${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}`;
  beat: 4 | 5 | 6 | 8 | 12 | 16 | 32;
  measureBeatHeight:
    | 4
    | 5
    | 6
    | 8
    | 12
    | 13
    | 16
    | 24
    | 32
    | 48
    | 64
    | 128
    | 192;
};

type FreezeBody = {
  direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  startBeat: number;
  endBeat: number;
};

type Mode = "single" | "double";
type Difficulty = "beginner" | "easy" | "medium" | "hard" | "challenge";

type StepchartType = {
  slug: string;
  mode: Mode;
  difficulty: Difficulty;
  feet: number;
};

type Stepchart = {
  title: Title;
  artist: string;
  mix: Mix;
  availableTypes: StepchartType[];
  arrows: Record<string, { arrows: Arrow[]; freezes: FreezeBody[] }>;
  bpm: number[];
};

type Mix = {
  mixName: string;
  mixDir: string;
  songCount: number;
};

type Title = {
  actualTitle: string;
  titleDir: string;
  banner: string | null;
};

type SongMix = {
  title: string;
  mix: string;
};

type SongDifficultyType = {
  title: Title;
  mix: Mix;
  type: StepchartType;
};
