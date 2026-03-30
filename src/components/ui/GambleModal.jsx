// src/components/ui/GambleModal.jsx
import { useState, useEffect } from "react"
import { useTokens } from "../../hooks/useTokens.jsx"
import { useQuests } from "../../hooks/useQuests.jsx"

const BETS = [5, 10, 25, 50]
const ROWS = 14        // peg rows — row r has r+2 pegs
const SLOTS = 16       // slots at bottom
const START_COL = 8    // center-right start (between the 2 top pegs)
const STEP_MS = 220    // ms per row — slow and satisfying

// Swap 0s and 1s vs before
const MULTIPLIERS = [500, 20, 5, 3, 2, 1, 0, 0, 0, 0, 1, 2, 3, 5, 20, 500]

function buildPath() {
  let col = START_COL
  const path = [col]
  for (let i = 0; i < ROWS; i++) {
    col += Math.random() < 0.5 ? -1 : 1
    // Pyramid constraint: ball can't go further than i+1 from start
    col = Math.max(START_COL - (i + 1), Math.min(START_COL + (i + 1), col))
    // Board bounds
    col = Math.max(0, Math.min(SLOTS - 1, col))
    path.push(col)
  }
  return path
}

function calcWin(path, bet) {
  const slot = path[path.length - 1]
  const mult = MULTIPLIERS[slot]
  return { slot, mult, won: mult } // each ball is worth 1 token
}

function slotColor(m, active) {
  const ring = active ? " ring-2 ring-white z-10 scale-y-110" : ""
  if (m >= 100) return "bg-red-500 text-white" + ring
  if (m >= 20)  return "bg-orange-400 text-white" + ring
  if (m >= 5)   return "bg-yellow-400 text-black" + ring
  if (m >= 2)   return "bg-green-500 text-white" + ring
  if (m === 1)  return "bg-blue-500 text-white" + ring
  return "bg-gray-700 text-gray-400" + ring
}

export default function GambleModal({ onClose }) {
  const { balance, spendTokens, addTokens } = useTokens()
  const { increment } = useQuests()
  const [bet, setBet] = useState(5)
  const [dropping, setDropping] = useState(false)
  const [step, setStep] = useState(-1)
  const [displayPath, setDisplayPath] = useState(null)  // animated ball path
  const [allPaths, setAllPaths] = useState(null)        // all balls' paths
  const [result, setResult] = useState(null)

  const drop = () => {
    if (balance < bet || dropping) return
    spendTokens(bet)
    setResult(null)
    setDropping(true)
    increment("gamblesPlayed")

    // Build all ball paths (bet = number of balls)
    const paths = Array.from({ length: bet }, () => buildPath())
    setAllPaths(paths)
    setDisplayPath(paths[0]) // animate the first ball
    setStep(0)
  }

  useEffect(() => {
    if (!dropping || step < 0 || !displayPath) return
    if (step >= ROWS) {
      // Animation done — calculate all results
      let totalWon = 0
      let wins = 0
      allPaths.forEach(p => {
        const { won } = calcWin(p)
        totalWon += won
      })
      const lastSlot = displayPath[displayPath.length - 1]
      wins = allPaths.filter(p => {
        const m = MULTIPLIERS[p[p.length - 1]]
        return m > 1
      }).length

      if (totalWon > 0) addTokens(totalWon)
      const net = totalWon - bet
      if (net > 0) increment("gamblesWon")
      else increment("gamblesLost")

      setResult({ slot: lastSlot, totalWon, net, numBalls: bet })
      setDropping(false)
      return
    }
    const t = setTimeout(() => setStep(s => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [dropping, step])

  const ballCol = displayPath ? displayPath[Math.min(step, ROWS)] : START_COL
  const ballPct = (ballCol / (SLOTS - 1)) * 100
  const ballRowPct = step >= 0 ? (Math.min(step, ROWS) / ROWS) * 86 : 0

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl w-full max-w-md flex flex-col gap-3 p-5" style={{ background: "#7a1c1c" }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold tracking-wide">Plinko</h2>
          <button onClick={onClose} className="text-red-300 hover:text-white text-2xl leading-none">×</button>
        </div>

        <p className="text-red-200 text-sm">
          Balance: <span className="text-white font-bold">{balance}</span> tokens
          {dropping && <span className="ml-2 text-red-300">({bet} balls dropping...)</span>}
        </p>

        {/* Board */}
        <div className="relative rounded-lg overflow-hidden" style={{ background: "#5c1212" }}>
          <div className="relative" style={{ height: "260px" }}>

            {/* Pegs — row r has r+2 pegs, centered via flex justify-around */}
            <div className="absolute inset-0 flex flex-col justify-around px-4 pt-2 pb-8">
              {Array.from({ length: ROWS }).map((_, row) => (
                <div key={row} className="flex justify-around items-center">
                  {Array.from({ length: row + 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full flex-shrink-0"
                      style={{ width: 8, height: 8, background: "rgba(255,160,160,0.38)" }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Animated ball */}
            {(dropping || result) && (
              <div
                className="absolute transition-all pointer-events-none"
                style={{
                  left: `calc(${ballPct}% - 9px)`,
                  top: `calc(${ballRowPct}% + 4px)`,
                  transitionDuration: `${STEP_MS - 20}ms`,
                  transitionTimingFunction: "ease-in-out",
                  zIndex: 20
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 18, height: 18,
                    background: "radial-gradient(circle at 35% 35%, #ffffff, #60a5fa)",
                    boxShadow: "0 0 10px rgba(147,197,253,0.9)"
                  }}
                />
              </div>
            )}

            {/* Multiplier slots */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 px-1 pb-1">
              {MULTIPLIERS.map((m, i) => (
                <div
                  key={i}
                  className={`flex-1 text-center rounded font-bold transition-all relative ${slotColor(m, result?.slot === i)}`}
                  style={{ fontSize: "8px", padding: "3px 0" }}
                >
                  {m}x
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bet selector — each unit = 1 ball */}
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
          {dropping ? `Dropping ${bet} balls...` : `Drop ${bet} Ball${bet > 1 ? "s" : ""}`}
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
