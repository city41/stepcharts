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

function isGallop(
  d: Arrow,
  p: Arrow | undefined,
  g: Arrow | undefined
): boolean {
  if (!p) {
    return false;
  }

  if (d.beat !== 4) {
    return false;
  }

  // jumps are never gallops
  if (isJump(d.direction)) {
    return false;
  }

  // the gallop must move to a new direction,
  // otherwise it's at the least a mini jack
  if (d.direction === p.direction) {
    return false;
  }

  if (p.beat === 12 || p.beat === 16) {
    // only consider it a gallop if it's isolated
    if (!g || p.offset - g.offset >= 1 / 8) {
      return d.offset - p.offset < 1 / 8;
    }
  }

  return false;
}

function isJack(d: Arrow, p: Arrow | undefined): boolean {
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

function calculateStats(chart: Stepchart): Stats {
  const jumps = chart.arrows.filter((a) => isJump(a.direction));
  const freezes = chart.arrows.filter((a) => isFreeze(a.direction));
  const gallops = chart.arrows.filter((a, i, array) =>
    isGallop(a, array[i - 1], array[i - 2])
  );
  const jacks = chart.arrows.filter((a, i, array) => isJack(a, array[i - 1]));

  return {
    jumps: jumps.length,
    jacks: jacks.length,
    freezes: freezes.length,
    gallops: gallops.length,
  };
}

export { calculateStats };
