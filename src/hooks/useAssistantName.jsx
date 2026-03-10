// src/hooks/useAssistantName.jsx
import { useState, createContext, useContext } from "react"

const AssistantNameContext = createContext()

export function AssistantNameProvider({ children }) {
  const [assistantName, setAssistantName] = useState(() => {
    return localStorage.getItem("assistantName") || "Assistant"
  })

  const changeName = (name) => {
    const trimmed = name.trim() || "Assistant"
    setAssistantName(trimmed)
    localStorage.setItem("assistantName", trimmed)
  }

  return (
    <AssistantNameContext.Provider value={{ assistantName, changeName }}>
      {children}
    </AssistantNameContext.Provider>
  )
}

export function useAssistantName() {
  return useContext(AssistantNameContext)
}
