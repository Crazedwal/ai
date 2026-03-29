// src/hooks/useQuests.jsx
import { useState, createContext, useContext, useEffect } from "react"
import { useTokens } from "./useTokens.jsx"

const QuestContext = createContext()

const QUEST_DEFINITIONS = [
  { id: "send_1", label: "Send your first message", goal: 1, stat: "messagesSent", reward: 10 },
  { id: "send_5", label: "Send 5 messages", goal: 5, stat: "messagesSent", reward: 15 },
  { id: "send_20", label: "Send 20 messages", goal: 20, stat: "messagesSent", reward: 30 },
  { id: "new_chat_3", label: "Start 3 conversations", goal: 3, stat: "chatsCreated", reward: 20 },
  { id: "win_gamble", label: "Win a gamble", goal: 1, stat: "gamblesWon", reward: 25 },
  { id: "gamble_5", label: "Gamble 5 times", goal: 5, stat: "gamblesPlayed", reward: 20 },
]

function loadStats() {
  try { return JSON.parse(localStorage.getItem("questStats") || "{}") } catch { return {} }
}
function saveStats(s) { localStorage.setItem("questStats", JSON.stringify(s)) }
function loadCompleted() {
  try { return JSON.parse(localStorage.getItem("questsCompleted") || "[]") } catch { return [] }
}
function saveCompleted(c) { localStorage.setItem("questsCompleted", JSON.stringify(c)) }

export function QuestProvider({ children }) {
  const { addTokens } = useTokens()
  const [stats, setStats] = useState(loadStats)
  const [completed, setCompleted] = useState(loadCompleted)
  const [newlyCompleted, setNewlyCompleted] = useState([])

  const increment = (stat, amount = 1) => {
    setStats(prev => {
      const next = { ...prev, [stat]: (prev[stat] || 0) + amount }
      saveStats(next)
      return next
    })
  }

  // Check for newly completed quests whenever stats change
  useEffect(() => {
    const justDone = []
    for (const q of QUEST_DEFINITIONS) {
      if (!completed.includes(q.id) && (stats[q.stat] || 0) >= q.goal) {
        justDone.push(q)
      }
    }
    if (justDone.length > 0) {
      const ids = justDone.map(q => q.id)
      const updated = [...completed, ...ids]
      setCompleted(updated)
      saveCompleted(updated)
      justDone.forEach(q => addTokens(q.reward))
      setNewlyCompleted(justDone)
    }
  }, [stats])

  const clearNewlyCompleted = () => setNewlyCompleted([])

  const quests = QUEST_DEFINITIONS.map(q => ({
    ...q,
    progress: Math.min(stats[q.stat] || 0, q.goal),
    done: completed.includes(q.id)
  }))

  return (
    <QuestContext.Provider value={{ quests, increment, newlyCompleted, clearNewlyCompleted }}>
      {children}
    </QuestContext.Provider>
  )
}

export function useQuests() {
  return useContext(QuestContext)
}
