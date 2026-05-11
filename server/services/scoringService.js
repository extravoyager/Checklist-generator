// Re-export the shared scoring engine so the API gives identical results to the UI.
export { calculateScore, isFailResponse, isNAResponse, getBand } from '../../shared/scoringService.js'
