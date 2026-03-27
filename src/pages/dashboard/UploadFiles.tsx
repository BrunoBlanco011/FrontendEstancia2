import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { fileService } from '@/services/file.service'
import type { UploadedFile } from '@/types/file'

function UploadFiles() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedBy] = useState<number>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const isValidFile = (file: File): boolean => {
    const validExtensions = ['.csv', '.xls', '.xlsx', '.xlsm', '.xlsb']
    const fileName = file.name.toLowerCase()
    return validExtensions.some(ext => fileName.endsWith(ext))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = async (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(isValidFile)

    if (validFiles.length === 0) {
      alert('Por favor selecciona archivos CSV o Excel (.csv, .xls, .xlsx, .xlsm, .xlsb)')
      return
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      status: 'uploading',
      file
    }))

    setFiles(prev => [...prev, ...newFiles])

    for (const fileEntry of newFiles) {
      try {
        await fileService.uploadFile(fileEntry.file!, uploadedBy)
        
        setFiles(prev => prev.map(f => 
          f.name === fileEntry.name && f.size === fileEntry.size
            ? { ...f, status: 'success' } 
            : f
        ))
      } catch (error) {
        console.error(`Error subiendo ${fileEntry.name}:`, error)
        
        setFiles(prev => prev.map(f => 
          f.name === fileEntry.name && f.size === fileEntry.size
            ? { 
                ...f, 
                status: 'error',
                errorMessage: error instanceof Error ? error.message : 'Error desconocido'
              } 
            : f
        ))
      }
    }
  }

  const removeFile = (fileName: string, size: number) => {
    setFiles(prev => prev.filter(f => !(f.name === fileName && f.size === size)))
  }

  const retryUpload = async (fileName: string, size: number) => {
    const fileEntry = files.find(f => f.name === fileName && f.size === size)
    if (!fileEntry || !fileEntry.file) return

    setFiles(prev => prev.map(f => 
      f.name === fileName && f.size === size
        ? { ...f, status: 'uploading', errorMessage: undefined } 
        : f
    ))

    try {
      await fileService.uploadFile(fileEntry.file, uploadedBy)
      
      setFiles(prev => prev.map(f => 
        f.name === fileName && f.size === size
          ? { ...f, status: 'success' } 
          : f
      ))
    } catch (error) {
      console.error(`Error subiendo ${fileName}:`, error)
      
      setFiles(prev => prev.map(f => 
        f.name === fileName && f.size === size
          ? { 
              ...f, 
              status: 'error',
              errorMessage: error instanceof Error ? error.message : 'Error desconocido'
            } 
          : f
      ))
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const successCount = files.filter(f => f.status === 'success').length
  const errorCount = files.filter(f => f.status === 'error').length

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Subir Archivos</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx,.xlsm,.xlsb"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Arrastra archivos aquí
          </h3>
          <p className="text-gray-500 mb-4">
            o haz clic para seleccionar archivos
          </p>
          <p className="text-sm text-gray-400">
            Formatos soportados: CSV, Excel (.xls, .xlsx, .xlsm, .xlsb)
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-6 flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              Total: <strong>{files.length}</strong>
            </span>
            {successCount > 0 && (
              <span className="text-green-600">
                Exitosos: <strong>{successCount}</strong>
              </span>
            )}
            {errorCount > 0 && (
              <span className="text-red-600">
                Errores: <strong>{errorCount}</strong>
              </span>
            )}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Archivos ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileSpreadsheet className="w-10 h-10 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      {file.status === 'error' && file.errorMessage && (
                        <p className="text-sm text-red-600 mt-1">
                          {file.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {file.status === 'uploading' && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Subiendo...</span>
                      </div>
                    )}
                    
                    {file.status === 'success' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Completado</span>
                      </div>
                    )}

                    {file.status === 'error' && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Error</span>
                        </div>
                        <button
                          onClick={() => retryUpload(file.name, file.size)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Reintentar
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => removeFile(file.name, file.size)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      disabled={file.status === 'uploading'}
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadFiles