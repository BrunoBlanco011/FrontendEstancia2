import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { surveyService } from '@/services/survey.service';
import type { SurveyData } from '@/services/survey.service';
import { FileCheck, ArrowRight, Loader2, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function UserSurveys() {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const data = await surveyService.getAllSurveys();
      // Solo mostramos las activas
      setSurveys(data.filter(s => s.isActive !== false));
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">
      {/* Header simple para usuarios */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">ES</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Estanciall Encuestas</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span>{user?.name} {user?.lastName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Encuestas Disponibles</h2>
          <p className="text-gray-600 mt-1">Selecciona una encuesta para comenzar a responderla.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No hay encuestas</h3>
            <p className="text-gray-500 mt-1">Vuelve más tarde para ver si hay nuevas encuestas disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-white border flex flex-col border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {survey.nameSurvey}
                  </h3>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-3">
                    {survey.description || 'Sin descripción'}
                  </p>
                </div>
                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                  <button
                    onClick={() => navigate(`/surveys/${survey.id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors group-hover:gap-3"
                  >
                    Responder Encuesta
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default UserSurveys;
