// src/components/ui/GambleModal.jsx
import { useState, useEffect, useRef, useCallback } from "react"
import { useTokens } from "../../hooks/useTokens.jsx"

const BETS       = [5, 10, 25, 50]
const ROWS       = 15
const SLOTS      = 16
const CANVAS_W   = 400
const CANVAS_H   = 320
const SLOT_H     = 26
const BOARD_H    = CANVAS_H - SLOT_H
const SPACING    = CANVAS_W / SLOTS   // 25px
const PEG_R      = 4
const BALL_R     = 9
const STEP_MS    = 280
const MAX_VISUAL = 10

const MULTIPLIERS = [500, 20, 5, 3, 2, 0, 1, 1, 1, 1, 0, 2, 3, 5, 20, 500]

const SLOT_COLORS = {
  500: "#e03030",
  20:  "#e07020",
  5:   "#d4b800",
  3:   "#22aa44",
  2:   "#2288dd",
  1:   "#4466cc",
  0:   "#444444",
}

const BALL_COLORS = [
  "#44cc44", "#ddaa00", "#3399ee", "#9944ee",
  "#dd3333", "#ee6600", "#22bbaa", "#cc44aa",
  "#66cc22", "#ee4488"
]

function getPegX(r, j) { return (7.5 - r * 0.5 + j) * SPACING }
function getPegY(r)    { return ((r + 1) / (ROWS + 1)) * BOARD_H }
function getBallX(col) { return col * SPACING }
function getBallY(s)   { return (s / ROWS) * (BOARD_H - BALL_R * 2) + BALL_R }

function easeInOut(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t }

function buildPath() {
  let col = 7.5
  const path = [col]
  for (let i = 0; i < ROWS; i++) {
    col += Math.random() < 0.5 ? -0.5 : 0.5
    path.push(col)
  }
  return path
}

