import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import { GameApi, type GameDTO } from "../api/gameApi";
import { useAuthStore } from "../store/authStore";

interface GameContextValue {
  game: GameDTO | null;
  gameId: string | null;
  lastError: string | null;

  initNewGame: (mode: 32 | 52) => Promise<void>;
  joinGame: (id: string) => Promise<void>;
  loadGame: (id: string) => Promise<void>;
  play: (cardId: string) => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameDTO | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  // ---------- WEBSOCKET ----------
  useEffect(() => {
    if (!gameId) return;

    const sock = new SockJS("http://localhost:8080/ws");
    const stomp = new Client({
      webSocketFactory: () => sock as any,
      reconnectDelay: 5000,
      debug: () => {},
    });

    stomp.onConnect = () => {
      stomp.subscribe(`/topic/game/${gameId}`, (msg) => {
        const updated = JSON.parse(msg.body);
        setGame(updated);
        setLastError(null);
      });
    };

    stomp.activate();
    return () => stomp.deactivate();
  }, [gameId]);

  // ---------- CREER UNE PARTIE ----------
  const initNewGame = useCallback(async (mode: 32 | 52) => {
    const state = await GameApi.createGame(mode);

    // ❗ On NE rejoint PAS la partie ici
    // ❗ On NE charge pas la partie
    // ❗ On NE navigue pas vers /game/id

    console.log("🎲 Partie créée:", state.gameId);

    // Le lobby va détecter la nouvelle partie dans /api/game/open
    setLastError(null);
  }, []);

  // ---------- CHARGER UNE PARTIE ----------
  const loadGame = useCallback(
    async (id: string) => {
      const state = await GameApi.getState(id);
      setGameId(id);
      setGame(state);
      setLastError(null);
      navigate(`/game/${id}`);
    },
    [navigate]
  );

  // ---------- REJOINDRE UNE PARTIE ----------
  const joinGame = useCallback(
    async (id: string) => {
      if (!user) return;

      const state = await GameApi.joinGame(id, user.handle);

      setGameId(id);
      setGame(state);
      setLastError(null);

      navigate(`/game/${id}`);
    },
    [navigate, user]
  );

  // ---------- JOUER ----------
  const play = useCallback(
    async (cardId: string) => {
      if (!gameId || !user) return;

      try {
        const updated = await GameApi.playCard(gameId, cardId, user.handle);
        setGame(updated);
        setLastError(null);
      } catch (e: any) {
        const status = e?.response?.status;

        if (status === 403) setLastError("⚠️ Ce n'est pas votre tour.");
        else if (status === 409) setLastError("🚫 Coup illégal.");
        else setLastError("Erreur côté serveur.");
      }
    },
    [gameId, user]
  );

  return (
    <GameContext.Provider
      value={{
        game,
        gameId,
        lastError,
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

