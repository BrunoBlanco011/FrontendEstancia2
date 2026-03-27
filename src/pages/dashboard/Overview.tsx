import { FileSpreadsheet, TrendingUp, Users, BarChart3 } from 'lucide-react'

function Overview() {
  const stats = [
    {
      title: "Total Encuestas",
      value: "24",
      icon: BarChart3,
      change: "+12%",
      changeType: "positive",
      color: "blue"
    },
    {
      title: "Respuestas",
      value: "156",
      icon: Users,
      change: "+23%",
      changeType: "positive",
      color: "green"
    },
    {
      title: "Archivos",
      value: "12",
      icon: FileSpreadsheet,
      change: "+3",
      changeType: "neutral",
      color: "purple"
    }
  ]

  const recentSurveys = [
    { name: "Encuesta de Satisfacción Cliente", responses: 45, date: "Hoy" },
    { name: "Feedback Producto 2024", responses: 32, date: "Ayer" },
    { name: "Evaluación de Servicio", responses: 28, date: "Hace 2 días" },
    { name: "Opinión Marketing", responses: 51, date: "Hace 3 días" }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600"
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Resumen</h1>
        <p className="text-gray-600 mt-1">Vista general de tu actividad</p>
      </div>

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
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
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
          <div className="space-y-3">
            {recentSurveys.map((survey, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{survey.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{survey.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{survey.responses}</p>
                  <p className="text-xs text-gray-500">respuestas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Semanal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad Semanal</h2>
          <div className="space-y-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => {
              const height = Math.random() * 100 + 20
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{day}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${height}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{Math.round(height)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview