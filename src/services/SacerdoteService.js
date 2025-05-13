import axios from "axios"

/**
 * Servicio para gestionar los sacerdotes
 */
class SacerdotesService {
  // Caché para evitar múltiples llamadas a la API
  sacerdotesCache = null
  lastFetchTime = null
  cacheDuration = 5 * 60 * 1000 // 5 minutos en milisegundos

  /**
   * Obtiene todos los sacerdotes
   * @returns {Promise<Array>} Promesa con la lista de sacerdotes formateada para ComboBox
   */
  async getAllSacerdotes() {
    try {
      // Verificar si hay datos en caché válidos
      const now = Date.now()
      if (this.sacerdotesCache && this.lastFetchTime && now - this.lastFetchTime < this.cacheDuration) {
        return this.sacerdotesCache
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No se encontró token de autenticación")
      }

      const response = await axios.get("https://actaseclesiasticas.koyeb.app/api/sacerdotes/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Verificar si hay datos
      if (!response.data || !Array.isArray(response.data)) {
        console.warn("La respuesta de sacerdotes no es un array:", response.data)
        return ["Otro"] // Devolver al menos "Otro" como opción
      }

      // Transformar los datos para el ComboBox
      const sacerdotesOptions = response.data.map((sacerdote) => {
        // Verificar la estructura de los datos y extraer el nombre
        if (sacerdote.nombre) {
          return sacerdote.nombre
        } else if (sacerdote.nombres || sacerdote.apellidos) {
          return `${sacerdote.nombres || ""} ${sacerdote.apellidos || ""}`.trim()
        } else {
          // Si no hay nombre, usar el ID o algún otro identificador
          return `Sacerdote ${sacerdote.id || "sin nombre"}`
        }
      })

      // Filtrar valores vacíos o duplicados
      const filteredOptions = [...new Set(sacerdotesOptions.filter((name) => name.trim() !== ""))]

      // Añadir la opción "Otro" al final si no existe
      if (!filteredOptions.includes("Otro")) {
        filteredOptions.push("Otro")
      }

      // Guardar en caché
      this.sacerdotesCache = filteredOptions
      this.lastFetchTime = now

      return filteredOptions
    } catch (error) {
      console.error("Error al obtener sacerdotes:", error)
      // En caso de error, devolver al menos la opción "Otro"
      return ["Otro"]
    }
  }
}

export default new SacerdotesService()
