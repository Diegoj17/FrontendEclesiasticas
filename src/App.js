import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom"

import ScrollableContainer from "./ScrollableContainer"

import { AuthProvider, useAuth } from "./context/AuthContext"
import { ActaProvider } from "./context/ActaContext"
import Login from "./pages/Login"
import CrearCuenta from "./pages/CrearCuenta"
import RecuperarContraseña from "./pages/RecuperarContraseña"
import Principal from "./pages/Principal"
import EditarPerfil from "./pages/EditarPerfil"
import CambiarContraseña from "./pages/CambiarContraseña"
import AñadirActas from "./pages/AñadirActas"
import BuscarActas from "./pages/BuscarActas"
import VistaActas from "./pages/VistaActas"
import ListaActas from "./pages/ListaActas"
import EditarActas from "./pages/EditarActas"

function App() {
  return (
    <AuthProvider>
      <ActaProvider>
        <Router>
          <AppContent />
        </Router>
      </ActaProvider>
    </AuthProvider>
  )
}

// Componente intermedio
function AppContent() {
  const { isAuthenticated, user, isInitialized } = useAuth()
  const location = useLocation()
  const [initialLoad, setInitialLoad, isLoading, setIsLoading] = useState(true)

  // Guardar la ruta actual en sessionStorage (más confiable para recargas)
  useEffect(() => {
    const validPaths = [
      "/Principal", "/vistaActas", "/buscarActas", "/añadirActas", 
      "/listaActas", "/editarPerfil", "/cambiarContraseña", "/editarActas"]

    if (validPaths.includes(location.pathname) && isAuthenticated) {
      sessionStorage.setItem("currentPath", location.pathname)
      console.log("Ruta guardada:", location.pathname)
    }
  }, [location.pathname, isAuthenticated])


  // Componente de ruta protegida
  const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()

    useEffect(() => {
      if (!isAuthenticated && isInitialized) {
        navigate("/", { replace: true })
      }
    }, [navigate, isAuthenticated, isInitialized])

    if (!isAuthenticated && isInitialized) {
      return null
    }

    return children
  }

  // Componente para manejar la redirección después del login
  const LoginRedirect = () => {
    const navigate = useNavigate()

    useEffect(() => {
      if (isAuthenticated) {
        // Redirigir a la última ruta guardada o a Principal
        const savedPath = localStorage.getItem("lastPath")
        navigate("/Principal", { replace: true })
      }
    }, [navigate, isAuthenticated])

    // Solo mostrar el login si no está autenticado y la inicialización terminó
    if (isAuthenticated) {
      return null // No mostrar nada mientras se redirige
    }

    return <Login />
  }

  return (
    <ScrollableContainer>
      <Routes>
        <Route 
          path="/" 
          element={<LoginRedirect />} 
        />
        <Route 
          path="/crearCuenta" 
          element={<CrearCuenta />} 
        />
        <Route 
          path="/recuperarContraseña" 
          element={<RecuperarContraseña />} 
        />

        <Route
          path="/editarPerfil"
          element={
            <ProtectedRoute>
              <EditarPerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cambiarContraseña"
          element={
            <ProtectedRoute>
              <CambiarContraseña />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Principal"
          element={
            <ProtectedRoute>
              <Principal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vistaActas"
          element={
            <ProtectedRoute>
              <VistaActas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buscarActas"
          element={
            <ProtectedRoute>
              <BuscarActas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/añadirActas"
          element={
            <ProtectedRoute>
              <AñadirActas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listaActas"
          element={
            <ProtectedRoute>
              <ListaActas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editarActas"
          element={
            <ProtectedRoute>
              <EditarActas />
            </ProtectedRoute>
          }
        />
        

         {/* Ruta comodín que redirige a login o a la última ruta guardada */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={"/Principal"} replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
      </Routes>
    </ScrollableContainer>
  )
}

export default App
