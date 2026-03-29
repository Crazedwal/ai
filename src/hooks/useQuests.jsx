// src/hooks/useQuests.jsx
import { useState, createContext, useContext, useEffect } from "react"
import { useTokens } from "./useTokens.jsx"

const QuestContext = createContext()
const RESET_INTERVAL = 30 * 60 * 1000 // 30 minutes
const QUESTS_PER_ROTATION = 4

const QUEST_POOL = [
  { id: "send_1",      label: "Send a message",              goal: 1,  stat: "messagesSent",  reward: 5  },
  { id: "send_3",      label: "Send 3 messages",             goal: 3,  stat: "messagesSent",  reward: 10 },
  { id: "send_10",     label: "Send 10 messages",            goal: 10, stat: "messagesSent",  reward: 20 },
  { id: "send_25",     label: "Send 25 messages",            goal: 25, stat: "messagesSent",  reward: 40 },
  { id: "new_chat_1",  label: "Start a new conversation",    goal: 1,  stat: "chatsCreated",  reward: 8  },
  { id: "new_chat_3",  label: "Start 3 conversations",       goal: 3,  stat: "chatsCreated",  reward: 20 },
  { id: "win_gamble",  label: "Win a gamble",                goal: 1,  stat: "gamblesWon",    reward: 25 },
  { id: "win_3",       label: "Win 3 gambles",               goal: 3,  stat: "gamblesWon",    reward: 40 },
  { id: "gamble_3",    label: "Gamble 3 times",              goal: 3,  stat: "gamblesPlayed", reward: 15 },
  { id: "gamble_10",   label: "Gamble 10 times",             goal: 10, stat: "gamblesPlayed", reward: 30 },
  { id: "lose_gamble", label: "Take the L (lose a gamble)",  goal: 1,  stat: "gamblesLost",   reward: 10 },
  { id: "long_chat",   label: "Send 5 messages in one chat", goal: 5,  stat: "messagesInChat", reward: 20 },
]

function seededPick(pool, count, seed) {
  // Simple seeded shuffle to pick quests based on time window
  const arr = [...pool]
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count)
}

function getWindowSeed() {
  return Math.floor(Date.now() / RESET_INTERVAL)
}

function getNextReset() {
  const window = getWindowSeed()
  return (window + 1) * RESET_INTERVAL
}

function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem("questSession") || "{}")
    return s
  } catch { return {} }
}

function saveSession(s) { localStorage.setItem("questSession", JSON.stringify(s)) }

export function QuestProvider({ children }) {
  const { addTokens } = useTokens()
  const [seed, setSeed] = useState(getWindowSeed)
  const [stats, setStats] = useState(() => loadSession().stats || {})
  const [completed, setCompleted] = useState(() => loadSession().completed || [])
  const [newlyCompleted, setNewlyCompleted] = useState([])
  const [timeLeft, setTimeLeft] = useState(() => getNextReset() - Date.now())

  // Reset quests every 30 minutes
  useEffect(() => {
    const check = () => {
      const newSeed = getWindowSeed()
      if (newSeed !== seed) {
        setSeed(newSeed)
        setStats({})
        setCompleted([])
        setNewlyCompleted([])
        saveSession({ stats: {}, completed: [], seed: newSeed })
      }
      setTimeLeft(getNextReset() - Date.now())
    }
    const t = setInterval(check, 10000)
    return () => clearInterval(t)
  }, [seed])

  const activeQuests = seededPick(QUEST_POOL, QUESTS_PER_ROTATION, seed)

  const increment = (stat, amount = 1) => {
    setStats(prev => {
      const next = { ...prev, [stat]: (prev[stat] || 0) + amount }
      const session = loadSession()
      saveSession({ ...session, stats: next })
      return next
    })
  }

  // Check completions
  useEffect(() => {
    const justDone = []
    for (const q of activeQuests) {
      if (!completed.includes(q.id) && (stats[q.stat] || 0) >= q.goal) {
        justDone.push(q)
      }
    }
    if (justDone.length > 0) {
      const ids = justDone.map(q => q.id)
      const updated = [...completed, ...ids]
      setCompleted(updated)
      justDone.forEach(q => addTokens(q.reward))
      setNewlyCompleted(justDone)
      const session = loadSession()
      saveSession({ ...session, completed: updated })
    }
  }, [stats])

  const clearNewlyCompleted = () => setNewlyCompleted([])

  const quests = activeQuests.map(q => ({
    ...q,
    progress: Math.min(stats[q.stat] || 0, q.goal),
    done: completed.includes(q.id)
  }))

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)
  const resetLabel = `${minutes}:${String(seconds).padStart(2, "0")}`

  return (
    <QuestContext.Provider value={{ quests, increment, newlyCompleted, clearNewlyCompleted, resetLabel }}>
      {children}
    </QuestContext.Provider>
  )
}

export function useQuests() {
  return useContext(QuestContext)
}
