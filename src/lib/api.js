// src/lib/api.js - Add streaming function

export async function sendMessageStreaming(messages, onChunk) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  // Step 1: Make the request with stream: true
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "My ChatGPT Clone"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: messages,
      stream: true  // This enables streaming!
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  // Step 2: Set up the stream reader
  const reader = response.body.getReader()   // Gets a reader for the stream
  const decoder = new TextDecoder()          // Converts bytes to text
  let fullResponse = ""                       // Accumulates the complete response

  // Step 3: Read chunks in a loop
  while (true) {
    const { done, value } = await reader.read()  // Get next chunk
    if (done) break  // No more data

    // Step 4: Decode and parse the chunk
    const chunk = decoder.decode(value)
    const lines = chunk.split("\n").filter(line => line.startsWith("data: "))

    // Step 5: Extract content from each line
    for (const line of lines) {
      const data = line.slice(6)  // Remove "data: " prefix
      if (data === "[DONE]") continue  // Stream complete signal

      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content || ""
        fullResponse += content
        onChunk(fullResponse)  // Update UI with accumulated text!
      } catch {
        // Skip invalid JSON (sometimes happens between chunks)
      }
    }
  }

  return fullResponse
}