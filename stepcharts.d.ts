type Arrow = {
  direction:
    | `${0 | 1}${0 | 1}${0 | 1}${0 | 1}`
    | `${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}`;
  beat: 4 | 6 | 8 | 12 | 16 | 32;
  measureBeatHeight: 4 | 6 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 128 | 192;
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
  arrows: Record<string, Arrow[]>;
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
