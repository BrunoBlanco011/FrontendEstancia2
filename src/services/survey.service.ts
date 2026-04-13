import { API_CONFIG } from "@/utils/config";

const API_URL = API_CONFIG.baseURL;

const log = (message: string, data?: any) => {
  console.log(`[SurveyService] ${message}`, data || '');
};

export interface SurveyData {
  id?: number;
  nameSurvey: string;
  description?: string;
  createdBy?: number;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
}

// El backend retorna snake_case en GETs pero espera camelCase en POSTs
// Esta función normaliza la respuesta del backend
const normalizeSurvey = (raw: any): SurveyData => ({
  id: raw.id || raw.surveyId || raw.survey_id,
  nameSurvey: raw.nameSurvey || raw.name_survey || '',
  description: raw.description || '',
  createdBy: raw.createdBy || raw.created_by,
  isActive: raw.isActive ?? raw.is_active,
  created_at: raw.created_at || raw.createdAt,
  updated_at: raw.updated_at || raw.updatedAt,
});

export const surveyService = {
  getAllSurveys: async (): Promise<SurveyData[]> => {
    const url = `${API_URL}${API_CONFIG.endpoints.survey}`;
    log('Fetching all surveys from:', url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.surveys || data.data || [];
      return list.map(normalizeSurvey);
    } catch (error) {
      log('Fetch surveys failed:', error);
      throw error;
    }
  },

  getSurveyById: async (surveyId: number | string): Promise<SurveyData> => {
    const url = `${API_URL}${API_CONFIG.endpoints.survey}/${surveyId}`;
    log('Fetching survey:', url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      return normalizeSurvey(data.survey || data);
    } catch (error) {
      log('Fetch survey failed:', error);
      throw error;
    }
  },

  createSurvey: async (surveyData: { nameSurvey: string; description: string; createdBy: number }): Promise<SurveyData> => {
    const url = `${API_URL}${API_CONFIG.endpoints.survey}`;
    log('Creating survey:', surveyData);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        log('Full error response:', JSON.stringify(errorData, null, 2));
        throw new Error(errorData.detail?.[0]?.msg || errorData.error || errorData.message || response.statusText);
      }
      const data = await response.json();
      return normalizeSurvey(data.survey || data);
    } catch (error) {
      log('Create survey failed:', error);
      throw error;
    }
  },

  updateSurvey: async (surveyId: number | string, surveyData: { nameSurvey?: string; description?: string; isActive?: boolean }): Promise<SurveyData> => {
    const url = `${API_URL}${API_CONFIG.endpoints.survey}/${surveyId}`;
    log('Updating survey:', surveyId);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      return normalizeSurvey(data.survey || data);
    } catch (error) {
      log('Update survey failed:', error);
      throw error;
    }
  },

  deleteSurvey: async (surveyId: number | string): Promise<void> => {
    const url = `${API_URL}${API_CONFIG.endpoints.survey}/${surveyId}`;
    log('Deleting survey:', surveyId);
    
    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    } catch (error) {
      log('Delete survey failed:', error);
      throw error;
    }
  }
};
