// src/components/sidebar/Sidebar.jsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import ConversationList from "./ConversationList"
import ModelSelector from "./ModelSelector"
import PaymentPage from "@/components/ui/PaymentPage"
import DevLog from "@/components/ui/DevLog"
import { useLanguage } from "../../../hooks/useLanguage.jsx"
import { useAssistantName } from "../../../hooks/useAssistantName.jsx"
import { useTokens } from "../../../hooks/useTokens.jsx"

function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat
}) {
  const { t, language, changeLanguage, availableLanguages, languageNames } = useLanguage()
  const { assistantName, changeName } = useAssistantName()
  const { balance } = useTokens()
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState("")
  const [showPurchase, setShowPurchase] = useState(false)
  const [showDevLog, setShowDevLog] = useState(false)

  const startEdit = () => { setNameDraft(assistantName); setEditingName(true) }
  const commitEdit = () => { changeName(nameDraft); setEditingName(false) }

  return (
    <>
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-full transition-colors duration-300">

        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Ai</h1>
        </div>

        {/* Token balance */}
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            🪙 <span className="text-white font-semibold">{balance}</span> tokens
          </span>
          <button
            onClick={() => setShowPurchase(true)}
            className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
          >
            Buy
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pb-2">
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

        {/* Model Selector */}
        <div className="p-3 border-t border-gray-700">
          <ModelSelector />
        </div>

        {/* Assistant Name */}
        <div className="p-3 border-t border-gray-700">
          <label className="text-xs text-gray-400 block mb-2">Assistant name</label>
          {editingName ? (
            <div className="flex gap-1">
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit()
                  if (e.key === "Escape") setEditingName(false)
                }}
                className="flex-1 bg-gray-800 border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none"
              />
              <button
                onClick={commitEdit}
                className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={startEdit}
              className="w-full text-left px-2 py-1.5 bg-gray-800 border border-gray-600 rounded text-sm hover:border-blue-500 transition-colors"
            >
              {assistantName}
            </button>
          )}
        </div>

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

        {/* DevLog Button */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={() => setShowDevLog(true)}
            className="w-full text-left text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Changelog / Devlog / Reflection
          </button>
        </div>

      </aside>

      {showPurchase && <PaymentPage onClose={() => setShowPurchase(false)} />}
      {showDevLog && <DevLog onClose={() => setShowDevLog(false)} />}
    </>
  )
}

export default Sidebar
