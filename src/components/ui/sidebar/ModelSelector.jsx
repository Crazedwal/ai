// src/components/sidebar/ModelSelector.jsx
import { useState } from "react"
import { MODELS } from "@/lib/models"
import { useModel } from "@/hooks/useModel"
import { useTokens } from "@/hooks/useTokens"

function ModelSelector() {
  const { selectedModel, selectModel } = useModel()
  const { balance } = useTokens()
  const [open, setOpen] = useState(false)

  const freeModels = MODELS.filter(m => m.tier === "free")
  const paidModels = MODELS.filter(m => m.tier === "paid")

  return (
    <div className="relative">
      <label className="text-xs text-gray-400 block mb-2">AI Model</label>

      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-2 py-1.5 bg-gray-800 border border-gray-600 rounded text-sm hover:border-blue-500 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${
            selectedModel.tier === "free"
              ? "bg-green-800 text-green-300"
              : "bg-yellow-800 text-yellow-300"
          }`}>
            {selectedModel.tier === "free" ? "FREE" : `${selectedModel.tokensPerMessage}🪙`}
          </span>
          <span className="truncate text-white">{selectedModel.name}</span>
        </div>
        <span className="text-gray-400 ml-1 shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full mb-1 left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10 overflow-hidden">

          {/* Free section */}
          <div className="px-2 pt-2 pb-1">
            <p className="text-xs text-green-400 font-semibold px-1 mb-1">Free</p>
            {freeModels.map(model => (
              <button
                key={model.id}
                onClick={() => { selectModel(model.id); setOpen(false) }}
                className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between hover:bg-gray-700 transition-colors ${
                  selectedModel.id === model.id ? "bg-gray-700" : ""
                }`}
              >
                <div>
                  <div className="text-white font-medium">{model.name}</div>
                  <div className="text-xs text-gray-400">{model.description}</div>
                </div>
                <span className="text-xs bg-green-800 text-green-300 px-1.5 py-0.5 rounded ml-2 shrink-0">FREE</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-700 mx-2" />

          {/* Paid section */}
          <div className="px-2 pt-1 pb-2">
            <p className="text-xs text-yellow-400 font-semibold px-1 mb-1 mt-1">Premium</p>
            {paidModels.map(model => {
              const affordable = balance >= model.tokensPerMessage
              return (
                <button
                  key={model.id}
                  onClick={() => { selectModel(model.id); setOpen(false) }}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between transition-colors ${
                    selectedModel.id === model.id ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  <div>
                    <div className={`font-medium ${affordable ? "text-white" : "text-gray-500"}`}>
                      {model.name}
                    </div>
                    <div className="text-xs text-gray-400">{model.description}</div>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                    affordable
                      ? "bg-yellow-800 text-yellow-300"
                      : "bg-gray-700 text-gray-500"
                  }`}>
                    {model.tokensPerMessage}🪙/msg
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ModelSelector
