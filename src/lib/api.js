// src/lib/api.js

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

// Share key with standalone HTML pages (e.g. personality-matchmaker.html)
if (import.meta.env.VITE_OPENROUTER_API_KEY) {
  localStorage.setItem('openrouter_api_key', import.meta.env.VITE_OPENROUTER_API_KEY)
}

export async function sendMessage(messages, modelId = "nvidia/nemotron-3-nano-30b-a3b:free") {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("Missing API key. Set VITE_OPENROUTER_API_KEY in your .env file.")
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "My ChatGPT Clone"
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || "No response from AI."
}

export async function sendMessageStreaming(messages, onChunk, modelId = "nvidia/nemotron-3-nano-30b-a3b:free") {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "My ChatGPT Clone"
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages,
      stream: true
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullResponse = ""
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split("\n")
    // Keep the last (potentially incomplete) line in the buffer
    buffer = lines.pop()

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      const data = line.slice(6).trim()
      if (data === "[DONE]") continue

      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content || ""
        fullResponse += content
        onChunk(fullResponse)
      } catch {
        // Skip invalid JSON
      }
    }
  }

  return fullResponse
}
