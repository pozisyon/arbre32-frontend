import { Client } from "@stomp/stompjs";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface Message {
  sender: string;
  content: string;
}

interface ChatContextValue {
  messages: Message[];
  connect: (gameId: string, sender: string) => void;
  send: (msg: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const clientRef = useRef<Client | null>(null);
  const gameIdRef = useRef<string>("");
  const senderRef = useRef<string>("");

  const connect = (gameId: string, sender: string) => {
    gameIdRef.current = gameId;
    senderRef.current = sender;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 500,
      debug: () => {},
      onConnect: () => {
        client.subscribe(`/topic/chat/${gameId}`, (msg) => {
          const body = JSON.parse(msg.body);
          setMessages((m) => [...m, body]);
        });
      },
    });

    client.activate();
    clientRef.current = client;
  };

  const send = (content: string) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    clientRef.current.publish({
      destination: `/app/chat/${gameIdRef.current}`,
      body: JSON.stringify({
        sender: senderRef.current,
        content,
      }),
    });
  };

  return (
    <ChatContext.Provider value={{ messages, connect, send }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext)!;

