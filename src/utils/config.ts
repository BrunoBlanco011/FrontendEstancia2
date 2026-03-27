export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
    endpoints: {
        surveys: import.meta.env.VITE_SURVEYS_ENDPOINT,
        questions: import.meta.env.VITE_QUESTIONS_ENDPOINT,
        responses: import.meta.env.VITE_RESPONSES_ENDPOINT,
        upload: import.meta.env.VITE_UPLOAD_ENDPOINT
    }
}