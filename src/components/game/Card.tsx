// src/components/game/Card.tsx
import type { CardDTO } from "../../api/gameApi";

interface Props {
  card: CardDTO;
  onClick: (id: string) => void;
}

export default function Card({ card, onClick }: Props) {
  const disabled = card.locked || !card.playable;

  const base =
    "w-full h-full rounded-xl border text-xs flex flex-col items-center justify-center cursor-pointer transition";
  const stateClass = disabled
    ? "opacity-40 cursor-not-allowed bg-gray-200 dark:bg-[#1f2126] border-gray-500"
    : "bg-white dark:bg-[#2a2c31] hover:bg-brand-50 dark:hover:bg-[#343741] border-brand-500";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${base} ${stateClass}`}
      onClick={() => !disabled && onClick(card.id)}
    >
      <div className="font-semibold">{card.value}</div>
      <div className="text-xs opacity-70">{card.suit}</div>
      {card.power && (
        <div className="mt-1 text-[10px] text-amber-500">Pouvoir</div>
      )}
    </button>
  );
}

