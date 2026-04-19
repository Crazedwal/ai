// src/lib/models.js

export const MODELS = [
  {
    id: "nvidia/nemotron-3-nano-30b-a3b:free",
    name: "Default Model",
    provider: "NVIDIA",
    tier: "free",
    tokensPerMessage: 0,
    description: "Fast & lightweight"
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
