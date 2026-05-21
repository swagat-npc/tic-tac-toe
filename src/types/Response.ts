export type WinConditionResponse = {
  win: boolean | null;
  winCombo: number[];
};

export type SearchBestIndexResponse = {
  score: number;
  index: number;
};
