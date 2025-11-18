// src/context/GameContext.tsx
import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GameApi, type GameDTO } from "../api/gameApi";
import { api } from "../api/http";
import { useAuthStore } from "../store/authStore";

interface GameContextValue {
  game: GameDTO | null;
  gameId: string | null;
  initNewGame: (mode: 32 | 52) => Promise<void>;
  joinGame: (id: string) => Promise<void>;
  loadGame: (id: string) => Promise<void>;
  play: (cardId: string, playerId: string) => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameDTO | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  const initNewGame = useCallback(
    async (mode: 32 | 52) => {
      const id = await GameApi.createGame(mode);
      const state = await GameApi.getState(id);
      setGameId(id);
      setGame(state);
      navigate(`/game/${id}`);
    },
    [navigate]
  );

  const loadGame = useCallback(
    async (id: string) => {
      const state = await GameApi.getState(id);
      setGameId(id);
      setGame(state);
      navigate(`/game/${id}`);
    },
    [navigate]
  );

  const joinGame = useCallback(
    async (id: string) => {
      const res = await api.post(`/api/game/${id}/join`, {
        playerId: user.handle,   // on envoie bien le handle côté backend
      });

      setGameId(id);
      setGame(res.data);
      navigate(`/game/${id}`);
    },
    [navigate, user]
  );

  const play = useCallback(
    async (cardId: string, playerId: string) => {
      if (!gameId) return;
      const updated = await GameApi.playCard(gameId, cardId, playerId);
      setGame(updated);
    },
    [gameId]
  );

  return (
    <GameContext.Provider
      value={{
        game,
        gameId,
        initNewGame,
        joinGame,
        loadGame,
        play,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

