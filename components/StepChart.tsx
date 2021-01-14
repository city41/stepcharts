import React from "react";

type StepChartProps = {
  className?: string;
  songTitle: string;
  currentDifficulty: string;
  availableDifficulties: string[];
  currentStyle: string;
  availableStyles: string[];
  mix: string;
  artist: string;
};

function StepChart({
  className,
  songTitle,
  currentDifficulty,
  availableDifficulties,
  currentStyle,
  availableStyles,
  mix,
  artist,
}: StepChartProps) {
  return <div>stepchart</div>;
}

export { StepChart };