function drawPeg(ctx, x, y) {
  ctx.beginPath()
  ctx.arc(x, y, PEG_R, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(255,140,140,0.4)"
  ctx.fill()
}

function drawBall(ctx, x, y, color) {
  // Shadow
  ctx.beginPath()
  ctx.arc(x + 1, y + 2, BALL_R, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(0,0,0,0.35)"
  ctx.fill()

  // Main body
  ctx.beginPath()
  ctx.arc(x, y, BALL_R, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()

  // Inner ring
  ctx.beginPath()
  ctx.arc(x, y, BALL_R * 0.72, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(255,255,255,0.25)"
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Outer ring
  ctx.beginPath()
  ctx.arc(x, y, BALL_R, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(0,0,0,0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // Shine highlight
  try {
    const shine = ctx.createRadialGradient(
      x - BALL_R * 0.32, y - BALL_R * 0.38, BALL_R * 0.05,
      x - BALL_R * 0.1,  y - BALL_R * 0.1,  BALL_R
    )
    shine.addColorStop(0,   "rgba(255,255,255,0.75)")
    shine.addColorStop(0.4, "rgba(255,255,255,0.15)")
    shine.addColorStop(1,   "rgba(255,255,255,0)")
    ctx.beginPath()
    ctx.arc(x, y, BALL_R, 0, Math.PI * 2)
    ctx.fillStyle = shine
    ctx.fill()
  } catch (_) {}
}

function drawSlots(ctx, landedSlots) {
  const slotW = CANVAS_W / SLOTS
  MULTIPLIERS.forEach((m, i) => {
    const x = i * slotW
    const y = BOARD_H
    const isLit = landedSlots.includes(i)
    const color = SLOT_COLORS[m] || "#444"
    ctx.fillStyle = isLit ? "#ff6666" : color
    ctx.fillRect(x + 0.5, y + 1, slotW - 1, SLOT_H - 2)

    if (isLit) {
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1.5
      ctx.strokeRect(x + 0.5, y + 1, slotW - 1, SLOT_H - 2)
    }

    ctx.fillStyle = m === 5 ? "#000" : "#fff"
    ctx.font = `bold 7.5px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${m}x`, x + slotW / 2, y + SLOT_H / 2)
  })
}

export default function GambleModal({ onClose }) {
  const { balance, spendTokens, addTokens } = useTokens()
  const canvasRef  = useRef(null)
  const animRef    = useRef(null)
  const addTokRef  = useRef(addTokens)

  useEffect(() => { addTokRef.current = addTokens }, [addTokens])

  const [bet, setBet]           = useState(5)
  const [dropping, setDropping] = useState(false)
  const [result, setResult]     = useState(null)

  const drawStatic = useCallback((landedSlots = []) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.fillStyle = "#5c1212"
    ctx.fillRect(0, 0, CANVAS_W, BOARD_H)
    for (let r = 0; r < ROWS; r++)
      for (let j = 0; j <= r; j++)
        drawPeg(ctx, getPegX(r, j), getPegY(r))
    drawSlots(ctx, landedSlots)
  }, [])

  useEffect(() => { drawStatic() }, [drawStatic])
  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  const drop = () => {
    if (balance < bet || dropping) return
    spendTokens(bet)
    setResult(null)
    setDropping(true)

    const paths = Array.from({ length: bet }, buildPath)

    cancelAnimationFrame(animRef.current)
    const startTime = performance.now()

    // Failsafe: always clear dropping state after max expected duration
    const failsafe = setTimeout(() => {
      setDropping(false)
    }, STEP_MS * (ROWS + 3))

    const frame = (now) => {
      try {
        const elapsed  = now - startTime
        const rawStep  = elapsed / STEP_MS
        const stepIdx  = Math.min(Math.floor(rawStep), ROWS - 1)
        const t        = rawStep - stepIdx

        const canvas = canvasRef.current
        if (!canvas) {
          // Canvas temporarily unavailable — keep looping
          if (rawStep < ROWS) animRef.current = requestAnimationFrame(frame)
          return
        }
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          if (rawStep < ROWS) animRef.current = requestAnimationFrame(frame)
          return
        }

        // Board
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
        ctx.fillStyle = "#5c1212"
        ctx.fillRect(0, 0, CANVAS_W, BOARD_H)

        // Pegs
        for (let r = 0; r < ROWS; r++)
          for (let j = 0; j <= r; j++)
            drawPeg(ctx, getPegX(r, j), getPegY(r))

        // Balls — each staggered by 100ms
        const STAGGER_MS = 100
        const visualPaths = paths.slice(0, MAX_VISUAL)
        visualPaths.forEach((path, bi) => {
          const ballElapsed = elapsed - bi * STAGGER_MS
          if (ballElapsed <= 0) return  // not started yet
          const ballRaw  = ballElapsed / STEP_MS
          const ballStep = Math.min(Math.floor(ballRaw), ROWS - 1)
          const ballT    = ballRaw - ballStep
          const s1 = ballStep
          const s2 = Math.min(ballStep + 1, ROWS)
          const x1 = getBallX(path[s1]), x2 = getBallX(path[s2])
          const y1 = getBallY(s1),       y2 = getBallY(s2)
          const et = easeInOut(Math.min(ballT, 1))
          drawBall(ctx, x1 + (x2 - x1) * et, y1 + (y2 - y1) * et, BALL_COLORS[bi % BALL_COLORS.length])
        })

        drawSlots(ctx, [])

        const lastBallOffset = (Math.min(paths.length, MAX_VISUAL) - 1) * STAGGER_MS
        const totalDone = elapsed >= STEP_MS * ROWS + lastBallOffset

        if (!totalDone) {
          animRef.current = requestAnimationFrame(frame)
        } else {
          clearTimeout(failsafe)

          // Compute results
          let totalWon = 0
          const slots = []
          paths.forEach(p => {
            const slot = Math.round(p[p.length - 1])
            slots.push(slot)
            totalWon += MULTIPLIERS[slot] || 0
          })
          if (totalWon > 0) addTokRef.current(totalWon)
          const net = totalWon - paths.length
          // Draw final state with lit slots
          ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
          ctx.fillStyle = "#5c1212"
          ctx.fillRect(0, 0, CANVAS_W, BOARD_H)
          for (let r = 0; r < ROWS; r++)
            for (let j = 0; j <= r; j++)
              drawPeg(ctx, getPegX(r, j), getPegY(r))
          drawSlots(ctx, slots)

          setResult({ totalWon, net, numBalls: paths.length, slots })
          setDropping(false)
        }
      } catch (err) {
        console.error("Plinko frame error:", err)
        clearTimeout(failsafe)
        setDropping(false)
      }
    }

    animRef.current = requestAnimationFrame(frame)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl flex flex-col gap-3 p-5" style={{ background: "#7a1c1c", width: CANVAS_W + 40 }}>

        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">Plinko</h2>
          <button onClick={onClose} className="text-red-300 hover:text-white text-2xl leading-none">×</button>
        </div>

        <p className="text-red-200 text-sm">Balance: <span className="text-white font-bold">{balance}</span> tokens</p>

        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-lg block"
          style={{ background: "#5c1212" }}
        />

        <div>
          <label className="text-xs text-red-300 block mb-1.5">
            Balls to drop <span className="text-red-400">(1 token each)</span>
          </label>
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
