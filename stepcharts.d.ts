type Arrow = {
  direction:
    | "none"
    | "S-L"
    | "S-R"
    | "S-U"
    | "S-D"
    | "S-LR"
    | "S-UD"
    | "S-LU"
    | "S-LD"
    | "S-RU"
    | "S-RD"
    | "D-1-L"
    | "D-1-R"
    | "D-1-U"
    | "D-1-D"
    | "D-1-LR"
    | "D-1-UD"
    | "D-1-LU"
    | "D-1-LD"
    | "D-1-RU"
    | "D-1-RD"
    | "D-2-L"
    | "D-2-R"
    | "D-2-U"
    | "D-2-D"
    | "D-2-LR"
    | "D-2-UD"
    | "D-2-LU"
    | "D-2-LD"
    | "D-2-RU"
    | "D-2-RD"
    | "D-1-U-2-U"
    | "D-1-D-2-D"
    | "D-1-R-2-L"
    | "D-1-U-2-R"
    | "D-1-U-2-L"
    | "D-1-D-2-R"
    | "D-1-D-2-L"
    | "D-1-R-2-U"
    | "D-1-L-2-U"
    | "D-1-R-2-D"
    | "D-1-L-2-D";
  beat: 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 192;
};

type Stepchart = {
  title: string;
  artist: string;
  mix: string;
  availableDifficulties: string[];
  availableTypes: string[];
  arrows: Record<string, Arrow[]>;
};

type SongDifficultyType = {
  title: string;
  mix: string;
  difficulty: string;
  type: string;
};
