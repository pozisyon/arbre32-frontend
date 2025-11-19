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
  // 🔥 plus besoin de playerId côté frontend
  play: (cardId: string) => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameDTO | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  // --------------------------------------------
  // CREATE NEW GAME
  // --------------------------------------------
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

  // --------------------------------------------
  // LOAD GAME
  // --------------------------------------------
  const loadGame = useCallback(
    async (id: string) => {
      const state = await GameApi.getState(id);
      setGameId(id);
      setGame(state);
      navigate(`/game/${id}`);
    },
    [navigate]
  );

  // --------------------------------------------
  // JOIN GAME
  // --------------------------------------------
  const joinGame = useCallback(
    async (id: string) => {
      // on envoie encore playerId pour respecter la signature, 
      // mais en B2 le backend s'en fiche et force "J1"/"J2"
      await api.post(`/api/game/${id}/join`, {
        playerId: user?.email ?? "anonymous",
      });

      const state = await GameApi.getState(id);
      setGameId(id);
      setGame(state);
      navigate(`/game/${id}`);
    },
    [navigate, user]
  );

  // --------------------------------------------
  // PLAY CARD (B2 : playerId = game.turnPlayer)
  // --------------------------------------------
  const play = useCallback(
    async (cardId: string) => {
      if (!gameId || !game) return;

      const playerId = game.turnPlayer; // "J1" ou "J2" envoyé par le backend

      if (!playerId) {
        console.error("Impossible de déterminer le joueur courant (turnPlayer null).");
        return;
      }

      const updated = await GameApi.playCard(gameId, cardId, playerId);
      setGame(updated);
    },
    [gameId, game]
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

// --------------------------------------------
// HOOK
// --------------------------------------------
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

