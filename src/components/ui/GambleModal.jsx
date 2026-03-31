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
const BALL_R     = 6
// Physics constants
const GRAVITY    = 625    // px/s² downward acceleration (halved speed)
const VY_BOUNCE  = -50    // px/s upward kick when hitting a peg
const VX_IMPULSE = 55     // px/s horizontal kick on peg hit
const H_DECAY    = 5      // horizontal velocity decay rate (1/s)

const MULTIPLIERS = [500, 20, 5, 3, 0, 0, 1, 1, 1, 1, 0, 0, 3, 5, 20, 500]

const SLOT_COLORS = {
  500: "#e03030",
  20:  "#e07020",
  5:   "#d4b800",
  3:   "#22aa44",
  2:   "#2288dd",
  1:   "#4466cc",
  0:   "#444444",
}

const BALL_FILL    = "#7a0000"   // dark red body
const BALL_STROKE  = "#cc2222"   // medium red outline

function getPegX(r, j) { return (7.5 - r * 0.5 + j) * SPACING }
function getPegY(r)    { return ((r + 1) / (ROWS + 1)) * BOARD_H }
function getBallX(col) { return col * SPACING }

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

function drawBall(ctx, x, y) {
  ctx.beginPath()
  ctx.arc(x, y, BALL_R, 0, Math.PI * 2)
  ctx.fillStyle   = BALL_FILL
  ctx.strokeStyle = BALL_STROKE
  ctx.lineWidth   = 2.5
  ctx.fill()
  ctx.stroke()
}

function drawSlots(ctx, landedSlots) {
  const slotW = CANVAS_W / SLOTS
  MULTIPLIERS.forEach((m, i) => {
    const x     = i * slotW
    const y     = BOARD_H
    const isLit = landedSlots.includes(i)
    ctx.fillStyle = isLit ? "#ff6666" : (SLOT_COLORS[m] || "#444")
    ctx.fillRect(x + 0.5, y + 1, slotW - 1, SLOT_H - 2)
    if (isLit) {
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth   = 1.5
      ctx.strokeRect(x + 0.5, y + 1, slotW - 1, SLOT_H - 2)
    }
    ctx.fillStyle     = m === 5 ? "#000" : "#fff"
    ctx.font          = "bold 7.5px sans-serif"
    ctx.textAlign     = "center"
    ctx.textBaseline  = "middle"
    ctx.fillText(`${m}x`, x + slotW / 2, y + SLOT_H / 2)
  })
}

