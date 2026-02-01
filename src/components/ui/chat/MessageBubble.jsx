import { cn } from "@/lib/utils"

function MessageBubble({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isUser
          ? "bg-blue-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
      )}>
        {/* Avatar and Label */}
        <div className="flex items-center gap-2 mb-1">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            isUser ? "bg-blue-700" : "bg-green-600"
          )}>
            {isUser ? "U" : "AI"}
          </div>
          <span className="text-sm font-medium">
            {isUser ? "You" : "Assistant"}
          </span>
        </div>

        {/* Message Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Timestamp */}
        <p className={cn(
          "text-xs mt-2",
          isUser ? "text-blue-200" : "text-gray-500"
        )}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble