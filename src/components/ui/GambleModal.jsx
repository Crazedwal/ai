// src/components/ui/GambleModal.jsx
import { useState, useEffect } from "react"
import { useTokens } from "../../hooks/useTokens.jsx"
import { useQuests } from "../../hooks/useQuests.jsx"

const BETS = [5, 10, 25, 50]
const ROWS = 14
const SLOTS = 16
const STEP_MS = 220
const BOARD_W = 400
const BOARD_H = 280
const SPACING = BOARD_W / SLOTS          // 25px per slot
const MAX_VISUAL_BALLS = 10              // max shown at once

const MULTIPLIERS = [500, 20, 5, 3, 2, 1, 0, 0, 0, 0, 1, 2, 3, 5, 20, 500]

// Peg x for row r, peg index i (0-indexed)
// Row r has r+2 pegs, centered in board
function pegX(r, i) {
  const leftEdge = BOARD_W / 2 - ((r + 1) / 2) * SPACING
  return leftEdge + i * SPACING
}

// Peg y for row r
function pegY(r) {
  return ((r + 0.5) / (ROWS + 1)) * BOARD_H
}

// Ball x for slot col
function ballX(col) {
  return (col + 0.5) * SPACING
}

// Ball y for step s
function ballY(s) {
  return (s / ROWS) * BOARD_H * 0.88
}

function buildPath() {
  let col = 8 // start between the 2 center pegs
  const path = [col]
  for (let i = 0; i < ROWS; i++) {
    col += Math.random() < 0.5 ? -1 : 1
    col = Math.max(8 - (i + 1), Math.min(8 + (i + 1), col)) // pyramid constraint
    col = Math.max(0, Math.min(SLOTS - 1, col))
    path.push(col)
  }
  return path
}

function slotColor(m, active) {
  const ring = active ? " ring-2 ring-white scale-y-110" : ""
  if (m >= 100) return "bg-red-500 text-white" + ring
  if (m >= 20)  return "bg-orange-400 text-white" + ring
  if (m >= 5)   return "bg-yellow-400 text-black" + ring
  if (m >= 2)   return "bg-green-500 text-white" + ring
  if (m === 1)  return "bg-blue-500 text-white" + ring
  return "bg-gray-700 text-gray-400" + ring
}

const BALL_COLORS = [
  "radial-gradient(circle at 35% 35%, #fff, #60a5fa)",
  "radial-gradient(circle at 35% 35%, #fff, #f87171)",
  "radial-gradient(circle at 35% 35%, #fff, #4ade80)",
  "radial-gradient(circle at 35% 35%, #fff, #facc15)",
  "radial-gradient(circle at 35% 35%, #fff, #c084fc)",
  "radial-gradient(circle at 35% 35%, #fff, #fb923c)",
  "radial-gradient(circle at 35% 35%, #fff, #22d3ee)",
  "radial-gradient(circle at 35% 35%, #fff, #f472b6)",
  "radial-gradient(circle at 35% 35%, #fff, #a3e635)",
  "radial-gradient(circle at 35% 35%, #fff, #e879f9)",
]

export default function GambleModal({ onClose }) {
  const { balance, spendTokens, addTokens } = useTokens()
  const { increment } = useQuests()
  const [bet, setBet] = useState(5)
  const [dropping, setDropping] = useState(false)
  const [step, setStep] = useState(-1)
  const [allPaths, setAllPaths] = useState([])
  const [result, setResult] = useState(null)

  const drop = () => {
    if (balance < bet || dropping) return
    spendTokens(bet)
    setResult(null)
    setDropping(true)
    increment("gamblesPlayed")
    const paths = Array.from({ length: bet }, () => buildPath())
    setAllPaths(paths)
    setStep(0)
  }

  useEffect(() => {
    if (!dropping || step < 0) return
    if (step >= ROWS) {
      let totalWon = 0
      allPaths.forEach(p => {
        totalWon += MULTIPLIERS[p[p.length - 1]]
      })
      if (totalWon > 0) addTokens(totalWon)
      const net = totalWon - bet
      if (net > 0) increment("gamblesWon")
      else increment("gamblesLost")
      setResult({ totalWon, net, numBalls: bet, lastSlots: allPaths.map(p => p[p.length - 1]) })
      setDropping(false)
      return
    }
    const t = setTimeout(() => setStep(s => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [dropping, step])

  const visualPaths = allPaths.slice(0, MAX_VISUAL_BALLS)
  const landedSlots = result ? result.lastSlots : []

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl w-full flex flex-col gap-3 p-5" style={{ background: "#7a1c1c", maxWidth: BOARD_W + 40 }}>

        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Plinko</h2>
          <button onClick={onClose} className="text-red-300 hover:text-white text-2xl leading-none">×</button>
        </div>

        <p className="text-red-200 text-sm">
          Balance: <span className="text-white font-bold">{balance}</span> tokens
        </p>

        {/* Board */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#5c1212" }}>
          <div className="relative mx-auto" style={{ width: BOARD_W, height: BOARD_H }}>

            {/* Pegs — absolutely positioned */}
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: r + 2 }).map((_, i) => (
                <div
                  key={`${r}-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 8, height: 8,
                    left: pegX(r, i) - 4,
                    top: pegY(r) - 4,
                    background: "rgba(255,150,150,0.38)"
                  }}
                />
              ))
            )}

            {/* Animated balls */}
            {(dropping || result) && visualPaths.map((path, bi) => {
              const col = path[Math.min(step >= 0 ? step : 0, ROWS)]
              const x = ballX(col)
              const y = dropping ? ballY(Math.min(step, ROWS)) : ballY(ROWS)
              return (
                <div
                  key={bi}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 16, height: 16,
                    left: x - 8,
                    top: y,
                    background: BALL_COLORS[bi % BALL_COLORS.length],
                    boxShadow: `0 0 8px rgba(255,255,255,0.5)`,
                    transition: `left ${STEP_MS - 20}ms ease-in-out, top ${STEP_MS - 20}ms ease-in-out`,
                    zIndex: 10 + bi,
                    opacity: result ? 0 : 1
                  }}
                />
              )
            })}

            {/* Slot bar */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 px-0">
              {MULTIPLIERS.map((m, i) => {
                const isLanded = landedSlots.includes(i)
                const count = landedSlots.filter(s => s === i).length
                return (
                  <div
                    key={i}
                    className={`flex-1 text-center rounded-sm font-bold relative transition-all ${slotColor(m, isLanded)}`}
                    style={{ fontSize: "8px", padding: "3px 0" }}
                  >
                    {m}x
                    {count > 0 && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold">
                        ×{count}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bet */}
        <div>
          <label className="text-xs text-red-300 block mb-1.5">
            Balls to drop <span className="text-red-400">(1 token each)</span>
          </label>
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
          {dropping ? `Dropping ${bet} ball${bet > 1 ? "s" : ""}...` : `Drop ${bet} Ball${bet > 1 ? "s" : ""}`}
        </button>

        {result && (
          <div className={`text-center py-3 rounded-lg font-bold text-lg ${
            result.net > 0 ? "bg-green-800 text-green-200" :
            result.net === 0 ? "bg-gray-700 text-gray-300" :
            "bg-red-950 text-red-300"
          }`}>
            {result.numBalls} balls → {result.totalWon} tokens back
            <div className="text-sm font-normal mt-0.5">
              {result.net > 0 ? `+${result.net} profit` : result.net === 0 ? "Break even" : `${result.net} loss`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
