import { useGame } from '../../context/GameContext'
export default function ScorePanel() {
  const { game } = useGame()
  if (!game) return null
  return (
    <div className="border dark:border-[#3a3b40] rounded-2xl bg-white dark:bg-[#2a2c31] p-3">
      <div className="text-sm font-medium mb-2">Scores & manches</div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><div>Joueur 1</div><div className="text-brand-600 font-semibold">{game.score.player1} pts</div></div>
        <div className="flex justify-between"><div>Joueur 2</div><div className="text-brand-600 font-semibold">{game.score.player2} pts</div></div>
        <div className="text-xs opacity-70 mt-2">Manche : {game.round}</div>
      </div>
    </div>
  )
}
