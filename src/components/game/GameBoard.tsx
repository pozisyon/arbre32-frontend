// src/components/game/GameBoard.tsx
import { useGame } from "../../context/GameContext";
import { useAuthStore } from "../../store/authStore";
import Card from "./Card";

export default function GameBoard() {
  const { game, play, lastError } = useGame();
  const { user } = useAuthStore();

  if (!game) {
    return <div className="p-4 opacity-70">Aucune partie chargée.</div>;
  }

  // ⚠️ Le backend utilise "currentPlayer" (string handle),
  // donc on compare avec le handle de l'utilisateur connecté
  const myHandle = (user as any)?.handle; // ou user.handle si ton type User le contient
  const isMyTurn = !!myHandle && game.currentPlayer === myHandle;

  return (
    <div className="border dark:border-[#3a3b40] rounded-2xl bg-white dark:bg-[#2a2c31] p-3">
      {/* Bannière info tour */}
      <div className="mb-2 flex flex-col gap-1">
        <div className="text-sm">
          Joueur courant :{" "}
          <span className="font-semibold">
            {game.currentPlayer ?? "—"}
          </span>
        </div>

        {myHandle && (
          <div
            className={`text-xs px-2 py-1 rounded ${
              isMyTurn
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isMyTurn
              ? "C'est votre tour, vous pouvez jouer."
              : "Ce n'est pas votre tour."}
          </div>
        )}

        {lastError && (
          <div className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
            {lastError}
          </div>
        )}
      </div>

      <div className="text-sm font-medium mb-2">Plateau</div>
      <div className="grid grid-rows-4 grid-cols-8 gap-2">
        {game.board.map((row, rIdx) =>
          row.map((card, cIdx) => (
            <div className="h-24" key={`${rIdx}-${cIdx}`}>
              <Card
                card={card}
                onClick={() => {
                  // sécurité côté front (le backend contrôle aussi)
                  if (!isMyTurn) return;
                  play(card.id);
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

