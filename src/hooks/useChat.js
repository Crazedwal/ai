// src/hooks/useChat.js
import { useState, useCallback, useEffect } from "react"
import { sendMessage as sendToAPI } from "@/lib/api"
import { useModel } from "@/hooks/useModel"
import { useTokens } from "@/hooks/useTokens"
import { fetchStockData, extractTickers } from "@/lib/stockApi"

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}

const STOCK_SYSTEM = `You are a professional stock market analyst and financial advisor with 20 years of experience on Wall Street. When given live stock data, analyze it deeply and give clear, direct advice like a pro would. Cover:
- Whether the stock looks bullish or bearish right now
- Key price levels to watch (support/resistance)
- Short-term outlook (days/weeks)
- Risk level for this position
- A clear recommendation: Buy, Hold, or Avoid — and why
Be direct and confident. Use real financial terminology but explain it simply. Always remind the user that this is not official financial advice and they should do their own research.`

export function useChat() {
  const { selectedModel } = useModel()
  const { canAfford, spendTokens } = useTokens()
  const [stockMode, setStockMode] = useState(false)
  // ═══════════════════════════════════════════════════════════════
  // STATE: All the data our chat needs to track
  // ═══════════════════════════════════════════════════════════════
  const [conversations, setConversations] = useState([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString()
    }
  ])
  const [activeId, setActiveId] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Re-render when persona is saved from another tab (personality matchmaker)
  const [, setPersonaTick] = useState(0)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'userPersona') setPersonaTick(t => t + 1)
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  // ═══════════════════════════════════════════════════════════════
  // SYSTEM MESSAGE: Defines AI personality (sent with every request)
  // ═══════════════════════════════════════════════════════════════
  const persona      = readLS('userPersona')
  const constraints  = readLS('userConstraints')
  const kcd          = readLS('userKCD')

  const systemMessage = {
    role: "system",
    content: [
      stockMode ? STOCK_SYSTEM : "You are a helpful AI assistant. Be friendly, concise, and informative.",
      persona ? `User personality: ${persona.title} — ${persona.subtitle}. Keep this in mind subtly; don't overdo it.` : "",
      constraints?.who          ? `The user is: ${constraints.who}.` : "",
      constraints?.frustrations ? `Avoid: ${constraints.frustrations}.` : "",
      constraints?.comforts     ? `They prefer: ${constraints.comforts}.` : "",
      kcd?.keep   ? `They want to keep: ${kcd.keep}.` : "",
      kcd?.change ? `They want to change: ${kcd.change}.` : "",
      kcd?.delete ? `They want to let go of: ${kcd.delete}.` : "",
    ].filter(Boolean).join('\n')
  }

  // ═══════════════════════════════════════════════════════════════
  // DERIVED STATE: Computed from our main state
  // ═══════════════════════════════════════════════════════════════
  const activeConversation = conversations.find(c => c.id === activeId)
  const messages = activeConversation?.messages || []

  // ═══════════════════════════════════════════════════════════════
  // SEND MESSAGE: The main function that handles user input
  // ═══════════════════════════════════════════════════════════════
  const sendMessage = useCallback(async (content) => {
    // Guard: Don't send empty messages
    if (!content.trim()) return

    setError(null)  // Clear any previous error

    // Step 1: Create the user's message object
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString()
    }

    // Step 2: Immediately add user message to UI (optimistic update)
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          // Set title from first message
          title: conv.messages.length === 0
            ? content.slice(0, 30) + "..."
            : conv.title
        }
      }
      return conv
    }))

    // Step 3: Build the message array for the API
    const currentConvo = conversations.find(c => c.id === activeId)

    // If stock mode is on, detect tickers and fetch live data
    let enrichedContent = content
    if (stockMode) {
      const tickers = extractTickers(content)
      if (tickers.length > 0) {
        const results = await Promise.all(tickers.map(fetchStockData))
        const validData = results.filter(Boolean)
        if (validData.length > 0) {
          const dataBlock = validData.map(s =>
            `${s.ticker} (${s.exchange}): $${s.price} | Open: $${s.open} | High: $${s.high} | Low: $${s.low} | Prev Close: $${s.prevClose} | Change: ${s.change >= 0 ? '+' : ''}${s.change} (${s.changePct}%)`
          ).join('\n')
          enrichedContent = `${content}\n\n[LIVE MARKET DATA]\n${dataBlock}`
        }
      }
    }

    const apiMessages = [
      systemMessage,
      ...currentConvo.messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: "user", content: enrichedContent }
    ]

    // Step 4: Check token balance for paid models
    if (selectedModel.tier === "paid" && !canAfford(selectedModel.tokensPerMessage)) {
      setError(`Not enough tokens. This model costs ${selectedModel.tokensPerMessage} tokens per message. Buy more tokens to continue.`)
      return
    }

    // Step 5: Call the API
    setIsLoading(true)

    try {
      const aiResponse = await sendToAPI(apiMessages, selectedModel.id)

      // Deduct tokens for paid models
      if (selectedModel.tier === "paid") {
        spendTokens(selectedModel.tokensPerMessage)
      }

      // Step 6: Add AI response to conversation
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString()
      }

      setConversations(prev => prev.map(conv => {
        if (conv.id === activeId) {
          return {
            ...conv,
            messages: [...conv.messages, aiMessage]
          }
        }
        return conv
      }))

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [activeId, conversations, selectedModel, canAfford, spendTokens])

  // ═══════════════════════════════════════════════════════════════
  // CREATE NEW CHAT: Start a fresh conversation
  // ═══════════════════════════════════════════════════════════════
  const createNewChat = useCallback(() => {
    const newConvo = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString()
    }
    setConversations(prev => [newConvo, ...prev])
    setActiveId(newConvo.id)
    setError(null)
  }, [])

  // ═══════════════════════════════════════════════════════════════
  // RETURN: Everything components need to build the UI
  // ═══════════════════════════════════════════════════════════════
  return {
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    sendMessage,
    setActiveId,
    createNewChat,
    clearError: () => setError(null),
    stockMode,
    setStockMode
  }
}