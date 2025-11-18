import { Link } from 'react-router-dom'

export default function Sidebar() {
  const item = "px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-[#3a3b40]"
  return (
    <aside className="w-64 border-r border-gray-200/80 dark:border-[#3a3b40] bg-gray-50 dark:bg-[#2a2c31] p-3 flex flex-col gap-2 min-h-[calc(100vh-4rem)]">
      <div className="text-xs uppercase text-gray-500 mb-2">Menu</div>
      <Link className={item} to="/game">▶ Nouvelle partie</Link>
      <Link className={item} to="/lobby">👥 Lobby</Link>
      <Link className={item} to="/rules">📜 Règles</Link>
      <Link className={item} to="/settings">⚙️ Paramètres</Link>
    </aside>
  )
}
