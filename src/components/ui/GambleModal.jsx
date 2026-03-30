// src/components/ui/GambleModal.jsx
import { useState, useEffect, useRef } from "react"
import { useTokens } from "../../hooks/useTokens.jsx"
import { useQuests } from "../../hooks/useQuests.jsx"

const BETS = [5, 10, 25, 50]
const ROWS = 15
const MULTIPLIERS = [500, 20, 5, 3, 2, 0, 1, 1, 1, 1, 0, 2, 3, 5, 20, 500]
const SLOTS = MULTIPLIERS.length // 16

function buildPath() {
  let col = Math.floor(SLOTS / 2) // start center (8)
  const path = [col]
  for (let i = 0; i < ROWS; i++) {
    col = col + (Math.random() < 0.5 ? -1 : 1)
    col = Math.max(0, Math.min(SLOTS - 1, col))
    path.push(col)
  }
  return path
}

function getMultiplierStyle(m, active) {
  const base = active ? "ring-2 ring-white scale-y-110 " : ""
  if (m >= 100) return base + "bg-red-500 text-white"
  if (m >= 20)  return base + "bg-orange-400 text-white"
  if (m >= 5)   return base + "bg-yellow-400 text-black"
  if (m >= 2)   return base + "bg-green-500 text-white"
  if (m >= 1)   return base + "bg-blue-500 text-white"
  if (m > 0)    return base + "bg-purple-500 text-white"
  return base + "bg-gray-700 text-gray-400"
}

// Calculate peg x positions for a given row (0-indexed)
// Row r has r+1 pegs, centered in the board
function getPegPositions(row) {
  const count = row + 1
  const positions = []
  // Center the pegs: left offset = (SLOTS - count) / 2 slots from left
  const startSlot = (SLOTS - count) / 2
  for (let i = 0; i < count; i++) {
    positions.push(startSlot + i)
  }
  return positions
}

export default function GambleModal({ onClose }) {
  const { balance, spendTokens, addTokens } = useTokens()
  const { increment } = useQuests()
  const [bet, setBet] = useState(10)
  const [dropping, setDropping] = useState(false)
  const [path, setPath] = useState(null)
  const [step, setStep] = useState(-1)
  const [result, setResult] = useState(null)
  const stepRef = useRef(-1)

  const drop = () => {
    if (balance < bet || dropping) return
    spendTokens(bet)
    setResult(null)
    setDropping(true)
    increment("gamblesPlayed")
    const newPath = buildPath()
    setPath(newPath)
    stepRef.current = 0
    setStep(0)
  }

  useEffect(() => {
    if (!dropping || step < 0 || !path) return
    if (step >= path.length - 1) {
      const slot = path[path.length - 1]
      const mult = MULTIPLIERS[slot]
      const won = Math.floor(bet * mult)
      if (won > 0) addTokens(won)
      const net = won - bet
      if (net > 0) increment("gamblesWon")
      else increment("gamblesLost")
      setResult({ slot, mult, won, net })
      setDropping(false)
      return
    }
    const t = setTimeout(() => {
      stepRef.current = step + 1
      setStep(step + 1)
    }, 120)
    return () => clearTimeout(t)
  }, [dropping, step])

  const ballCol = path ? path[Math.min(step, path.length - 1)] : Math.floor(SLOTS / 2)
  const ballPct = (ballCol / (SLOTS - 1)) * 100

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl w-full max-w-md flex flex-col gap-3 p-5"
        style={{ background: "#7a1c1c" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold tracking-wide">Plinko</h2>
          <button onClick={onClose} className="text-red-300 hover:text-white text-2xl leading-none">×</button>
        </div>

        <p className="text-red-200 text-sm">Balance: <span className="text-white font-bold">{balance}</span> tokens</p>

        {/* Board */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{ background: "#6b1818", paddingBottom: "8px" }}
        >
          {/* Peg rows */}
          <div className="flex flex-col gap-1 pt-3 px-2">
            {Array.from({ length: ROWS }).map((_, row) => {
              const pegs = getPegPositions(row)
              return (
                <div key={row} className="flex justify-around items-center" style={{ height: "18px" }}>
                  {Array.from({ length: SLOTS }).map((_, col) => {
                    const isPeg = pegs.some(p => Math.abs(p - col) < 0.6)
                    return (
                      <div key={col} className="flex items-center justify-center" style={{ width: `${100 / SLOTS}%` }}>
                        {isPeg && (
                          <div
                            className="rounded-full"
                            style={{ width: 7, height: 7, background: "rgba(255,180,180,0.35)" }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Ball */}
          <div
            className="absolute transition-all"
            style={{
              left: `calc(${ballPct}% - 9px)`,
              top: dropping || result
                ? `calc(${(Math.min(step, ROWS) / ROWS) * 82}% + 4px)`
                : "4px",
              transitionDuration: dropping ? "110ms" : "0ms",
              zIndex: 10
            }}
          >
            <div
              className="rounded-full shadow-lg"
              style={{
                width: 18, height: 18,
                background: "radial-gradient(circle at 35% 35%, #ffffff, #3b82f6)",
                boxShadow: "0 0 8px rgba(96,165,250,0.8)"
              }}
            />
          </div>

          {/* Multiplier slots */}
          <div className="flex mt-2 px-1 gap-0.5">
            {MULTIPLIERS.map((m, i) => (
              <div
                key={i}
                className={`flex-1 text-center text-xs py-1 rounded font-bold transition-all ${getMultiplierStyle(m, result?.slot === i)}`}
                style={{ fontSize: "9px", minWidth: 0 }}
              >
                {m}x
              </div>
            ))}
          </div>
        </div>

        {/* Bet */}
        <div>
          <label className="text-xs text-red-300 block mb-1.5">Bet amount</label>
          <div className="flex gap-2">
            {BETS.map(b => (
              <button
                key={b}
                onClick={() => setBet(b)}
                disabled={dropping}
                className={`flex-1 py-1.5 rounded text-sm font-bold transition-colors disabled:opacity-50 ${
                  bet === b ? "bg-white text-red-800" : "bg-red-900 text-red-200 hover:bg-red-800"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={drop}
          disabled={dropping || balance < bet}
          className="w-full py-2.5 rounded-lg font-bold text-white text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: dropping ? "#555" : "#c0392b" }}
        >
          {dropping ? "Dropping..." : "Drop Ball"}
        </button>

        {result && (
          <div className={`text-center py-3 rounded-lg font-bold text-lg ${
            result.net > 0 ? "bg-green-800 text-green-200" :
            result.net === 0 ? "bg-gray-700 text-gray-300" :
            "bg-red-950 text-red-300"
          }`}>
            {result.mult}x → {result.won} tokens
            <div className="text-sm font-normal mt-0.5">
              {result.net > 0 ? `+${result.net} profit` : result.net === 0 ? "Break even" : `${result.net} loss`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
