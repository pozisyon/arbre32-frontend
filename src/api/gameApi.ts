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
  turnPlayer: string;     // "J1" ou "J2"
  turnIndex: number;
  rootLocked: boolean;
  maxDepth: number;

  // Champ dispo mais plus utilisé pour déterminer qui est qui en B2
  humanP1: string | null;
  humanP2: string | null;

  score: { player1: number; player2: number };
  board: CardDTO[][];
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

  async playCard(
    gameId: string,
    cardId: string,
    playerId: string
  ): Promise<GameDTO> {
    const res = await api.post<GameDTO>(`/api/game/${gameId}/play`, {
      cardId,
      playerId,    // "J1" ou "J2" → le backend fait le contrôle "Not your turn"
    });
    return res.data;
  },
};

