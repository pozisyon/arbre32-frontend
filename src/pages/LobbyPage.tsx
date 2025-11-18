// src/pages/LobbyPage.tsx
import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { api } from "../api/http";

interface OpenGame {
  id: string;
}

export default function LobbyPage() {
  const { initNewGame, joinGame } = useGame();
  const [waiting, setWaiting] = useState<OpenGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualId, setManualId] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/game/open");
        setWaiting(res.data);
      } catch (e) {
        console.error("Erreur chargement open games:", e);
      }
    };

    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const handleJoin = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await joinGame(id);   // 🟢 joinGame fait tout (POST + navigate)
    } catch (e) {
      console.error("Erreur join:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Lobby</h1>

      {/* CRÉATION */}
      <div className="space-y-3 border p-4 rounded-md">
        <h2 className="text-lg font-semibold">Créer une nouvelle partie</h2>

        <div className="flex gap-3">
          <button onClick={() => initNewGame(32)} className="btn-primary">32 cartes</button>
          <button onClick={() => initNewGame(52)} className="btn-secondary">52 cartes</button>
        </div>
      </div>

      {/* JOIN VIA ID */}
      <div className="space-y-3 border p-4 rounded-md">
        <h2 className="text-lg font-semibold">Rejoindre une partie existante</h2>

        <input
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder="ID de la partie"
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={() => handleJoin(manualId)}
          disabled={!manualId || loading}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Rejoindre
        </button>
      </div>

      {/* LISTE DES PARTIES EN ATTENTE */}
      <div className="space-y-3 border p-4 rounded-md">
        <h2 className="text-lg font-semibold">Parties en attente</h2>

        {waiting.length === 0 && (
          <p className="text-sm opacity-70">Aucune partie en attente…</p>
        )}

        <div className="space-y-2">
          {waiting.map((g) => (
            <div key={g.id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <div className="font-medium">Partie {g.id}</div>
                <div className="text-xs opacity-70">En attente d'un joueur…</div>
              </div>

              <button
                onClick={() => handleJoin(g.id)}
                disabled={loading}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Rejoindre
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

