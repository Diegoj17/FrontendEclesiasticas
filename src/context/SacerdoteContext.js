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

        console.log("Sacerdotes API response:", response.data);

        if (response.data && Array.isArray(response.data)) {
          // Procesar los datos recibidos
          const sacerdotesList = response.data
            .filter(s => s.persona && s.persona.nombre1)
            .map(s => s.persona.nombre1);

          // Filtrar monseñores (ejemplo: aquellos que tienen "Monseñor" en su nombre)
          const monsenoresList = response.data
            .filter(s => s.persona && s.persona.nombre1 && s.persona.nombre1.toLowerCase().includes("monseñor"))
            .map(s => s.persona.nombre1);

          // Para testigos, podríamos usar la misma lista de sacerdotes o una lista específica
          const testigosList = [...sacerdotesList];

          // Añadir la opción "Otro" a cada lista
          setSacerdotes([...new Set([...sacerdotesList, "Otro"])]);
          setMonsenores([...new Set([...monsenoresList, "Otro"])]);
          setTestigos([...new Set([...testigosList, "Otro"])]);
          
          console.log("Sacerdotes loaded:", sacerdotesList);
        } else {
          // Si no hay datos o el formato es incorrecto, usar listas predeterminadas
          setSacerdotes(["Otro"]);
          setMonsenores(["Otro"]);
          setTestigos(["Otro"]);
        }

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar sacerdotes:", error)
        setError("Error al cargar la lista de sacerdotes")

        // Cargar listas mínimas en caso de error
        setSacerdotes(["Otro"]);
        setMonsenores(["Otro"]);
        setTestigos(["Otro"]);

        setLoading(false)
      }
    }

    // Verificar si el usuario está autenticado antes de cargar los datos
    const token = localStorage.getItem("token")
    if (token) {
      fetchSacerdotes()
    } else {
      // Si no hay token, usar listas mínimas
      setSacerdotes(["Otro"]);
      setMonsenores(["Otro"]);
      setTestigos(["Otro"]);
      setLoading(false)
    }
  }, [])

  // Función para agregar un nuevo sacerdote a la lista
  const agregarSacerdote = async (nombre, tipo = "sacerdote") => {
    if (!nombre || nombre.trim() === "") return

    const nombreFormateado = nombre.trim()
    const token = localStorage.getItem("token")

    try {
      // Crear el sacerdote en el backend
      const response = await axios.post(
        `${API_URL}/sacerdotes/simple`,
        { nombre: nombreFormateado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      console.log("Sacerdote creado:", response.data)

      // Actualizar la lista local según el tipo
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

      return response.data
    } catch (error) {
      console.error("Error al crear sacerdote:", error)
      
      // Aún así, actualizar la lista local para mejorar la experiencia del usuario
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
      
      return null
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
