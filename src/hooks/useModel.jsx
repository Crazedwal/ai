// src/hooks/useModel.jsx
import { useState, createContext, useContext } from "react"
import { DEFAULT_MODEL_ID, getModel } from "@/lib/models"

const ModelContext = createContext()

export function ModelProvider({ children }) {
  const [selectedModelId, setSelectedModelId] = useState(() => {
    return localStorage.getItem("selectedModel") || DEFAULT_MODEL_ID
  })

  const selectModel = (id) => {
    setSelectedModelId(id)
    localStorage.setItem("selectedModel", id)
  }

  const selectedModel = getModel(selectedModelId)

  return (
    <ModelContext.Provider value={{ selectedModel, selectModel }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  return useContext(ModelContext)
}
