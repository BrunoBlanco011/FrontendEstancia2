import { useState, useEffect } from 'react'
import { FileSpreadsheet, Download, Trash2, Search, Calendar, User, FileType, RefreshCw } from 'lucide-react'
import { fileService } from '@/services/file.service'
import { API_CONFIG } from '@/utils/config'
import type { FileData } from '@/types/file'

function ViewFiles() {
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const response = await fileService.getAllFiles()
      setFiles(response.files || [])
    } catch (error) {
      setFiles([])
      alert('Error al cargar los archivos. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await fetchFiles()
    } finally {
      setRefreshing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleDownload = (file: FileData) => {
    window.open(file.file_path, '_blank')
  }

  const handleDelete = async (fileId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      try {
        await fileService.deleteFile(fileId)
        setFiles(files.filter(f => f.id !== fileId))
        alert('Archivo eliminado exitosamente')
      } catch (error) {
        alert('Error al eliminar el archivo. Por favor intenta de nuevo.')
      }
    }
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || file.file_type === filterType
    return matchesSearch && matchesType
  })

  const getFileTypeIcon = (type: string) => {
    const iconClass = "w-10 h-10"
    switch (type) {
      case 'csv':
        return <FileSpreadsheet className={`${iconClass} text-green-600`} />
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className={`${iconClass} text-emerald-600`} />
      case 'xlsm':
        return <FileSpreadsheet className={`${iconClass} text-teal-600`} />
      default:
        return <FileSpreadsheet className={`${iconClass} text-gray-600`} />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando archivos...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Archivos Subidos</h1>
        <p className="text-gray-600">Gestiona y descarga tus archivos de Excel y CSV</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
            <option value="xls">XLS</option>
            <option value="xlsm">XLSM</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Mostrando <strong>{filteredFiles.length}</strong> de <strong>{files.length}</strong> archivos
          </p>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No se encontraron archivos</p>
            <p className="text-gray-400 text-sm">
              {searchTerm || filterType !== 'all' 
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Sube tu primer archivo para comenzar'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {getFileTypeIcon(file.file_type)}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">
                      {file.original_name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileType className="w-4 h-4" />
                        <span className="uppercase">{file.file_type}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>{formatFileSize(file.file_size)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(file.upload_date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Usuario #{file.uploaded_by}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleDownload(file)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Descargar archivo"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Gestión de archivos</h4>
            <p className="text-sm text-blue-700">
              Los archivos se almacenan de forma segura en Cloudinary. Puedes descargarlos en cualquier momento
              haciendo clic en el botón de descarga.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewFiles