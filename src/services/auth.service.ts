import { API_CONFIG } from "@/utils/config";

const API_URL = API_CONFIG.baseURL;

const log = (message: string, data?: any) => {
  console.log(`[AuthService] ${message}`, data || '');
};

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  roleId: number;
  profileImageUrl?: string | null;
  registrationDate?: string;
}

// Normalizer for backend snake_case responses
const normalizeUser = (raw: any): User => ({
  id: raw.id || raw.userId || raw.user_id,
  name: raw.name,
  lastName: raw.last_name || raw.lastName,
  email: raw.email,
  roleId: Number(raw.role_id || raw.roleId),
  profileImageUrl: raw.profile_image_url || raw.profileImageUrl,
  registrationDate: raw.registration_date || raw.registrationDate,
});

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    const url = `${API_URL}${API_CONFIG.endpoints.auth}/login`;
    log('Attempting login for:', credentials.email);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        log('Login failed response:', data);
        const errorMsg = data.detail?.[0]?.msg || data.error || data.message || 'Error en inicio de sesión';
        throw new Error(errorMsg);
      }
      
      const rawUser = data.data || data.user || data;
      
      return normalizeUser(rawUser);
    } catch (error) {
      log('Login failed:', error);
      throw error;
    }
  },

  register: async (userData: any): Promise<User> => {
    const url = `${API_URL}${API_CONFIG.endpoints.users}`;
    log('Attempting register for:', userData.email);

    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('roleId', userData.roleId.toString());

      if (userData.profileImage) {
        formData.append('profileImage', userData.profileImage);
      }

      const response = await fetch(url, {
        method: 'POST',
        body: formData, // fetch will automatically set the correct Content-Type with multiparty boundary
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        log('Register failed response:', data);
        const errorMsg = data.detail?.[0]?.msg || data.error || data.message || 'Error en el registro';
        throw new Error(errorMsg);
      }

      return normalizeUser(data.user || data);
    } catch (error) {
      log('Register failed:', error);
      throw error;
    }
  }
};
