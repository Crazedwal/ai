// src/lib/models.js

export const MODELS = [
  // ── Free tier ──────────────────────────────────────────────────
  {
    id: "nvidia/nemotron-3-nano-30b-a3b:free",
    name: "Nemotron Nano 30B",
    provider: "NVIDIA",
    tier: "free",
    tokensPerMessage: 0,
    description: "Fast & lightweight"
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B",
    provider: "Meta",
    tier: "free",
    tokensPerMessage: 0,
    description: "Great for general tasks"
  },
  {
    id: "google/gemma-3-4b-it:free",
    name: "Gemma 3 4B",
    provider: "Google",
    tier: "free",
    tokensPerMessage: 0,
    description: "Google's open model"
  },

  // ── Paid tier (still free on OpenRouter, but cost in-app tokens) ─
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B",
    provider: "Mistral",
    tier: "paid",
    tokensPerMessage: 3,
    description: "Fast European model"
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B",
    provider: "Meta",
    tier: "paid",
    tokensPerMessage: 5,
    description: "Great for general tasks"
  },
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    tier: "paid",
    tokensPerMessage: 8,
    description: "Strong coding & reasoning"
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    tier: "paid",
    tokensPerMessage: 12,
    description: "Advanced chain-of-thought reasoning"
  }
]

export const DEFAULT_MODEL_ID = "nvidia/nemotron-3-nano-30b-a3b:free"

export const TOKEN_PACKAGES = [
  { id: "starter", tokens: 100, price: 1.99, label: "Starter" },
  { id: "standard", tokens: 500, price: 7.99, label: "Standard" },
  { id: "pro", tokens: 1500, price: 17.99, label: "Pro" }
]

export function getModel(id) {
  return MODELS.find(m => m.id === id) || MODELS[0]
}
