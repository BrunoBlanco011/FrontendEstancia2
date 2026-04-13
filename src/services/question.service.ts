import { API_CONFIG } from "@/utils/config";

const API_URL = API_CONFIG.baseURL;

const log = (message: string, data?: any) => {
  console.log(`[QuestionService] ${message}`, data || '');
};

export interface QuestionData {
  id?: number;
  surveyId: number;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  orderPosition: number;
}

export interface QuestionOptionData {
  id?: number;
  questionId: number;
  optionText: string;
  orderPosition: number;
}

// El backend retorna snake_case en GETs pero espera camelCase en POSTs
const normalizeQuestion = (raw: any): QuestionData => ({
  id: raw.id || raw.questionId || raw.question_id,
  surveyId: raw.surveyId || raw.survey_id,
  questionText: raw.questionText || raw.question_text || '',
  questionType: raw.questionType || raw.question_type || 'text',
  isRequired: raw.isRequired ?? raw.is_required ?? false,
  orderPosition: raw.orderPosition || raw.order_position || 1,
});

const normalizeOption = (raw: any): QuestionOptionData => ({
  id: raw.id || raw.optionId || raw.option_id,
  questionId: raw.questionId || raw.question_id,
  optionText: raw.optionText || raw.option_text || '',
  orderPosition: raw.orderPosition || raw.order_position || 1,
});

export const questionService = {
  getQuestionsBySurvey: async (surveyId: number | string): Promise<QuestionData[]> => {
    const url = `${API_URL}${API_CONFIG.endpoints.survey}/${surveyId}/questions`;
    log('Fetching questions for survey:', surveyId);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.questions || data.data || [];
      return list.map(normalizeQuestion);
    } catch (error) {
      log('Fetch questions failed:', error);
      throw error;
    }
  },

  createQuestion: async (questionData: Omit<QuestionData, 'id'>): Promise<QuestionData> => {
    const url = `${API_URL}${API_CONFIG.endpoints.questions}`;
    log('Creating question:', questionData);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        log('Full error response:', JSON.stringify(errorData, null, 2));
        throw new Error(errorData.detail?.[0]?.msg || errorData.error || errorData.message || response.statusText);
      }
      const data = await response.json();
      return normalizeQuestion(data.question || data);
    } catch (error) {
      log('Create question failed:', error);
      throw error;
    }
  },

  updateQuestion: async (questionId: number | string, questionData: Partial<QuestionData>): Promise<QuestionData> => {
    const url = `${API_URL}${API_CONFIG.endpoints.questions}/${questionId}`;
    log('Updating question:', questionId);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData)
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      return normalizeQuestion(data.question || data);
    } catch (error) {
      log('Update question failed:', error);
      throw error;
    }
  },

  deleteQuestion: async (questionId: number | string): Promise<void> => {
    const url = `${API_URL}${API_CONFIG.endpoints.questions}/${questionId}`;
    log('Deleting question:', questionId);
    
    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    } catch (error) {
      log('Delete question failed:', error);
      throw error;
    }
  },

  getOptionsByQuestion: async (questionId: number | string): Promise<QuestionOptionData[]> => {
    const url = `${API_URL}${API_CONFIG.endpoints.questions}/${questionId}/options`;
    log('Fetching options for question:', questionId);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.options || data.data || [];
      return list.map(normalizeOption);
    } catch (error) {
      log('Fetch options failed:', error);
      throw error;
    }
  },

  createOption: async (optionData: Omit<QuestionOptionData, 'id'>): Promise<QuestionOptionData> => {
    const url = `${API_URL}${API_CONFIG.endpoints.questionOptions}`;
    log('Creating option:', optionData);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optionData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        log('Full error response:', JSON.stringify(errorData, null, 2));
        throw new Error(errorData.detail?.[0]?.msg || errorData.error || errorData.message || response.statusText);
      }
      const data = await response.json();
      return normalizeOption(data.option || data);
    } catch (error) {
      log('Create option failed:', error);
      throw error;
    }
  }
};
