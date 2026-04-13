import type { Variable, EmotionOption, SentimentOption } from '@/types/wordSelector.types'

/**
 * API del backend para extracción de palabras clave
 * Utiliza NLTK, SpaCy y extracción de keywords
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

/**
 * Extrae palabras clave de un texto usando el backend NLP
 * @param text - Texto del cual extraer palabras
 * @param language - Idioma ('spanish' o 'english')
 * @param topN - Número de top palabras a retornar
 * @returns Array de palabras clave
 */
export const extractKeywordsFromBackend = async (
  text: string,
  language: string = 'spanish',
  topN: number = 10
): Promise<string[]> => {
  try {
    if (!text || text.trim().length === 0) {
      return []
    }

    const response = await fetch(`${API_BASE_URL}/nlp/extract-ranked-keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        min_length: 3,
        language,
        top_n: topN
      })
    })

    if (!response.ok) {
      console.error('Error en extracción de palabras:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.keywords || []
  } catch (error) {
    console.error('Error extrayendo palabras del backend:', error)
    return []
  }
}

/**
 * Extrae frases de un texto usando el backend NLP
 * @param text - Texto del cual extraer frases
 * @param phraseLength - Longitud de las frases (1-5)
 * @param language - Idioma ('spanish' o 'english')
 * @returns Array de frases
 */
export const extractPhrasesFromBackend = async (
  text: string,
  phraseLength: number = 2,
  language: string = 'spanish'
): Promise<string[]> => {
  try {
    if (!text || text.trim().length === 0) {
      return []
    }

    const response = await fetch(`${API_BASE_URL}/nlp/extract-phrases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        phrase_length: Math.min(Math.max(phraseLength, 1), 5),
        language
      })
    })

    if (!response.ok) {
      console.error('Error en extracción de frases:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.phrases || []
  } catch (error) {
    console.error('Error extrayendo frases del backend:', error)
    return []
  }
}

// Las palabras se extraen dinámicamente del backend via NLP
// Ya no se usan palabras hardcoded

/** Variables de análisis — coherentes con los indicadores existentes del sistema */
export const analysisVariables: Variable[] = [
  { id: 'v1', name: 'Ansiedad' },
  { id: 'v2', name: 'Depresión' },
  { id: 'v3', name: 'Estrés' },
  { id: 'v4', name: 'Conductual' },
  { id: 'v5', name: 'Somatización' },
  { id: 'v6', name: 'TDAH' },
]

/** Emociones básicas (modelo de Plutchik extendido) */
export const emotions: EmotionOption[] = [
  { id: 'e1', label: 'Alegría' },
  { id: 'e2', label: 'Tristeza' },
  { id: 'e3', label: 'Miedo' },
  { id: 'e4', label: 'Ira' },
  { id: 'e5', label: 'Sorpresa' },
  { id: 'e6', label: 'Asco' },
  { id: 'e7', label: 'Confianza' },
  { id: 'e8', label: 'Anticipación' },
]

/** Sentimientos generales */
export const sentiments: SentimentOption[] = [
  { id: 's1', label: 'Positivo' },
  { id: 's2', label: 'Negativo' },
  { id: 's3', label: 'Neutro' },
]

/** Pesos disponibles (0 a 1, intervalos de 0.1) */
export const weightOptions: number[] = [
  0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0
]
