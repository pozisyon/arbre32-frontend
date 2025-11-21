import { useGame } from "../../context/GameContext";

export default function ScorePanel() {
  const { game } = useGame();
  if (!game) return null;

  return (
    <div className="p-3 rounded-xl bg-slate-900 text-white">
      <div className="text-sm mb-2">
        Tour: <span className="font-semibold">{game.turnIndex}</span>
      </div>

      <div className="mb-2 text-sm">
        Joueur courant :{" "}
        <span className="font-semibold">
          {game.currentPlayer ?? "—"}
        </span>
      </div>

      <div className="text-sm font-semibold mb-1">
        Scores
      </div>

      <div className="flex flex-col gap-1 text-sm">
        {game.players.map((p) => (
          <div key={p.id} className="flex justify-between">
            <span>{p.name}</span>
            <span>{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

