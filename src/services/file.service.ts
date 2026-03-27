import { API_CONFIG } from "@/utils/config";
import type { FileUploadResponse, FileListResponse, SingleFileResponse } from "@/types/file";

const API_URL = API_CONFIG.baseURL;

export const fileService = {
  uploadFile: async (file: File, uploadedBy: number): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', uploadedBy.toString());

    const response = await fetch(`${API_URL}${API_CONFIG.endpoints.upload}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('Error del servidor:', errorData);
      throw new Error(`Error al subir archivo: ${errorData.error || errorData.message || response.statusText}`);
    }

    return response.json();
  },

  uploadMultipleFiles: async (files: File[], uploadedBy: number): Promise<FileUploadResponse[]> => {
    const uploadPromises = files.map(file => 
      fileService.uploadFile(file, uploadedBy)
    );

    return Promise.all(uploadPromises);
  },

  getAllFiles: async (): Promise<FileListResponse> => {
    const response = await fetch(`${API_URL}${API_CONFIG.endpoints.upload}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener archivos: ${response.statusText}`);
    }

    return response.json();
  },

  getFileById: async (fileId: number): Promise<SingleFileResponse> => {
    const response = await fetch(`${API_URL}${API_CONFIG.endpoints.upload}/${fileId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener archivo: ${response.statusText}`);
    }

    return response.json();
  },

  deleteFile: async (fileId: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}${API_CONFIG.endpoints.upload}/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar archivo: ${response.statusText}`);
    }

    return response.json();
  }
};