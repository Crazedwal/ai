// src/hooks/useChat.js
import { useState, useCallback, useEffect } from "react"
import { sendMessage as sendToAPI } from "@/lib/api"
import { useModel } from "@/hooks/useModel"
import { useTokens } from "@/hooks/useTokens"

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}

export function useChat() {
  const { selectedModel } = useModel()
  const { canAfford, spendTokens } = useTokens()
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
  const profile      = readLS('userProfile')

  const systemMessage = {
    role: "system",
    content: [
      "You are a helpful AI assistant. Be friendly, concise, and informative.",
      // User profile
      profile?.name        ? `The user's name is ${profile.name}.` : "",
      profile?.occupation  ? `They work as: ${profile.occupation}.` : "",
      profile?.industry    ? `Their industry: ${profile.industry}.` : "",
      profile?.expertise   ? `Their AI expertise level: ${profile.expertise}.` : "",
      profile?.uses?.length ? `They mainly use AI for: ${profile.uses.join(", ")}.` : "",
      profile?.responseStyle === "Concise"  ? "Keep responses short and to the point." : "",
      profile?.responseStyle === "Detailed" ? "Give thorough, detailed responses." : "",
      profile?.tone === "Technical"    ? "Use technical language and precision." : "",
      profile?.tone === "Casual"       ? "Keep a casual, conversational tone." : "",
      profile?.tone === "Professional" ? "Maintain a professional tone." : "",
      // Persona
      persona ? `User personality type: ${persona.title} — ${persona.subtitle}. Keep this in mind subtly.` : "",
      // Constraints
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