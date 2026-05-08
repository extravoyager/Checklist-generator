// Stub AI adapter for the Checklist Generator.
// In production this would call an LLM endpoint; for the MVP we return null
// so the deterministic generator is used.

const apiKey = import.meta.env.VITE_AI_API_KEY

export async function generateWithAI(input) {
  if (!apiKey) return null
  // Placeholder - intentionally not implemented in MVP.
  return null
}

export const aiAvailable = !!apiKey
