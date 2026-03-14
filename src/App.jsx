// src/App.jsx
import { useChat } from "./hooks/useChat"
import { ThemeProvider } from "./hooks/useTheme.jsx"
import { LanguageProvider } from "./hooks/useLanguage.jsx"
import { AssistantNameProvider } from "./hooks/useAssistantName.jsx"
import { TokenProvider } from "./hooks/useTokens.jsx"
import { ModelProvider } from "./hooks/useModel.jsx"
import Sidebar from "./components/ui/sidebar/Sidebar"
import ChatArea from "./components/ui/chat/ChatArea"

function AppContent() {
  const {
    conversations,
    activeConversation,
    messages,
    isLoading,
    sendMessage,
    setActiveId,
    createNewChat
  } = useChat()

  return (
    <div
      className="flex h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <Sidebar
        conversations={conversations}
        activeId={activeConversation?.id}
        onSelectConversation={setActiveId}
        onNewChat={createNewChat}
      />
      <ChatArea
        conversation={activeConversation}
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TokenProvider>
          <ModelProvider>
            <AssistantNameProvider>
              <AppContent />
            </AssistantNameProvider>
          </ModelProvider>
        </TokenProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App

