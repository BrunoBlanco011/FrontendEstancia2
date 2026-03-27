import { API_CONFIG } from "@/utils/config";

const API_URL = API_CONFIG.baseURL

export const surveyService = {
    createSurvey: async (surveyData: any) => {
        const response = await fetch(`${API_URL}${API_CONFIG.endpoints.surveys}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(surveyData)
        })
        return response.json()
    }
}