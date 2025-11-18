// src/components/game/GameBoard.tsx
import { useGame } from "../../context/GameContext";
import { useAuthStore } from "../../store/authStore";
import Card from "./Card";

export default function GameBoard() {
  const { game, play } = useGame();
  const { user } = useAuthStore();

  if (!game) {
    return <div className="p-4 opacity-70">Aucune partie chargée.</div>;
  }

  return (
    <div className="border dark:border-[#3a3b40] rounded-2xl bg-white dark:bg-[#2a2c31] p-3">
      <div className="text-sm font-medium mb-2">Plateau (4×8)</div>
      <div className="grid grid-rows-4 grid-cols-8 gap-2">
        {game.board.map((row, rIdx) =>
          row.map((card, cIdx) => (
            <div className="h-24" key={`${rIdx}-${cIdx}`}>
              <Card
                card={card}
                onClick={(id) => play(id, user.handle)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

