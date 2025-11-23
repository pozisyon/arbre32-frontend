import Sidebar from '../components/layout/Sidebar'
import GameInfoBar from '../components/game/GameInfoBar'
import GameBoard from '../components/game/GameBoard'
import ScorePanel from '../components/game/ScorePanel'
import ChatPanel from '../components/chat/ChatPanel'
import { useGame } from "../context/GameContext";

export default function GamePage() {
  const { game } = useGame();

  // 🔒 1) Tant que game n'est pas chargé → éviter le crash
  if (!game) {
    return (
      <div className="p-10 text-center text-xl">
        Chargement de la partie...
      </div>
    );
  }

  // 🏁 2) Écran de fin de partie
  if (game.gameOver) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-10 text-center space-y-4">
          <h1 className="text-3xl font-bold">🎉 Partie terminée !</h1>
          <p className="text-xl">
            Vainqueur : <span className="font-bold">{game.winner}</span>
          </p>

          <div className="max-w-xl mx-auto mt-6">
            <ChatPanel />
          </div>
        </main>
      </div>
    );
  }

  // 🎮 3) Écran normal de jeu
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 space-y-3">
        <GameInfoBar />
        <div className="grid grid-cols-[1fr_360px] gap-3" style={{ minHeight: '70vh' }}>
          <GameBoard />
          <div className="flex flex-col gap-3">
            <ScorePanel />
            <div className="flex-1">
              <ChatPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

