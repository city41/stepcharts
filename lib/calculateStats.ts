// used as the tie breaker when one song has more than one chart with the same max feet
const difficultyPriority = [
  "expert",
  "challenge",
  "difficult",
  "basic",
  "beginner",
];

function getMostDifficultChart(
  types: StepchartType[],
  charts: Record<string, Chart>
) {
  let candidates = types.filter((t) => t.mode === "single");

  // no singles? fall back to whatever there is
  if (candidates.length === 0) {
    candidates = types;
  }

  const maxFeet = Math.max(...types.map((t) => t.feet));

  const maxFeetTypes = types.filter((t) => t.feet === maxFeet);

  for (let i = 0; i < difficultyPriority.length; ++i) {
    const matchingType = maxFeetTypes.find(
      (mft) => mft.difficulty === difficultyPriority[i]
    );

    if (matchingType) {
      return charts[matchingType.slug];
    }
  }

  throw new Error("getMostDifficultChart, failed to get a chart");
}

function isJump(d: Arrow["direction"]): boolean {
  const nonZeroes = d.split("").reduce<number>((total, cardinal) => {
    if (cardinal !== "0") {
      return total + 1;
    }
    return total;
  }, 0);

  return nonZeroes === 2;
}

function isFreeze(d: Arrow["direction"]): boolean {
  return d.indexOf("2") > -1;
}

function isGallop(d: Arrow, p: Arrow | undefined): boolean {
  if (!p) {
    return false;
  }

  if (d.beat !== 4) {
    return false;
  }

  if (p.beat === 12 || p.beat === 16) {
    return d.offset - p.offset < 1 / 8;
  }

  return false;
}

function isDrill(d: Arrow, p: Arrow | undefined): boolean {
  if (!p) {
    return false;
  }

  if (isJump(d.direction)) {
    return false;
  }

  if (d.direction !== p.direction) {
    return false;
  }

  return d.offset - p.offset <= 1 / 8;
}

function calculateStats(
  path: string,
  types: StepchartType[],
  charts: Record<string, Chart>
): Stats {
  const chart = getMostDifficultChart(types, charts);

  const jumps = chart.arrows.filter((a) => isJump(a.direction));
  const freezes = chart.arrows.filter((a) => isFreeze(a.direction));
  const gallops = chart.arrows.filter((a, i, array) =>
    isGallop(a, array[i - 1])
  );
  const drills = chart.arrows.filter((a, i, array) => isDrill(a, array[i - 1]));

  return {
    jumps: jumps.length,
    crossovers: 0,
    drills: drills.length,
    freezes: freezes.length,
    gallops: gallops.length,
  };
}

export { calculateStats };
