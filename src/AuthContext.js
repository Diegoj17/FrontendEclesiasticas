
import React from "react"

import { createContext, useState, useEffect, useContext } from "react"
import { auth } from "./firebase";

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
      displayName: userData.displayName || "",
    }

    setIsAuthenticated(true)
    setUser(userInfo)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(userInfo))
    // Guardar el token para usarlo en solicitudes
    if (userData.token) {
      localStorage.setItem("token", userData.token)
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const onUserUpdate = (updatedUser) => {
    console.log("User updated:", updatedUser)
  }

  const updateUser = async (newData) => {
    try {
      // Obtener token actualizado de Firebase o del localStorage
      const token = (await auth.currentUser?.getIdToken()) || localStorage.getItem("token")

      if (!token) {
        console.error("No se encontró token de autenticación")
        return false
      }

      // Preparar los datos para enviar
      const updateData = {
        nombre: newData.nombre,
        apellido: newData.apellido,
        email: newData.email,
      }

      // Si hay contraseña nueva, incluirla
      if (newData.password) {
        updateData.password = newData.password
      }

      // Realizar la solicitud HTTP
      const response = await fetch("https://eclesiasticasbackend.onrender.com/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error en la respuesta:", errorData)
        throw new Error(errorData.error || "Error al actualizar")
      }

      // Obtener los datos de la respuesta
      const responseData = await response.json()

      // Actualizar estado local con los datos recibidos o los enviados
      const updatedUser = {
        ...user,
        ...newData,
        displayName: `${newData.nombre} ${newData.apellido}`.trim(),
        // Si la respuesta incluye datos actualizados, usarlos
        ...(responseData && responseData.user ? responseData.user : {}),
      }

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      if (onUserUpdate) {
        onUserUpdate(updatedUser)
      }

      return true
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      return false
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
