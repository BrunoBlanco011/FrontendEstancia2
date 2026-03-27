import { API_CONFIG } from "@/utils/config";
import type { FileUploadResponse, FileListResponse, SingleFileResponse } from "@/types/file";

const API_URL = API_CONFIG.baseURL;

// Logger para debugging
const log = (message: string, data?: any) => {
  console.log(`[FileService] ${message}`, data || '');
};

export const fileService = {
  uploadFile: async (file: File, uploadedBy: number): Promise<FileUploadResponse> => {
    const uploadUrl = `${API_URL}${API_CONFIG.endpoints.upload}`;
    log('Uploading file to:', uploadUrl);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', uploadedBy.toString());

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('Server error:', errorData);
        throw new Error(`Error al subir archivo: ${errorData.error || errorData.message || response.statusText}`);
      }

      const result = await response.json();
      log('File uploaded successfully:', result);
      return result;
    } catch (error) {
      log('Upload failed:', error);
      throw error;
    }
  },

  uploadMultipleFiles: async (files: File[], uploadedBy: number): Promise<FileUploadResponse[]> => {
    const uploadPromises = files.map(file => 
      fileService.uploadFile(file, uploadedBy)
    );

    return Promise.all(uploadPromises);
  },

  getAllFiles: async (): Promise<FileListResponse> => {
    const filesUrl = `${API_URL}${API_CONFIG.endpoints.upload}`;
    log('Fetching files from:', filesUrl);
    
    try {
      const response = await fetch(filesUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener archivos: ${response.statusText}`);
      }

      const result = await response.json();
      log('Files fetched successfully');
      return result;
    } catch (error) {
      log('Fetch files failed:', error);
      throw error;
    }
  },

  getFileById: async (fileId: number): Promise<SingleFileResponse> => {
    const fileUrl = `${API_URL}${API_CONFIG.endpoints.upload}/${fileId}`;
    log('Fetching file from:', fileUrl);
    
    try {
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener archivo: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      log('Fetch file failed:', error);
      throw error;
    }
  },

  deleteFile: async (fileId: number): Promise<{ message: string }> => {
    const deleteUrl = `${API_URL}${API_CONFIG.endpoints.upload}/${fileId}`;
    log('Deleting file from:', deleteUrl);
    
    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar archivo: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      log('Delete file failed:', error);
      throw error;
    }
  }
};