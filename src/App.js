import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ScrollableContainer from "./ScrollableContainer"

import { AuthProvider, useAuth } from "./context/AuthContext"
import { ActaProvider } from "./context/ActaContext"
import Login from "./pages/Login"
import CrearCuenta from './pages/CrearCuenta';
import RecuperarContraseña from './pages/RecuperarContraseña';
import Principal from "./pages/Principal"
import EditarPerfil from './pages/EditarPerfil';
import AñadirActas from './pages/AñadirActas';
import BuscarActas from './pages/BuscarActas';
import VistaActas from './pages/VistaActas';
import ListaActas from './pages/ListaActas';
import CorregirActas from './pages/CorregirActas';


function App() {
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth()
  
    if (!isAuthenticated) {
      return <Navigate to="/" replace />
    }
  
    return children
  }

  return (
    <AuthProvider>
      <ActaProvider>
      <Router>
        <ScrollableContainer>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/crearCuenta"
              element={
              <CrearCuenta />
              }
            />
            <Route
              path="/recuperarContraseña"
              element={
              <RecuperarContraseña/>
              }
              />
              <Route
              path="/editarPerfil"
              element={
              <EditarPerfil/>
              }
              />
              <Route path="/" element={<Principal />} />
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
            path="/corregirActas"
            element={
              <ProtectedRoute>
                    <CorregirActas />
              </ProtectedRoute>
            }
          />
          
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ScrollableContainer>
      </Router>
      </ActaProvider>
    </AuthProvider>
  );
}

export default App