// src/lib/models.js

export const MODELS = [
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat V3",
    provider: "DeepSeek",
    tier: "free",
    tokensPerMessage: 0,
    description: "Fast & high quality"
  }
]

export const DEFAULT_MODEL_ID = "deepseek/deepseek-chat-v3-0324:free"

export const TOKEN_PACKAGES = [
  { id: "starter", tokens: 100, price: 1.99, label: "Starter" },
  { id: "standard", tokens: 500, price: 7.99, label: "Standard" },
  { id: "pro", tokens: 1500, price: 17.99, label: "Pro" }
]

export function getModel(id) {
  return MODELS.find(m => m.id === id) || MODELS[0]
}
