// src/api/gameApi.ts
import { api } from "./http";

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
  board: CardDTO[][];
  score: { player1: number; player2: number };
  turnPlayer: string;
  turnIndex: number;
  maxDepth: number;
  rootLocked: boolean;
}

export const GameApi = {
  async createGame(mode: 32 | 52): Promise<string> {
    const res = await api.post<{ gameId: string }>("/api/game/create", { mode });
    return res.data.gameId;
  },

  async getState(gameId: string): Promise<GameDTO> {
    const res = await api.get<GameDTO>(`/api/game/${gameId}/state`);
    return res.data;
  },

  async playCard(gameId: string, cardId: string, playerId: string): Promise<GameDTO> {
    const res = await api.post<GameDTO>(`/api/game/${gameId}/play`, {
      cardId,
      playerId,
    });
    return res.data;
  },

  async listWaiting() {
    const res = await api.get("/api/game/open");
    return res.data as { id: string }[];
  },
};

