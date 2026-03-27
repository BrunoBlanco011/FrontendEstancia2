import type { WordItem, Variable, EmotionOption, SentimentOption } from '@/types/wordSelector.types'

/**
 * Palabras extraídas de respuestas de encuestas.
 * Simulación del procesamiento con NLTK, SpaCy y LengExtract:
 * - Tokenización y lematización (NLTK)
 * - Extracción de entidades y POS tagging (SpaCy)
 * - Extracción de keywords (LengExtract / KeyBERT)
 * - Eliminación de duplicados y stopwords
 */
export const extractedWords: WordItem[] = [
  { id: 'w1', text: 'preocupación' },
  { id: 'w2', text: 'insomnio' },
  { id: 'w3', text: 'fatiga' },
  { id: 'w4', text: 'concentración' },
  { id: 'w5', text: 'nerviosismo' },
  { id: 'w6', text: 'irritabilidad' },
  { id: 'w7', text: 'tristeza' },
  { id: 'w8', text: 'motivación' },
  { id: 'w9', text: 'aislamiento' },
  { id: 'w10', text: 'tensión' },
  { id: 'w11', text: 'desesperanza' },
  { id: 'w12', text: 'agotamiento' },
  { id: 'w13', text: 'inquietud' },
  { id: 'w14', text: 'impulsividad' },
  { id: 'w15', text: 'cefalea' },
  { id: 'w16', text: 'taquicardia' },
  { id: 'w17', text: 'desánimo' },
  { id: 'w18', text: 'hiperactividad' },
  { id: 'w19', text: 'angustia' },
  { id: 'w20', text: 'autoestima' },
]

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
