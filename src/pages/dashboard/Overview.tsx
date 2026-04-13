import { useState, useEffect } from 'react'
import { FileSpreadsheet, TrendingUp, Users, BarChart3, Loader2, RefreshCw } from 'lucide-react'
import { surveyService } from '@/services/survey.service';
import type { SurveyData } from '@/services/survey.service';
import { responseService } from '@/services/response.service'
import { fileService } from '@/services/file.service'

function Overview() {
  const [loading, setLoading] = useState(true)
  const [surveyCount, setSurveyCount] = useState(0)
  const [responseCount, setResponseCount] = useState(0)
  const [fileCount, setFileCount] = useState(0)
  const [recentSurveys, setRecentSurveys] = useState<SurveyData[]>([])
  const [responsesPerSurvey, setResponsesPerSurvey] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [surveysResult, responsesResult, filesResult] = await Promise.allSettled([
        surveyService.getAllSurveys(),
        responseService.getAllResponses(),
        fileService.getAllFiles()
      ])

      const surveysList = surveysResult.status === 'fulfilled' ? surveysResult.value : []
      const responsesList = responsesResult.status === 'fulfilled' ? responsesResult.value : []
      const filesList = filesResult.status === 'fulfilled' ? (filesResult.value.files || []) : []

      setSurveyCount(surveysList.length)
      setResponseCount(responsesList.length)
      setFileCount(filesList.length)

      // Ordenar por fecha y tomar las 4 más recientes
      const sorted = [...surveysList].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })
      setRecentSurveys(sorted.slice(0, 4))

      // Contar respuestas por encuesta
      const perSurvey: Record<number, number> = {}
      responsesList.forEach((r: any) => {
        const sid = r.survey_id
        if (sid) perSurvey[sid] = (perSurvey[sid] || 0) + 1
      })
      setResponsesPerSurvey(perSurvey)

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Error al conectar con el servidor. Verifica que el backend esté activo en el puerto 8001.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-MX')
  }

  const stats = [
    {
      title: "Total Encuestas",
      value: surveyCount.toString(),
      icon: BarChart3,
      color: "blue"
    },
    {
      title: "Respuestas",
      value: responseCount.toString(),
      icon: Users,
      color: "green"
    },
    {
      title: "Archivos",
      value: fileCount.toString(),
      icon: FileSpreadsheet,
      color: "purple"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600"
    }
    return colors[color] || colors.blue
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Resumen</h1>
          <p className="text-gray-600 mt-1">Vista general de tu actividad</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          title="Actualizar datos"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-2 text-sm text-amber-600 hover:text-amber-800 font-medium cursor-pointer"
          >
            Reintentar conexión
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encuestas Recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Encuestas Recientes</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>

          {recentSurveys.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay encuestas aún</p>
              <p className="text-sm text-gray-400 mt-1">Crea tu primera encuesta para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSurveys.map((survey) => (
                <div key={survey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{survey.nameSurvey}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(survey.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {responsesPerSurvey[survey.id!] || 0}
                    </p>
                    <p className="text-xs text-gray-500">respuestas</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Respuestas por Encuesta */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Respuestas por Encuesta</h2>
          {recentSurveys.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Sin datos de actividad</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSurveys.map((survey) => {
                const count = responsesPerSurvey[survey.id!] || 0
                const maxResponses = Math.max(...Object.values(responsesPerSurvey), 1)
                const percentage = maxResponses > 0 ? (count / maxResponses) * 100 : 0
                return (
                  <div key={survey.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-32 truncate" title={survey.nameSurvey}>
                      {survey.nameSurvey}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview