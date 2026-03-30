// src/components/ui/GambleModal.jsx
import { useState, useEffect } from "react"
import { useTokens } from "../../hooks/useTokens.jsx"
import { useQuests } from "../../hooks/useQuests.jsx"

const BETS = [5, 10, 25, 50]
const ROWS = 8
const MULTIPLIERS = [10, 3, 1.5, 0.5, 0, 0.5, 1.5, 3, 10]

function getMultiplierColor(m) {
  if (m >= 5) return "bg-green-500 text-white"
  if (m >= 2) return "bg-blue-500 text-white"
  if (m >= 1) return "bg-yellow-500 text-black"
  if (m > 0) return "bg-orange-500 text-white"
  return "bg-red-600 text-white"
}

function buildPath() {
  // Start at center column (col 4 out of 0-8)
  let col = 4
  const path = [col]
  for (let r = 0; r < ROWS; r++) {
    col = Math.random() < 0.5 ? col - 1 : col + 1
    col = Math.max(0, Math.min(8, col))
    path.push(col)
  }
  return path
}

export default function GambleModal({ onClose }) {
  const { balance, spendTokens, addTokens } = useTokens()
  const { increment } = useQuests()
  const [bet, setBet] = useState(10)
  const [dropping, setDropping] = useState(false)
  const [path, setPath] = useState(null)
  const [ballRow, setBallRow] = useState(-1)
  const [result, setResult] = useState(null)

  const drop = () => {
    if (balance < bet || dropping) return
    spendTokens(bet)
    setResult(null)
    setDropping(true)
    increment("gamblesPlayed")

    const newPath = buildPath()
    setPath(newPath)
    setBallRow(0)
  }

  useEffect(() => {
    if (!dropping || ballRow === -1 || !path) return
    if (ballRow >= path.length - 1) {
      // Ball landed
      const slot = path[path.length - 1]
      const mult = MULTIPLIERS[slot]
      const winAmount = Math.floor(bet * mult)
      if (winAmount > 0) addTokens(winAmount)
      const net = winAmount - bet
      if (net > 0) increment("gamblesWon")
      else increment("gamblesLost")
      setResult({ slot, mult, winAmount, net })
      setDropping(false)
      return
    }
    const t = setTimeout(() => setBallRow(r => r + 1), 200)
    return () => clearTimeout(t)
  }, [dropping, ballRow, path])

  const pegCols = (row) => {
    // Row 0 has 2 pegs, row 1 has 3, etc.
    const count = row + 2
    const cols = []
    const start = Math.floor((9 - count) / 2)
    for (let i = 0; i < count; i++) cols.push(start + i)
    return cols
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-sm p-5 flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">🔵 Plinko</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <p className="text-sm text-gray-400">Balance: <span className="text-white font-semibold">{balance} tokens</span></p>

        {/* Board */}
        <div className="bg-gray-800 rounded-lg p-3 relative">
          <div className="flex flex-col gap-1">
            {Array.from({ length: ROWS }).map((_, row) => {
              const pegs = pegCols(row)
              const ballCol = path && ballRow > row ? path[row + 1] : null
              const ballHere = path && ballRow === row + 1

              return (
                <div key={row} className="flex justify-around items-center h-6 relative">
                  {Array.from({ length: 9 }).map((_, col) => {
                    const isPeg = pegs.includes(col)
                    const isBall = ballHere && path[row + 1] === col
                    return (
                      <div key={col} className="w-5 h-5 flex items-center justify-center">
                        {isBall ? (
                          <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse z-10" />
                        ) : isPeg ? (
                          <div className="w-2 h-2 rounded-full bg-gray-500" />
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Ball at top before drop */}
          {!dropping && !result && (
            <div className="flex justify-center mb-1">
              <div className="w-4 h-4 rounded-full bg-blue-400 opacity-50" />
            </div>
          )}

          {/* Slots */}
          <div className="flex mt-2 gap-0.5">
            {MULTIPLIERS.map((m, i) => (
              <div
                key={i}
                className={`flex-1 text-center text-xs py-1 rounded font-bold transition-all ${getMultiplierColor(m)} ${result?.slot === i ? "ring-2 ring-white scale-110" : ""}`}
              >
                {m}x
              </div>
            ))}
          </div>
        </div>

        {/* Bet selector */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Bet amount</label>
          <div className="flex gap-2">
            {BETS.map(b => (
              <button
                key={b}
                onClick={() => setBet(b)}
                disabled={dropping}
                className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50 ${bet === b ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={drop}
          disabled={dropping || balance < bet}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
        >
          {dropping ? "Dropping..." : "Drop Ball"}
        </button>

        {result && (
          <div className={`text-center py-3 rounded-lg font-bold text-lg ${result.net > 0 ? "bg-green-800 text-green-300" : result.net === 0 ? "bg-gray-700 text-gray-300" : "bg-red-900 text-red-300"}`}>
            {result.mult}x → {result.winAmount} tokens
            <div className="text-sm font-normal mt-0.5">
              {result.net > 0 ? `+${result.net} profit` : result.net === 0 ? "Break even" : `${result.net} loss`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
