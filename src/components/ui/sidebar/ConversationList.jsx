// src/components/sidebar/ConversationList.jsx
import { cn } from "@/lib/utils"

function ConversationList({ conversations, activeId, onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      <h2 className="text-xs font-semibold text-gray-400 px-2 mb-2">
        Recent Conversations
      </h2>
      <div className="space-y-1">
        {conversations.map((convo) => (
          <button
            key={convo.id}
            onClick={() => onSelect(convo.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              "hover:bg-gray-800",
              activeId === convo.id
                ? "bg-gray-800 text-white"
                : "text-gray-300"
            )}
          >
            <p className="truncate font-medium">{convo.title}</p>
            <p className="text-xs text-gray-500 truncate">
              {convo.lastMessage}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ConversationList