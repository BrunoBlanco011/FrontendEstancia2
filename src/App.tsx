import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import DashboardLayout from './components/layout/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Surveys from './pages/dashboard/Surveys'
import UploadFiles from './pages/dashboard/UploadFiles'
import Questions from './pages/dashboard/Questions'
import WordSelector from './pages/dashboard/WordSelector'
import Ansiedad from './pages/dashboard/Ansiedad'
import Depresion from './pages/dashboard/Depresion'
import ViewFiles from './pages/dashboard/ViewFiles'
import Settings from './pages/dashboard/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ROLES } from './context/AuthContext'
import UserSurveys from './pages/survey/UserSurveys'
import AnswerSurvey from './pages/survey/AnswerSurvey'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas de Administrador */}
      <Route path="/dashboard" element={<ProtectedRoute requiredRole={ROLES.ADMIN as any}><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="surveys" element={<Surveys />} />
        <Route path="upload" element={<UploadFiles />} />
        <Route path="settings" element={<Settings />} />
        <Route path='files' element={< ViewFiles />} />
        <Route path='surveys/:id/:slug/questions' element={<Questions />} />
        <Route path="word-selector" element={<WordSelector />} />
        <Route path="indicadores/ansiedad" element={<Ansiedad />} />
        <Route path="indicadores/depresion" element={<Depresion />} />
        <Route path="indicadores/estres" element={<div className="text-2xl font-bold">Estres</div>} />
        <Route path="indicadores/conductual" element={<div className="text-2xl font-bold">Conductual</div>} />
        <Route path="indicadores/somatizacion" element={<div className="text-2xl font-bold">Somatizacion</div>} />
        <Route path="indicadores/tdah" element={<div className="text-2xl font-bold">TDAH</div>} />
      </Route>

      {/* Rutas de Usuario (Responder Encuestas) */}
      <Route path="/surveys" element={<ProtectedRoute requiredRole={ROLES.USER as any}><UserSurveys /></ProtectedRoute>} />
      <Route path="/surveys/:id" element={<ProtectedRoute requiredRole={ROLES.USER as any}><AnswerSurvey /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App