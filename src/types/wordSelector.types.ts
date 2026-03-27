export interface WordItem {
  id: string
  text: string
}

export interface Variable {
  id: string
  name: string
}

export interface EmotionOption {
  id: string
  label: string
}

export interface SentimentOption {
  id: string
  label: string
}

export interface WordAssignment {
  wordId: string
  wordText: string
  applicable: boolean
  weight: number
  emotion: string
  sentiment: string
}

export interface WordSelectorRecord {
  id: string
  userName: string
  variableId: string
  variableName: string
  timestamp: string
  assignments: WordAssignment[]
}
