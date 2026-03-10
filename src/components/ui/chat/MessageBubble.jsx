import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import { cn } from "@/lib/utils"
import { useAssistantName } from "@/hooks/useAssistantName.jsx"

function MessageBubble({ message }) {
  const isUser = message.role === "user"
  const { assistantName } = useAssistantName()

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
          {isUser ? (
            <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
              U
            </div>
          ) : (
            <img
              src="/ai-avatar.png"
              alt={assistantName}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium">
            {isUser ? "You" : assistantName}
          </span>
        </div>

        {/* Message Content */}
        <div className={cn(
          "text-sm leading-relaxed prose prose-sm max-w-none",
          isUser
            ? "prose-invert"
            : "dark:prose-invert"
        )}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ className, children, ...props }) {
                const isBlock = className?.startsWith("language-")
                return isBlock ? (
                  <code className={cn("rounded text-xs", className)} {...props}>
                    {children}
                  </code>
                ) : (
                  <code
                    className={cn(
                      "rounded px-1 py-0.5 text-xs font-mono",
                      isUser
                        ? "bg-blue-700/50"
                        : "bg-gray-200 dark:bg-gray-700"
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                )
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

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