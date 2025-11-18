import { useGame } from '../../context/GameContext'
export default function GameInfoBar() {
  const { game } = useGame()
  if (!game) return null
  return (
    <div className="border dark:border-[#3a3b40] rounded-xl bg-white dark:bg-[#2a2c31] px-3 py-2 text-sm flex justify-between">
      <div>Partie <b>#{game.gameId}</b> • Joueur en cours : <b>{game.turnPlayer}</b> • Profondeur autorisée : <b>{game.maxDepthAllowed}</b></div>
      <div className="opacity-70">Racine verrouillée : {game.rootLocked ? 'oui' : 'non'}</div>
    </div>
  )
}