export default function GambleModal({ onClose }) {
  const { balance, spendTokens, addTokens } = useTokens()
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const addTokRef = useRef(addTokens)

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
    ctx.strokeStyle = "rgba(255,160,160,0.7)"
    ctx.lineWidth   = 2
    for (let d = 1; d < SLOTS; d++) {
      const x = d * SPACING
      ctx.beginPath()
      ctx.moveTo(x, BOARD_H - 8)
      ctx.lineTo(x, CANVAS_H)
      ctx.stroke()
    }
  }, [])

  useEffect(() => { drawStatic() }, [drawStatic])
  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  const drop = () => {
    if (balance < bet || dropping) return
    spendTokens(bet)
    setResult(null)
    setDropping(true)

    const paths = Array.from({ length: bet }, buildPath)

    // Dynamic stagger: faster for larger bets so total time stays ~3-4s
    const stagger = Math.max(30, Math.round(500 / paths.length))

    // Physics state for every ball
    const balls = paths.map((path, bi) => ({
      x:     getBallX(path[0]),
      y:     -BALL_R,
      vx:    0,
      vy:    0,
      row:   0,
      done:  false,
      path,
      delay: bi * stagger,
    }))

    cancelAnimationFrame(animRef.current)
    const startTime = performance.now()
    let lastTime    = null

    const failsafe = setTimeout(
      () => setDropping(false),
      stagger * balls.length + 6000
    )

    const frame = (now) => {
      try {
        if (lastTime === null) lastTime = now
        const dt      = Math.min((now - lastTime) / 1000, 0.033) // cap at ~30fps min
        lastTime      = now
        const elapsed = now - startTime

        // Update each ball's physics
        balls.forEach(ball => {
          if (ball.done || elapsed < ball.delay) return

          ball.vy += GRAVITY * dt
          ball.y  += ball.vy * dt
          const prevX = ball.x
          ball.x  += ball.vx * dt
          ball.vx *= Math.exp(-H_DECAY * dt)

          // Peg collision — loop handles skipping rows on large dt
          while (ball.row < ROWS) {
            if (ball.y >= getPegY(ball.row) - PEG_R - BALL_R) {
              ball.y  = getPegY(ball.row) - PEG_R - BALL_R
              ball.vy = VY_BOUNCE
              const dir = Math.sign(ball.path[ball.row + 1] - ball.path[ball.row])
              ball.vx   = dir * VX_IMPULSE
              ball.row++
            } else {
              break
            }
          }

          // Swept divider wall collisions — check if ball crossed a divider this frame
          if (ball.y + BALL_R >= BOARD_H - 8) {
            for (let d = 1; d < SLOTS; d++) {
              const divX = d * SPACING
              const leftEdge  = ball.x  - BALL_R
              const rightEdge = ball.x  + BALL_R
              const prevLeft  = prevX   - BALL_R
              const prevRight = prevX   + BALL_R
              const crossedRight = prevRight <= divX && rightEdge > divX
              const crossedLeft  = prevLeft  >= divX && leftEdge  < divX
              if (crossedRight) {
                ball.x  = divX - BALL_R
                ball.vx = -Math.abs(ball.vx) * 0.5
                break
              }
              if (crossedLeft) {
                ball.x  = divX + BALL_R
                ball.vx =  Math.abs(ball.vx) * 0.5
                break
              }
            }
          }

          // Ball disappears once fully below the canvas
          if (ball.row >= ROWS && ball.y > CANVAS_H + BALL_R) {
            ball.done      = true
            ball.finalSlot = Math.max(0, Math.min(SLOTS - 1, Math.floor(ball.x / SPACING)))
          }
        })

        const canvas = canvasRef.current
        if (!canvas) {
          if (!balls.every(b => b.done)) animRef.current = requestAnimationFrame(frame)
          return
        }
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          if (!balls.every(b => b.done)) animRef.current = requestAnimationFrame(frame)
          return
        }

        // Draw board + pegs
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
        ctx.fillStyle = "#5c1212"
        ctx.fillRect(0, 0, CANVAS_W, BOARD_H)
        for (let r = 0; r < ROWS; r++)
          for (let j = 0; j <= r; j++)
            drawPeg(ctx, getPegX(r, j), getPegY(r))

        // Draw balls that have started
        balls.forEach(ball => {
          if (elapsed >= ball.delay) drawBall(ctx, ball.x, ball.y)
        })

        drawSlots(ctx, [])

        // Draw divider lines between slots
        ctx.strokeStyle = "rgba(255,160,160,0.7)"
        ctx.lineWidth   = 2
        for (let d = 1; d < SLOTS; d++) {
          const x = d * SPACING
          ctx.beginPath()
          ctx.moveTo(x, BOARD_H - 8)
          ctx.lineTo(x, CANVAS_H)
          ctx.stroke()
        }

        if (!balls.every(b => b.done)) {
          animRef.current = requestAnimationFrame(frame)
          return
        }

        // All visual balls done — compute and show results
        clearTimeout(failsafe)
        let totalWon = 0
        const slots  = []
        balls.forEach(ball => {
          const slot = ball.finalSlot ?? Math.max(0, Math.min(SLOTS - 1, Math.floor(ball.path[ROWS])))
          slots.push(slot)
          totalWon += MULTIPLIERS[slot] || 0
        })
        if (totalWon > 0) addTokRef.current(totalWon)
        const net = totalWon - paths.length

        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
        ctx.fillStyle = "#5c1212"
        ctx.fillRect(0, 0, CANVAS_W, BOARD_H)
        for (let r = 0; r < ROWS; r++)
          for (let j = 0; j <= r; j++)
            drawPeg(ctx, getPegX(r, j), getPegY(r))
        drawSlots(ctx, slots)
        ctx.strokeStyle = "rgba(255,160,160,0.7)"
        ctx.lineWidth   = 2
        for (let d = 1; d < SLOTS; d++) {
          const x = d * SPACING
          ctx.beginPath()
          ctx.moveTo(x, BOARD_H - 8)
          ctx.lineTo(x, CANVAS_H)
          ctx.stroke()
        }

        setResult({ totalWon, net, numBalls: paths.length, slots })
        setDropping(false)

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

        <p className="text-red-200 text-sm">
          Balance: <span className="text-white font-bold">{balance}</span> tokens
        </p>

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
          {dropping
            ? `Dropping ${bet} ball${bet > 1 ? "s" : ""}...`
            : `Drop ${bet} Ball${bet > 1 ? "s" : ""}`}
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
