// src/lib/api.js

// The OpenRouter API endpoint
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

/**
 * Send a message to the AI and get a response
 * @param {Array} messages - The conversation history
 * @returns {Promise<string>} - The AI's response
 */
export async function sendMessage(messages) {
  // Step 1: Get the API key from environment
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("API key not found. Check your .env file!")
  }

  // Step 2: Make the API request
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,  // Required by OpenRouter
      "X-Title": "My ChatGPT Clone"            // Optional: identifies your app
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",  // Free model!
      messages: messages
    })
  })

  // Step 3: Check if the request succeeded
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  // Step 4: Parse and return the response
  const data = await response.json()
  return data.choices[0].message.content
}