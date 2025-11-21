

export interface PlayerDTO {
  id: string;
  name: string;
  score: number;
}

export interface CardDTO {
  id: string;
  value: string;
  suit: string;
  depth: number;
  playable: boolean;
  locked: boolean;
  power?: boolean;
}

export interface GameDTO {
  gameId: string;
  rootLocked: boolean;
  turnIndex: number;
  currentPlayer: string | null;
  players: PlayerDTO[];
  maxDepth: number;
  board: CardDTO[][];
}


