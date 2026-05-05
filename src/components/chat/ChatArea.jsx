// src/components/chat/ChatArea.jsx
import { useState } from "react"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import ChatInput from "./ChatInput"

function ChatArea({
  conversation,
  messages,
  onSendMessage,
  isLoading
}) {
  const [error, setError] = useState(null)

  const handleSend = async (message) => {
    setError(null)
    try {
      await onSendMessage(message)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main
      className="flex-1 flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <ChatHeader title={conversation?.title || "New Chat"} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      <MessageList messages={messages} />
      <ChatInput onSendMessage={handleSend} isLoading={isLoading} />
    </main>
  )
}

export default ChatArea
