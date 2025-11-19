// src/components/game/Card.tsx
import type { CardDTO } from "../../api/gameApi";
interface CardProps {
  card: {
    id: string;
    value: string;
    suit: string;
    playable: boolean;
    locked: boolean;
    depth: number;
    power?: boolean;
  };
  onClick: (id: string) => void;
}

export default function Card({ card, onClick }) {
  const disabled = card.locked || !card.playable;

  return (
    <button
      disabled={disabled}
      onClick={() => onClick(card.id)}
      className={`w-full h-full rounded-md border flex flex-col items-center justify-center
        ${disabled ? "bg-gray-300 opacity-60 cursor-not-allowed" : "bg-white hover:bg-green-100 cursor-pointer"}
      `}
    >
      <div className="text-lg font-bold">{card.value}</div>
      <div className="text-sm">{card.suit}</div>
      {card.power && <div className="text-xs text-red-500">POWER</div>}
    </button>
  );
}

