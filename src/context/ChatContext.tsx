// src/context/ChatContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface ChatMessage {
  sender: string;
  content: string;
  ts: number;
}

interface ChatContextValue {
  messages: ChatMessage[];
  connect: (gameId: string) => void;
  send: (gameId: string, msg: ChatMessage) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompRef = useRef<Client | null>(null);
  const currentGameRef = useRef<string | null>(null);

  // ============================
  //  CONNECT
  // ============================
  const connect = useCallback((gameId: string) => {
    // ⛔ Ne pas reconnecter si déjà sur la même partie
    if (currentGameRef.current === gameId) return;

    currentGameRef.current = gameId;
    setMessages([]); // reset chat pour nouvelle partie

    // 🔌 Déconnecter proprement l’ancienne connexion
    if (stompRef.current) {
      stompRef.current.deactivate();
      stompRef.current = null;
    }

    // ✔️ Créer une seule connexion
    const sock = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => sock as any,
      reconnectDelay: 5000,
      debug: () => {},
    });

    client.onConnect = () => {
      client.subscribe(`/topic/chat/${gameId}`, (msg) => {
        const payload = JSON.parse(msg.body);

        setMessages((prev) => [
          ...prev,
          {
            sender: payload.from,
            content: payload.message,
            ts: Date.now(),
          },
        ]);
      });
    };

    client.activate();
    stompRef.current = client;
  }, []);

  // ============================
  //  SEND
  // ============================
  const send = useCallback(async (gameId: string, msg: ChatMessage) => {
    await fetch("http://localhost:8080/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        from: msg.sender,
        message: msg.content,
      }),
    });
  }, []);

  // ============================
  //  CLEANUP POUR REACT
  // ============================
  useEffect(() => {
    return () => {
      if (stompRef.current) stompRef.current.deactivate();
    };
  }, []);

  return (
    <ChatContext.Provider value={{ messages, connect, send }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

