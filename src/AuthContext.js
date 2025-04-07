
import React from "react"

import { createContext, useState, useEffect, useContext } from "react"

// Crear el contexto de autenticación
const AuthContext = createContext(null)

// Proveedor del contexto que mantendrá el estado de autenticación
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  // Al cargar el componente, verificar si hay una sesión guardada
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    const storedUser = localStorage.getItem("user")

    if (storedAuth === "true") {
      setIsAuthenticated(true)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  // Función para iniciar sesión
  const login = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  return useContext(AuthContext)
}

