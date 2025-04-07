import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Principal from './Principal';
import Registros from "./Registros"
import ScrollableContainer from "./ScrollableContainer" 
import RecuperarContraseña from './RecuperarContraseña';
import CrearCuenta from './CrearCuenta';
import { AuthProvider } from "./AuthContext"
import ProtectedRoute from "./ProtectedRoute"
import AñadirPartidas from './AñadirPartidas';
import BuscarPartidas from './BuscarPartidas';
import EditarPerfil from './EditarPerfil';
function App() {
  return (
    <AuthProvider>
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
              path="/EditarPerfil"
              element={
              <EditarPerfil />
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
            path="/registros"
            element={
              <ProtectedRoute>
                    <Registros />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buscarPartidas"
            element={
              <ProtectedRoute>
                    <BuscarPartidas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/añadirPartidas"
            element={
              <ProtectedRoute>
                    <AñadirPartidas />
              </ProtectedRoute>
            }
          />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ScrollableContainer>
      </Router>
    </AuthProvider>
  )
}

export default App