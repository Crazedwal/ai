// src/components/chat/ChatArea.jsx
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import ChatInput from "./ChatInput"

function ChatArea({
  conversation,
  messages,
  onSendMessage,
  isLoading
}) {
  return (
    <main
      className="flex-1 flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <ChatHeader title={conversation?.title || "New Chat"} />
      <MessageList messages={messages} />
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </main>
  )
}

export default ChatArea
