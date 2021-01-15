type Arrow = {
  direction:
    | `${0 | 1}${0 | 1}${0 | 1}${0 | 1}`
    | `${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}${0 | 1}`;
  beat: 4 | 6 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192;
  measureBeatHeight: 4 | 6 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192;
};

type Stepchart = {
  title: string;
  artist: string;
  mix: string;
  availableTypes: string[];
  arrows: Record<string, Arrow[]>;
  banner: string | null;
};

type SongMix = {
  title: string;
  mix: string;
};

type SongDifficultyType = {
  title: string;
  mix: string;
  type: string;
};
