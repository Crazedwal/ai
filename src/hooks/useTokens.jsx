// src/hooks/useTokens.jsx
import { useState, createContext, useContext } from "react"

const TokenContext = createContext()

export function TokenProvider({ children }) {
  const [balance, setBalance] = useState(() => {
    return parseInt(localStorage.getItem("tokenBalance") || "0", 10)
  })

  const spendTokens = (amount) => {
    setBalance(prev => {
      const next = prev - amount
      localStorage.setItem("tokenBalance", next)
      return next
    })
  }

  const addTokens = (amount) => {
    setBalance(prev => {
      const next = prev + amount
      localStorage.setItem("tokenBalance", next)
      return next
    })
  }

  const canAfford = (amount) => balance >= amount

  return (
    <TokenContext.Provider value={{ balance, spendTokens, addTokens, canAfford }}>
      {children}
    </TokenContext.Provider>
  )
}

export function useTokens() {
  return useContext(TokenContext)
}
