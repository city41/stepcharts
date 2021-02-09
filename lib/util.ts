import Fraction from "fraction.js";

const beats = [
  new Fraction(1).div(4),
  new Fraction(1).div(6),
  new Fraction(1).div(8),
  new Fraction(1).div(12),
  new Fraction(1).div(16),
];

function determineBeat(offset: Fraction): Arrow["beat"] {
  const match = beats.find((b) => offset.mod(b).n === 0);

  if (!match) {
    // didn't find anything? then it's a weirdo like a 5th note or 32nd note, they get colored
    // the same as 6ths
    return 6;
  }

  return match.d as Arrow["beat"];
}

const normalizedDifficultyMap: Record<string, Difficulty> = {
  beginner: "beginner",
  easy: "basic",
  basic: "basic",
  trick: "difficult",
  another: "difficult",
  medium: "difficult",
  difficult: "expert",
  expert: "expert",
  maniac: "expert",
  ssr: "expert",
  hard: "expert",
  challenge: "challenge",
  smaniac: "challenge",
  // TODO: filter edits out altogether
  edit: "edit",
};

export { determineBeat, normalizedDifficultyMap };
