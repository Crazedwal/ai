// src/hooks/useChat.js
import { useState, useCallback } from "react"
import { mockConversations, generateMockResponse } from "../lib/mockData"

export function useChat() {
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversationId, setActiveConversationId] = useState(
    mockConversations[0]?.id || null
  )
  const [isLoading, setIsLoading] = useState(false)

  // Get current conversation
  const activeConversation = conversations.find(
    c => c.id === activeConversationId
  )

  // Get messages for current conversation
  const messages = activeConversation?.messages || []

  // Send a new message
  const sendMessage = useCallback(async (content) => {
    if (!activeConversationId) return

    // Create user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString()
    }

    // Add user message to conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          lastMessage: content
        }
      }
      return conv
    }))

    // Simulate AI response
    setIsLoading(true)

    // Simulate API delay (1-3 seconds)
    await new Promise(resolve =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    )

    // Create AI response
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: generateMockResponse(content),
      timestamp: new Date().toISOString()
    }

    // Add AI message to conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, aiMessage],
          lastMessage: aiMessage.content.slice(0, 50) + "..."
        }
      }
      return conv
    }))

    setIsLoading(false)
  }, [activeConversationId])

  // Create new conversation
  const createNewChat = useCallback(() => {
    const newConvo = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      lastMessage: "",
      createdAt: new Date().toISOString()
    }

    setConversations(prev => [newConvo, ...prev])
    setActiveConversationId(newConvo.id)
  }, [])

  return {
    conversations,
    activeConversation,
    messages,
    isLoading,
    sendMessage,
    setActiveConversationId,
    createNewChat
  }
}