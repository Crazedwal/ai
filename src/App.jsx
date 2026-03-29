// src/App.jsx
import { useChat } from "./hooks/useChat"
import { ThemeProvider } from "./hooks/useTheme.jsx"
import { LanguageProvider } from "./hooks/useLanguage.jsx"
import { AssistantNameProvider } from "./hooks/useAssistantName.jsx"
import { TokenProvider } from "./hooks/useTokens.jsx"
import { ModelProvider } from "./hooks/useModel.jsx"
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx"
import Sidebar from "./components/ui/sidebar/Sidebar"
import ChatArea from "./components/ui/chat/ChatArea"
import LoginPage from "./components/ui/auth/LoginPage"

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
    <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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

function AuthGate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <LanguageProvider>
      <TokenProvider>
        <ModelProvider>
          <AssistantNameProvider>
            <AppContent />
          </AssistantNameProvider>
        </ModelProvider>
      </TokenProvider>
    </LanguageProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
