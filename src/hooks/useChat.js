// src/hooks/useChat.js
import { useState, useCallback } from "react"
import { sendMessage as sendToAPI } from "@/lib/api"
import { useModel } from "@/hooks/useModel"
import { useTokens } from "@/hooks/useTokens"
import { useQuests } from "@/hooks/useQuests"

export function useChat() {
  const { selectedModel } = useModel()
  const { canAfford, spendTokens } = useTokens()
  const { increment } = useQuests()
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

  // ═══════════════════════════════════════════════════════════════
  // SYSTEM MESSAGE: Defines AI personality (sent with every request)
  // ═══════════════════════════════════════════════════════════════
  const systemMessage = {
    role: "system",
    content: "You are a helpful AI assistant. Be friendly, concise, and informative."
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
    // (includes system message + full conversation history)
    const currentConvo = conversations.find(c => c.id === activeId)
    const apiMessages = [
      systemMessage,
      ...currentConvo.messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: "user", content }
    ]

    // Step 4: Check token balance for paid models
    if (selectedModel.tier === "paid" && !canAfford(selectedModel.tokensPerMessage)) {
      setError(`Not enough tokens. This model costs ${selectedModel.tokensPerMessage} tokens per message. Buy more tokens to continue.`)
      return
    }

    // Step 5: Call the API
    setIsLoading(true)

    try {
      increment("messagesSent")
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
    clearError: () => setError(null)
  }
}