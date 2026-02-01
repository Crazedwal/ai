// src/lib/mockData.js
export const mockConversations = [
  {
    id: "1",
    title: "Help with React",
    messages: [
      {
        id: "1a",
        role: "user",
        content: "How do I create a React component?",
        timestamp: "2024-01-14T10:00:00Z"
      },
      {
        id: "1b",
        role: "assistant",
        content: "To create a React component, you can use either a function or a class. Here's a simple function component:\n\nfunction MyComponent() {\n  return <div>Hello World!</div>\n}\n\nFunction components are the modern, preferred way to write React components!",
        timestamp: "2024-01-14T10:00:05Z"
      }
    ],
    lastMessage: "To create a React component...",
    createdAt: "2024-01-14T10:00:00Z"
  },
  {
    id: "2",
    title: "JavaScript Questions",
    messages: [],
    lastMessage: "",
    createdAt: "2024-01-13T15:30:00Z"
  }
]

// Generate contextual mock responses
export function generateMockResponse(userMessage) {
  const lowercaseMsg = userMessage.toLowerCase()

  if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi")) {
    return "Hello! I'm your AI assistant. How can I help you today? Feel free to ask me about coding, explain concepts, or help you debug issues."
  }

  if (lowercaseMsg.includes("react")) {
    return "React is a powerful JavaScript library for building user interfaces! It uses a component-based architecture where you break your UI into reusable pieces. Would you like me to explain any specific React concept like hooks, state, or props?"
  }

  if (lowercaseMsg.includes("code") || lowercaseMsg.includes("programming")) {
    return "I'd be happy to help with your coding questions! I can assist with:\n\n- Explaining concepts\n- Debugging code\n- Writing new features\n- Code reviews\n- Best practices\n\nWhat would you like to work on?"
  }

  // Default response
  return `That's a great question! You asked about "${userMessage.slice(0, 50)}..."\n\nThis is a mock response since we haven't connected to the real AI API yet.\n\nI'm here to help with whatever you need. Feel free to ask me anything!`
}