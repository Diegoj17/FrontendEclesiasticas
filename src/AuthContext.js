
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
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser) {
      setIsAuthenticated(true)
      setUser({
        ...storedUser,
        // Asegurar compatibilidad con versiones anteriores
        nombre: storedUser.nombre || storedUser.displayName?.split(" ")[0] || "",
        apellido: storedUser.apellido || storedUser.displayName?.split(" ")[1] || ""
      })
    }
  }, [])

  // Función para iniciar sesión
  const login = (userData) => {
    const [nombre, apellido] = (userData.displayName || "").split(" ")
    const userInfo = {
      ...userData,
      nombre: nombre || "",
      apellido: apellido || "",
      displayName: userData.displayName || ""
    }
    
    setIsAuthenticated(true)
    setUser(userInfo)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(userInfo))
  }

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
  }

  const updateUser = async (newData, token) => {
    try {
      // Actualizar backend
      const response = await fetch('https://eclesiasticasbackend.onrender.com/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: newData.nombre,
          apellido: newData.apellido,
          email: newData.email
        })
      });

      if (!response.ok) throw new Error('Error al actualizar perfil');

      // Actualizar contexto y localStorage
      const updatedUser = {
        ...user,
        ...newData,
        displayName: `${newData.nombre} ${newData.apellido}`.trim()
      }
      
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  return <AuthContext.Provider value={{
    isAuthenticated,
    user,
    login,
    logout,
    updateUser }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  return useContext(AuthContext)
}