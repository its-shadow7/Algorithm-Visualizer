export const SPEED_TIERS = {
  "0.5x": { interval: 1000, batch: 1, label: "0.5x" },
  "1x":   { interval: 500,  batch: 1, label: "1x" },
  "5x":   { interval: 100,  batch: 1, label: "5x" },
  "25x":  { interval: 20,   batch: 1, label: "25x" },
  "100x": { interval: 20,   batch: 4, label: "100x" },
  "MAX":  { interval: 20,   batch: 10, label: "MAX" },
};

export const DEFAULT_SPEED = "1x";
