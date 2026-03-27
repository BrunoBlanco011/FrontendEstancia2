export interface Survey {
  id: string
  title: string
  description: string
  createdAt: string
  status: 'draft' | 'active' | 'closed'
  questions: Question[]
}

export interface Question {
  id: string
  text: string
  type: 'text' | 'multiple-choice' | 'rating'
  required: boolean
}