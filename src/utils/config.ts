export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    endpoints: {
        survey: import.meta.env.VITE_SURVEY_ENDPOINT || '/surveys',
        questions: import.meta.env.VITE_QUESTIONS_ENDPOINT || '/questions',
        questionOptions: import.meta.env.VITE_QUESTION_OPTIONS_ENDPOINT || '/question-options',
        responses: import.meta.env.VITE_RESPONSES_ENDPOINT || '/responses',
        answers: import.meta.env.VITE_ANSWERS_ENDPOINT || '/answers',
        upload: import.meta.env.VITE_UPLOAD_ENDPOINT || '/files',
        users: import.meta.env.VITE_USERS_ENDPOINT || '/users',
        nlp: import.meta.env.VITE_NLP_ENDPOINT || '/nlp',
        auth: import.meta.env.VITE_AUTH_ENDPOINT || '/auth'
    }
}