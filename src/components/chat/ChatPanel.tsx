import { useEffect, useState } from 'react'
import { useChat } from '../../context/ChatContext'
import { useGame } from '../../context/GameContext'

export default function ChatPanel() {
  const { messages, connect, send } = useChat()
  const { game } = useGame()
  const [text, setText] = useState('')

  useEffect(() => { if (game?.gameId) connect(game.gameId) }, [game?.gameId, connect])

  return (
    <div className="border dark:border-[#3a3b40] rounded-2xl bg-white dark:bg-[#2a2c31] p-3 flex flex-col h-full">
      <div className="text-sm font-medium mb-2">Chat (salle: {game?.gameId})</div>
      <div className="flex-1 overflow-auto space-y-2 text-sm bg-gray-50 dark:bg-[#1e1f24] p-2 rounded">
        {messages.map((m, i) => (<div key={i}><b>{m.sender}:</b> {m.content}</div>))}
      </div>
      <form className="mt-2 flex gap-2" onSubmit={(e) => {
        e.preventDefault(); if (!text.trim() || !game?.gameId) return;
        send(game.gameId, { sender: 'Joueur', content: text }); setText('')
      }}>
        <input className="flex-1 border dark:border-[#3a3b40] rounded px-2 py-1 text-sm bg-white dark:bg-[#2a2c31]" value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message…" />
        <button className="px-3 py-1 rounded bg-brand-600 hover:bg-brand-700 text-white text-sm">Envoyer</button>
      </form>
    </div>
  )
}
