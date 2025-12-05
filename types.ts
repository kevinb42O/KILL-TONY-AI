export enum ComedyMode {
  MINUTE_SET = 'MINUTE_SET',
  ROAST = 'ROAST',
  WILLIAM_MONTGOMERY = 'WILLIAM_MONTGOMERY',
  DAVID_LUCAS = 'DAVID_LUCAS',
  KAM_PATTERSON = 'KAM_PATTERSON'
}

export interface JokeResponse {
  text: string;
  setup?: string;
  punchline?: string;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
}
