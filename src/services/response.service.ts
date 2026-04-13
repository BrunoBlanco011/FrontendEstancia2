import { API_CONFIG } from "@/utils/config";

const API_URL = API_CONFIG.baseURL;

const log = (message: string, data?: any) => {
  console.log(`[ResponseService] ${message}`, data || '');
};

export interface ResponseData {
  id?: number;
  surveyId: number;
  respondentEmail?: string;
  respondentUserId?: number;
  ipAddress?: string;
  createdAt?: string;
}

export interface AnswerData {
  id?: number;
  responseId: number;
  questionId: number;
  answerText?: string;
  answerValue?: number;
  selectedOptionId?: number;
}

const normalizeResponse = (raw: any): ResponseData => ({
  id: raw.id || raw.responseId || raw.response_id,
  surveyId: raw.surveyId || raw.survey_id,
  respondentEmail: raw.respondentEmail || raw.respondent_email,
  respondentUserId: raw.respondentUserId || raw.respondent_user_id || raw.user_id,
  ipAddress: raw.ipAddress || raw.ip_address,
  createdAt: raw.createdAt || raw.created_at,
});

const normalizeAnswer = (raw: any): AnswerData => ({
  id: raw.id || raw.answerId || raw.answer_id,
  responseId: raw.responseId || raw.response_id,
  questionId: raw.questionId || raw.question_id,
  answerText: raw.answerText || raw.answer_text,
  answerValue: raw.answerValue || raw.answer_value,
  selectedOptionId: raw.selectedOptionId || raw.selected_option_id,
});

export const responseService = {
  getAllResponses: async (): Promise<ResponseData[]> => {
    const url = `${API_URL}${API_CONFIG.endpoints.responses}`;
    log('Fetching all responses');
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.responses || data.data || [];
      return list.map(normalizeResponse);
    } catch (error) {
      log('Fetch responses failed:', error);
      throw error;
    }
  },

  getResponsesBySurvey: async (surveyId: number | string): Promise<ResponseData[]> => {
    const url = `${API_URL}${API_CONFIG.endpoints.survey}/${surveyId}/responses`;
    log('Fetching responses for survey:', surveyId);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.responses || data.data || [];
      return list.map(normalizeResponse);
    } catch (error) {
      log('Fetch responses by survey failed:', error);
      throw error;
    }
  },

  getAllAnswers: async (): Promise<AnswerData[]> => {
    const url = `${API_URL}${API_CONFIG.endpoints.answers}`;
    log('Fetching all answers');
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      return Array.isArray(data) ? data : data.answers || data.data || [];
    } catch (error) {
      log('Fetch answers failed:', error);
      throw error;
    }
  },

  getAnswersByResponse: async (responseId: number | string): Promise<AnswerData[]> => {
    // Backend uses /response/{id}/answers (singular)
    const url = `${API_URL}/response/${responseId}/answers`;
    log('Fetching answers for response:', responseId);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      return Array.isArray(data) ? data : data.answers || data.data || [];
    } catch (error) {
      log('Fetch answers by response failed:', error);
      throw error;
    }
  },

  getAnswersByQuestion: async (questionId: number | string): Promise<AnswerData[]> => {
    // Backend uses /question/{id}/answers (singular)
    const url = `${API_URL}/question/${questionId}/answers`;
    log('Fetching answers for question:', questionId);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      return Array.isArray(data) ? data : data.answers || data.data || [];
    } catch (error) {
      log('Fetch answers by question failed:', error);
      throw error;
    }
  },

  createResponse: async (responseData: Omit<ResponseData, 'id' | 'createdAt'>): Promise<ResponseData> => {
    const url = `${API_URL}${API_CONFIG.endpoints.responses}`;
    log('Creating response:', responseData);
    
    // Mapeo seguro a snake_case
    const payload = {
      ...responseData,
      survey_id: responseData.surveyId,
      respondent_email: responseData.respondentEmail,
      respondent_user_id: responseData.respondentUserId,
      ip_address: responseData.ipAddress
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || errorData.error || response.statusText);
      }
      const data = await response.json();
      return normalizeResponse(data.response || data);
    } catch (error) {
      log('Create response failed:', error);
      throw error;
    }
  },

  createAnswer: async (answerData: Omit<AnswerData, 'id'>): Promise<AnswerData> => {
    const url = `${API_URL}${API_CONFIG.endpoints.answers}`;
    log('Creating answer:', answerData);
    
    // El backend de FastAPI por lo general espera snake_case
    const payload = {
      ...answerData,
      response_id: answerData.responseId,
      question_id: answerData.questionId,
      answer_text: answerData.answerText,
      answer_value: answerData.answerValue,
      selected_option_id: answerData.selectedOptionId
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail?.[0]?.msg || errorData.error || response.statusText);
      }
      const data = await response.json();
      return normalizeAnswer(data.answer || data);
    } catch (error) {
      log('Create answer failed:', error);
      throw error;
    }
  }
};
