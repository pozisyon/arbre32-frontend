import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

export default function Header({ dark, onToggleDark }: { dark: boolean; onToggleDark: ()=>void }) {
  const user = useAuthStore(s => s.user)
  return (
    <header className="w-full h-16 bg-white dark:bg-[#2a2c31] border-b border-gray-200/80 dark:border-[#3a3b40] flex items-center px-4 gap-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-8 h-8 rounded-lg bg-brand-600" />
      <h1 className="font-semibold">Arbre32</h1>
      <nav className="ml-6 flex gap-4 text-sm">
        <Link to="/">Accueil</Link>
        <Link to="/lobby">Lobby</Link>
        <Link to="/game">Partie</Link>
      </nav>
      <div className="ml-auto flex items-center gap-3 text-sm">
        {user && <span className="opacity-80">Connecté : <b>{user.email}</b></span>}
        <button onClick={onToggleDark} className="text-sm px-2 py-1 rounded border dark:border-[#3a3b40]">
          {dark ? 'Thème • Sombre' : 'Thème • Clair'}
        </button>
      </div>
    </header>
  )
}
