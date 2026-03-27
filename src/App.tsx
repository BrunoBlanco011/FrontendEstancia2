import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import DashboardLayout from './components/layout/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Surveys from './pages/dashboard/Surveys'
import UploadFiles from './pages/dashboard/UploadFiles'
import Settings from './pages/dashboard/Settings'
import Questions from './pages/dashboard/Questions'
import WordSelector from './pages/dashboard/WordSelector'
import Ansiedad from './pages/dashboard/Ansiedad'
import Depresion from './pages/dashboard/Depresion'
import ViewFiles from './pages/dashboard/ViewFiles'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/dashboard" element={<DashboardLayout />}>
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App