// src/components/sidebar/Sidebar.jsx
import { Button } from "@/components/ui/button"
import ConversationList from "./ConversationList"
import { useLanguage } from "../../../hooks/useLanguage.jsx"

function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat
}) {
  const { t, language, changeLanguage, availableLanguages, languageNames } = useLanguage()

  return (
    <aside
      className="w-64 bg-gray-900 text-white flex flex-col h-full transition-colors duration-300"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Ai</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent border-gray-600 hover:bg-gray-800"
        >
          <span>+</span>
          {t("newChat")}
        </Button>
      </div>

      {/* Conversation List */}
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={onSelectConversation}
      />

      {/* Language Selector */}
      <div className="p-3 border-t border-gray-700">
        <label className="text-xs text-gray-400 block mb-2">{t("language")}</label>
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        >
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {languageNames[lang]}
            </option>
          ))}
        </select>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            U
          </div>
          <span className="text-sm">{t("myAccount")}</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
