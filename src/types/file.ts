export interface UploadedFile {
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
  file?: File;
}

export interface FileUploadResponse {
  message: string;
  file: {
    fileId: number;
    fileName: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    uploadedBy: number;
    uploadDate: string;
  };
}

export interface FileData {
  id: number;
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  upload_date: string;
}

export interface FileListResponse {
  files: FileData[];
  total: number;
}

export interface SingleFileResponse {
  file: FileData;
}