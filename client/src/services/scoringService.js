// Re-export the shared scoring engine so client and server stay in sync.
export { isFailResponse, isNAResponse, calculateScore, getBand } from '../../../shared/scoringService.js'
