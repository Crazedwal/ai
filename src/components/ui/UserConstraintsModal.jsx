import { useState, useEffect } from "react"

const STORAGE_KEY = "userConstraints"

export function loadConstraints() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") } catch { return null }
}

function UserConstraintsModal({ onClose }) {
  const [who, setWho] = useState("")
  const [frustrations, setFrustrations] = useState("")
  const [comforts, setComforts] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const existing = loadConstraints()
    if (existing) {
      setWho(existing.who || "")
      setFrustrations(existing.frustrations || "")
      setComforts(existing.comforts || "")
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ who, frustrations, comforts }))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setWho("")
    setFrustrations("")
    setComforts("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-white font-semibold text-base">User Constraints</h2>
            <p className="text-gray-400 text-xs mt-0.5">Help the AI understand you better</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>

        {/* Fields */}
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Who */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1.5">
              Who are you?
            </label>
            <input
              value={who}
              onChange={e => setWho(e.target.value)}
              placeholder="e.g. a developer, student, designer..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Frustrations */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1.5">
              Frustrations
            </label>
            <textarea
              value={frustrations}
              onChange={e => setFrustrations(e.target.value)}
              placeholder="e.g. overly verbose answers, unnecessary disclaimers..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Comforts */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide block mb-1.5">
              Comforts
            </label>
            <textarea
              value={comforts}
              onChange={e => setComforts(e.target.value)}
              placeholder="e.g. code examples, short answers, step-by-step breakdowns..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-700">
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
            >
              {saved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserConstraintsModal
