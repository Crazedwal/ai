// src/components/ui/QuestsModal.jsx
import { useQuests } from "../../hooks/useQuests.jsx"

export default function QuestsModal({ onClose }) {
  const { quests } = useQuests()

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-sm p-6 flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">📋 Quests</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <div className="space-y-3">
          {quests.map(q => (
            <div key={q.id} className={`p-3 rounded-lg border ${q.done ? "border-green-700 bg-green-900/20" : "border-gray-700 bg-gray-800"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${q.done ? "text-green-400 line-through" : "text-white"}`}>{q.label}</span>
                <span className="text-xs text-yellow-400 font-semibold">+{q.reward} 🪙</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${q.done ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${(q.progress / q.goal) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{q.progress}/{q.goal}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
