import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

// Componente para proteger rutas que requieren autenticación
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

