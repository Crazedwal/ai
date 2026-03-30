// src/components/ui/GambleModal.jsx
import { useState, useEffect } from "react"
import { useTokens } from "../../hooks/useTokens.jsx"
import { useQuests } from "../../hooks/useQuests.jsx"

const BETS        = [5, 10, 25, 50]
const ROWS        = 15          // odd → final col always integer
const SLOTS       = 16
const BOARD_W     = 400
const BOARD_H     = 300
const SPACING     = BOARD_W / SLOTS   // 25 px
const STEP_MS     = 220
const MAX_VISUAL  = 10
const PEG_R       = 4
const BALL_R      = 8

// Row r has r+1 pegs (r = 0..ROWS-1)
// Peg j of row r is at slot position  (7.5 - r*0.5 + j)
// This perfectly matches the ball's ±0.5 movement
function getPegX(r, j) { return (7.5 - r * 0.5 + j) * SPACING }
function getPegY(r)    { return ((r + 1) / (ROWS + 1)) * (BOARD_H - 28) }  // leave room for slots

// Ball at float col (0..15 after ROWS=15 odd steps)
function getBallX(col) { return col * SPACING }
function getBallY(s)   { return (s / ROWS) * (BOARD_H - 36) }

const MULTIPLIERS = [500, 20, 5, 3, 2, 1, 0, 0, 0, 0, 1, 2, 3, 5, 20, 500]

function buildPath() {
  let col = 7.5   // true center — between the 2 natural top gaps
  const path = [col]
  for (let i = 0; i < ROWS; i++) {
    col += Math.random() < 0.5 ? -0.5 : 0.5   // pure 50/50
    // No extra clamping needed: after ROWS=15 odd steps from 7.5, range is exactly 0..15
    path.push(col)
  }
  return path
}

function slotColor(m, active) {
  const ring = active ? " ring-2 ring-white" : ""
  if (m >= 100) return "bg-red-500 text-white" + ring
  if (m >= 20)  return "bg-orange-400 text-white" + ring
  if (m >= 5)   return "bg-yellow-400 text-black" + ring
  if (m >= 2)   return "bg-green-500 text-white" + ring
  if (m === 1)  return "bg-blue-500 text-white" + ring
  return "bg-gray-700 text-gray-400" + ring
}

const COLORS = [
  "#93c5fd","#fca5a5","#86efac","#fde047","#d8b4fe",
  "#fdba74","#67e8f9","#f9a8d4","#bef264","#e879f9"
]

export default function GambleModal({ onClose }) {
  const { balance, spendTokens, addTokens } = useTokens()
  const { increment } = useQuests()
  const [bet, setBet]         = useState(5)
  const [dropping, setDropping] = useState(false)
  const [step, setStep]       = useState(-1)
  const [allPaths, setAllPaths] = useState([])
  const [result, setResult]   = useState(null)

  const drop = () => {
    if (balance < bet || dropping) return
    spendTokens(bet)
    setResult(null)
    setDropping(true)
    increment("gamblesPlayed")
    increment("ballsDropped", bet)
    setAllPaths(Array.from({ length: bet }, buildPath))
    setStep(0)
  }

  useEffect(() => {
    if (!dropping || step < 0) return
    if (step >= ROWS) {
      let totalWon = 0
      allPaths.forEach(p => { totalWon += MULTIPLIERS[Math.round(p[p.length - 1])] })
      if (totalWon > 0) addTokens(totalWon)
      const net = totalWon - bet
      if (net > 0) increment("gamblesWon"); else increment("gamblesLost")
      setResult({ totalWon, net, numBalls: bet, slots: allPaths.map(p => Math.round(p[p.length - 1])) })
      setDropping(false)
      return
    }
    const t = setTimeout(() => setStep(s => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [dropping, step])

  const s = Math.max(0, step)
  const visualPaths = allPaths.slice(0, MAX_VISUAL)

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl flex flex-col gap-3 p-5" style={{ background: "#7a1c1c", width: BOARD_W + 40 }}>

        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Plinko</h2>
          <button onClick={onClose} className="text-red-300 hover:text-white text-2xl leading-none">×</button>
        </div>

        <p className="text-red-200 text-sm">Balance: <span className="text-white font-bold">{balance}</span> tokens</p>

        {/* Board */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#5c1212" }}>
          <div className="relative mx-auto" style={{ width: BOARD_W, height: BOARD_H }}>

            {/* Pegs */}
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: r + 1 }).map((_, j) => (
                <div
                  key={`${r}-${j}`}
                  className="absolute rounded-full"
                  style={{
                    width: PEG_R * 2, height: PEG_R * 2,
                    left: getPegX(r, j) - PEG_R,
                    top:  getPegY(r)    - PEG_R,
                    background: "rgba(255,150,150,0.4)"
                  }}
                />
              ))
            )}

            {/* Balls — all animate simultaneously */}
            {(dropping || result) && visualPaths.map((path, bi) => {
              const col  = path[Math.min(s, ROWS)]
              const bx   = getBallX(col) - BALL_R
              const by   = dropping ? getBallY(s) : getBallY(ROWS)
              return (
                <div
                  key={bi}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: BALL_R * 2, height: BALL_R * 2,
                    left: bx, top: by,
                    background: `radial-gradient(circle at 35% 35%, #fff, ${COLORS[bi % COLORS.length]})`,
                    boxShadow: `0 0 8px ${COLORS[bi % COLORS.length]}aa`,
                    transition: `left ${STEP_MS - 20}ms ease-in-out, top ${STEP_MS - 20}ms ease-in-out`,
                    opacity: result ? 0 : 1,
                    zIndex: 10 + bi
                  }}
                />
              )
            })}

            {/* Slot bar */}
            <div className="absolute bottom-0 left-0 right-0 flex">
              {MULTIPLIERS.map((m, i) => {
                const count = result ? result.slots.filter(x => x === i).length : 0
                return (
                  <div
                    key={i}
                    className={`flex-1 text-center font-bold relative transition-all ${slotColor(m, count > 0)}`}
                    style={{ fontSize: "8px", padding: "3px 0" }}
                  >
                    {m}x
                    {count > 0 && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold bg-black/50 rounded px-0.5">
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
          <label className="text-xs text-red-300 block mb-1.5">Balls to drop <span className="text-red-400">(1 token each)</span></label>
          <div className="flex gap-2">
            {BETS.map(b => (
              <button key={b} onClick={() => setBet(b)} disabled={dropping}
                className={`flex-1 py-1.5 rounded text-sm font-bold transition-colors disabled:opacity-50 ${
                  bet === b ? "bg-white text-red-800" : "bg-red-900 text-red-200 hover:bg-red-800"}`}>
                {b}
              </button>
            ))}
          </div>
        </div>

        <button onClick={drop} disabled={dropping || balance < bet}
          className="w-full py-2.5 rounded-lg font-bold text-white text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: dropping ? "#555" : "#c0392b" }}>
          {dropping ? `Dropping ${bet} ball${bet > 1 ? "s" : ""}...` : `Drop ${bet} Ball${bet > 1 ? "s" : ""}`}
        </button>

        {result && (
          <div className={`text-center py-3 rounded-lg font-bold text-lg ${
            result.net > 0 ? "bg-green-800 text-green-200" :
            result.net === 0 ? "bg-gray-700 text-gray-300" : "bg-red-950 text-red-300"}`}>
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
