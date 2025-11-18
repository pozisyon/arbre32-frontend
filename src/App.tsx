import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuthStore } from "./store/authStore";
import { GameProvider } from "./context/GameContext";
import { ChatProvider } from "./context/ChatContext";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const token = useAuthStore(s => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App({ dark, onToggleDark }: { dark: boolean; onToggleDark: ()=>void }) {
  const restore = useAuthStore(s => s.restore);

  useEffect(() => { restore(); }, [restore]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header dark={dark} onToggleDark={onToggleDark} />
      <GameProvider>
        <ChatProvider>
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/lobby" element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
              <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
              <Route path="/game/:id" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </ChatProvider>
      </GameProvider>
    </div>
  );
}
