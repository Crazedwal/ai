// src/components/ui/AfkCheck.jsx
import { useState, useEffect, useRef } from "react"

const AFK_TIMEOUT = 5 * 60 * 1000 // 5 minutes of inactivity
const RESPONSE_TIME = 30 // seconds to respond

export default function AfkCheck({ onConfirm, onFail }) {
  const [countdown, setCountdown] = useState(RESPONSE_TIME)

  useEffect(() => {
    if (countdown <= 0) { onFail(); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-xs p-6 flex flex-col items-center gap-4 text-center">
        <div className="text-4xl">👀</div>
        <h2 className="text-lg font-bold">Still there?</h2>
        <p className="text-sm text-gray-400">Confirm you're not AFK to keep using the app.</p>
        <div className="text-3xl font-mono font-bold text-yellow-400">{countdown}</div>
        <button
          onClick={onConfirm}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
        >
          I'm here
        </button>
      </div>
    </div>
  )
}

export function useAfkCheck() {
  const [showAfk, setShowAfk] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const timerRef = useRef(null)

  const resetTimer = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShowAfk(true), AFK_TIMEOUT)
  }

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"]
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      clearTimeout(timerRef.current)
    }
  }, [])

  const handleConfirm = () => { setShowAfk(false); setBlocked(false); resetTimer() }
  const handleFail = () => { setShowAfk(false); setBlocked(true) }

  return { showAfk, blocked, handleConfirm, handleFail }
}
