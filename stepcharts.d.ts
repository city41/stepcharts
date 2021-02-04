type Arrow = {
  direction:
    | `${0 | 1}${0 | 1}${0 | 1}${0 | 1}`
    | `${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}`;
  beat: 4 | 6 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192;
  measureBeatHeight: 4 | 6 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192;
};

type StepchartType = {
  slug: string;
  mode: "single" | "double";
  difficulty: "easy" | "medium" | "hard" | "challenge";
  feet: number;
};

type Stepchart = {
  title: Title;
  artist: string;
  mix: Mix;
  availableTypes: StepchartType[];
  arrows: Record<string, Arrow[]>;
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
