import { api } from "./http";

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




export const GameApi = {
  // le backend renvoie déjà tout le GameDTO
  async createGame(mode: 32 | 52): Promise<GameDTO> {
    const res = await api.post<GameDTO>("/api/game/create", { mode });
    return res.data;
  },

  async getState(gameId: string): Promise<GameDTO> {
    const res = await api.get<GameDTO>(`/api/game/${gameId}/state`);
    return res.data;
  },

  async joinGame(gameId: string, userHandle: string): Promise<GameDTO> {
    const res = await api.post<GameDTO>(`/api/game/${gameId}/join`, {
      userHandle,
    });
    return res.data;
  },

  async playCard(
    gameId: string,
    cardId: string,
    userHandle: string
  ): Promise<GameDTO> {
    const res = await api.post<GameDTO>(`/api/game/${gameId}/play`, {
      cardId,
      userHandle,
    });
    return res.data;
  },
};
