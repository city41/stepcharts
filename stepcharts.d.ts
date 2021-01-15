type Arrow = {
  direction:
    | "none"
    | "L"
    | "R"
    | "U"
    | "D"
    | "LR"
    | "UD"
    | "LU"
    | "LD"
    | "RU"
    | "RD";
  beat: 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192;
};

type Stepchart = {
  title: string;
  artist: string;
  mix: string;
  availableDifficulties: string[];
  availableTypes: string[];
  arrows: Arrow[];
};

type SongDifficultyType = {
  title: string;
  mix: string;
  difficulty: string;
  type: string;
};
