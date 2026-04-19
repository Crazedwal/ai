// src/components/chat/ChatHeader.jsx
import { useTheme } from "../../../hooks/useTheme.jsx"

function ChatHeader({ title }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h2>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">DeepSeek Model</span>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader
