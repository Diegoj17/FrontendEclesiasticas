"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

// URL base de la API
const API_URL = "https://actaseclesiasticas.koyeb.app/api"

// Crear el contexto
const SacerdoteContext = createContext()

// Hook personalizado para usar el contexto
export const useSacerdotes = () => {
  const context = useContext(SacerdoteContext)
  if (!context) {
    throw new Error("useSacerdotes debe ser usado dentro de un SacerdoteProvider")
  }
  return context
}

// Proveedor del contexto
export const SacerdoteProvider = ({ children }) => {
  // Estado para almacenar las listas de sacerdotes, monseñores y testigos
  const [sacerdotes, setSacerdotes] = useState([])
  const [monsenores, setMonsenores] = useState([])
  const [testigos, setTestigos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar sacerdotes al iniciar sesión
  useEffect(() => {
    const fetchSacerdotes = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")

        // Obtener lista de sacerdotes
        const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/sacerdotes/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && Array.isArray(response.data)) {
          // Procesar los datos recibidos
          const sacerdotesList = response.data.map((s) => `${s.persona?.nombre || "Sin nombre"}`)

          // Filtrar monseñores (ejemplo: aquellos que tienen "Monseñor" en su nombre)
          const monsenoresList = response.data
            .filter((s) => s.persona?.nombre?.includes("Monseñor"))
            .map((s) => s.persona?.nombre || "Sin nombre")

          // Para testigos, podríamos usar la misma lista de sacerdotes o una lista específica
          // Aquí usamos la misma lista como ejemplo
          const testigosList = [...sacerdotesList]

          // Añadir la opción "Otro" a cada lista
          setSacerdotes([...sacerdotesList, "Otro"])
          setMonsenores([...monsenoresList, "Otro"])
          setTestigos([...testigosList, "Otro"])
        } else {
          // Si no hay datos o el formato es incorrecto, usar listas predeterminadas
          setSacerdotes([
            "Padre José Martínez",
            "Padre Antonio López",
            "Padre Miguel Ángel Pérez",
            "Padre Francisco Rodríguez",
            "Padre Juan Carlos Gómez",
            "Otro",
          ])

          setMonsenores(["Monseñor Pedro Gómez", "Monseñor Luis Fernández", "Monseñor Carlos Herrera", "Otro"])

          setTestigos(["María González", "Juan Pérez", "Ana Rodríguez", "Carlos Sánchez", "Laura Martínez", "Otro"])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar sacerdotes:", error)
        setError("Error al cargar la lista de sacerdotes")

        // Cargar listas predeterminadas en caso de error
        setSacerdotes([
          "Padre José Martínez",
          "Padre Antonio López",
          "Padre Miguel Ángel Pérez",
          "Padre Francisco Rodríguez",
          "Padre Juan Carlos Gómez",
          "Otro",
        ])

        setMonsenores(["Monseñor Pedro Gómez", "Monseñor Luis Fernández", "Monseñor Carlos Herrera", "Otro"])

        setTestigos(["María González", "Juan Pérez", "Ana Rodríguez", "Carlos Sánchez", "Laura Martínez", "Otro"])

        setLoading(false)
      }
    }

    // Verificar si el usuario está autenticado antes de cargar los datos
    const token = localStorage.getItem("token")
    if (token) {
      fetchSacerdotes()
    } else {
      // Si no hay token, usar listas predeterminadas
      setSacerdotes([
        "Padre José Martínez",
        "Padre Antonio López",
        "Padre Miguel Ángel Pérez",
        "Padre Francisco Rodríguez",
        "Padre Juan Carlos Gómez",
        "Otro",
      ])

      setMonsenores(["Monseñor Pedro Gómez", "Monseñor Luis Fernández", "Monseñor Carlos Herrera", "Otro"])

      setTestigos(["María González", "Juan Pérez", "Ana Rodríguez", "Carlos Sánchez", "Laura Martínez", "Otro"])

      setLoading(false)
    }
  }, [])

  // Función para agregar un nuevo sacerdote a la lista
  const agregarSacerdote = (nombre, tipo = "sacerdote") => {
    if (!nombre || nombre.trim() === "") return

    const nombreFormateado = nombre.trim()

    switch (tipo) {
      case "sacerdote":
        if (!sacerdotes.includes(nombreFormateado)) {
          setSacerdotes((prev) => [...prev.filter((s) => s !== "Otro"), nombreFormateado, "Otro"])
        }
        break
      case "monsenor":
        if (!monsenores.includes(nombreFormateado)) {
          setMonsenores((prev) => [...prev.filter((s) => s !== "Otro"), nombreFormateado, "Otro"])
        }
        break
      case "testigo":
        if (!testigos.includes(nombreFormateado)) {
          setTestigos((prev) => [...prev.filter((s) => s !== "Otro"), nombreFormateado, "Otro"])
        }
        break
      default:
        break
    }
  }

  // Valores que se proporcionarán a través del contexto
  const value = {
    sacerdotes,
    monsenores,
    testigos,
    loading,
    error,
    agregarSacerdote,
  }

  return <SacerdoteContext.Provider value={value}>{children}</SacerdoteContext.Provider>
}
