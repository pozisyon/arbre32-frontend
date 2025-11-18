import Sidebar from '../components/layout/Sidebar'
import GameInfoBar from '../components/game/GameInfoBar'
import GameBoard from '../components/game/GameBoard'
import ScorePanel from '../components/game/ScorePanel'
import ChatPanel from '../components/chat/ChatPanel'

export default function GamePage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 space-y-3">
        <GameInfoBar />
        <div className="grid grid-cols-[1fr_360px] gap-3" style={{minHeight: '70vh'}}>
          <GameBoard />
          <div className="flex flex-col gap-3">
            <ScorePanel />
            <div className="flex-1">
              <ChatPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
