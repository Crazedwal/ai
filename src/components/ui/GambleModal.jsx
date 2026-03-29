// src/components/ui/GambleModal.jsx
import { useState } from "react"
import { useTokens } from "../../hooks/useTokens.jsx"
import { useQuests } from "../../hooks/useQuests.jsx"

const BETS = [5, 10, 25, 50]

export default function GambleModal({ onClose }) {
  const { balance, spendTokens, addTokens } = useTokens()
  const { increment } = useQuests()
  const [bet, setBet] = useState(10)
  const [result, setResult] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const gamble = () => {
    if (balance < bet) return
    setSpinning(true)
    setResult(null)

    setTimeout(() => {
      const win = Math.random() < 0.45
      increment("gamblesPlayed")
      if (win) {
        addTokens(bet)
        increment("gamblesWon")
        setResult({ win: true, amount: bet })
      } else {
        spendTokens(bet)
        setResult({ win: false, amount: bet })
      }
      setSpinning(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-sm p-6 flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">🎰 Gamble Tokens</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <p className="text-sm text-gray-400">Balance: <span className="text-white font-semibold">{balance} tokens</span></p>

        <div>
          <label className="text-xs text-gray-400 block mb-2">Bet amount</label>
          <div className="flex gap-2">
            {BETS.map(b => (
              <button
                key={b}
                onClick={() => setBet(b)}
                className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${bet === b ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={gamble}
          disabled={spinning || balance < bet}
          className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded transition-colors"
        >
          {spinning ? "Spinning..." : "Gamble"}
        </button>

        {result && (
          <div className={`text-center py-3 rounded-lg font-bold text-lg ${result.win ? "bg-green-800 text-green-300" : "bg-red-900 text-red-300"}`}>
            {result.win ? `+${result.amount} tokens` : `-${result.amount} tokens`}
            <div className="text-sm font-normal mt-0.5">{result.win ? "You won!" : "Better luck next time"}</div>
          </div>
        )}

        <p className="text-xs text-gray-600 text-center">45% chance to double your bet</p>
      </div>
    </div>
  )
}
