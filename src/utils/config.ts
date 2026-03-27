export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    endpoints: {
        surveys: import.meta.env.VITE_SURVEYS_ENDPOINT || '/surveys',
        questions: import.meta.env.VITE_QUESTIONS_ENDPOINT || '/questions',
        responses: import.meta.env.VITE_RESPONSES_ENDPOINT || '/responses',
        upload: import.meta.env.VITE_UPLOAD_ENDPOINT || '/files'
    }
}