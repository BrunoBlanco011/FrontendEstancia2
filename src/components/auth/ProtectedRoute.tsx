import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 1 | 2; // 1 = Admin, 2 = User
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login y guardar la ubicación para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const numericRoleId = Number(user?.roleId);

  if (requiredRole && isNaN(numericRoleId)) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-red-100 text-red-800 p-4">
        <h1 className="text-2xl font-bold mb-4">Error de Sesión</h1>
        <p>El rol del usuario es inválido o no se pudo cargar.</p>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Cerrar Sesión y Volver a Intentar
        </button>
      </div>
    );
  }

  if (requiredRole && numericRoleId !== requiredRole) {
    // Si no tiene permiso, redirigir según su rol
    return <Navigate to={numericRoleId === ROLES.ADMIN ? "/dashboard" : "/surveys"} replace />;
  }

  return children;
};
