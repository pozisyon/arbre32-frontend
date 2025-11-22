// src/context/ChatContext.tsx
import { createContext, useContext, useState, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface ChatMessage {
  sender: string;
  content: string;
}

interface ChatContextValue {
  messages: ChatMessage[];
  connect: (gameId: string) => void;
  send: (gameId: string, body: { sender: string; content: string }) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 🔥 Ref = NE CHANGE PAS entre les renders
  const stompRef = useRef<Client | null>(null);
  const connectedGameRef = useRef<string | null>(null);

  const connect = useCallback((gameId: string) => {
    // ⛔ Déjà connecté à cette salle → NE RIEN FAIRE
    if (connectedGameRef.current === gameId) return;

    // ⛔ Si un ancien socket existe → on le coupe
    if (stompRef.current) {
      stompRef.current.deactivate();
      stompRef.current = null;
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket as any,
      debug: () => {},
      reconnectDelay: 3000,
    });

    client.onConnect = () => {
      connectedGameRef.current = gameId;

      client.subscribe(`/topic/chat/${gameId}`, (frame) => {
        const body = JSON.parse(frame.body);

        const msg: ChatMessage = {
          sender: body.sender ?? body.from ?? "SYSTEM",
          content: body.content ?? body.message ?? "",
        };

        setMessages((prev) => [...prev, msg]);
      });
    };

    client.activate();
    stompRef.current = client;
  }, []);

  const send = useCallback((gameId: string, msg: { sender: string; content: string }) => {
    fetch("http://localhost:8080/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        from: msg.sender,
        message: msg.content,
      }),
    });
  }, []);

  return (
    <ChatContext.Provider value={{ messages, connect, send }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}

