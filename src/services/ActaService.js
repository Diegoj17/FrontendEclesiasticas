import axios from "axios"

// URL base de la API - Configura aquí la URL de tu backend
const API_URL = "https://actaseclesiasticas.koyeb.app/api"

/**
 * Servicio para gestionar las actas
 */
class ActaService {
  /**
   * Obtiene todas las actas
   * @returns {Promise} Promesa con la lista de actas
   */
  async getAllActas() {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/actas/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al obtener actas:", error)
      throw error
    }
  }

  /**
   * Obtiene actas por tipo
   * @param {string} tipo Tipo de acta (Bautismo, Confirmacion, Matrimonio)
   * @returns {Promise} Promesa con la lista de actas del tipo especificado
   */
  async getActasByTipo(tipo) {
    try {
      const token = localStorage.getItem("token")

      // Normalizar el tipo para manejar diferentes variaciones
      const tipoNormalizado = tipo.toLowerCase()

      // Determinar el endpoint correcto según el tipo de acta
      let endpoint
      if (tipoNormalizado === "Bautismo" || tipoNormalizado === "bautismo" ||
          tipoNormalizado === "bautizo" || tipoNormalizado === "BAUTIZO" || tipoNormalizado === "Bautizo") {
        endpoint = `https://actaseclesiasticas.koyeb.app/api/bautizos`
        console.log("Obteniendo bautizos desde:", endpoint)
      } else if (tipoNormalizado === "confirmacion" || tipoNormalizado === "confirmación") {
        endpoint = `https://actaseclesiasticas.koyeb.app/api/confirmaciones`
        console.log("Obteniendo confirmaciones desde:", endpoint)
      } else if (tipoNormalizado === "matrimonio") {
        endpoint = `https://actaseclesiasticas.koyeb.app/api/matrimonios`
        console.log("Obteniendo matrimonios desde:", endpoint)
      } else {
        // Si el tipo no es reconocido, usar el endpoint genérico
        endpoint = `${API_URL}/actas/tipo/${tipo}`
        console.log("Tipo no reconocido, usando endpoint genérico:", endpoint)
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log(`Respuesta de ${tipo}:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error al obtener actas de tipo ${tipo}:`, error)
      throw error
    }
  }

  /**
   * Transforma los datos de actas para mostrar en la tabla
   * @param {Array} actas Lista de actas a transformar
   * @returns {Array} Lista de actas transformadas para la tabla
   */

  
  transformActasForTable(actas) {
    if (!Array.isArray(actas)) {
      console.error("transformActasForTable: actas no es un array válido", actas)
      return []
    }

    return actas.map((acta) => {
      console.log("Procesando acta:", acta)

      // Determinar el tipo de ceremonia basado en los datos
      let ceremonia = ""

      // Verificar si el acta tiene un campo tipo explícito
      if (acta.tipo) {
        const tipoRaw = acta.tipo.toString().toLowerCase()
        if (["bautizo", "bautismo", "BAUTIZO", "Bautizo"].includes(tipoRaw)) {
          ceremonia = "Bautismo"
        } else if (["confirmacion", "confirmación"].includes(tipoRaw)) {
          ceremonia = "Confirmacion"
        } else if (tipoRaw === "matrimonio") {
          ceremonia = "Matrimonio"
        }
      } else {
        // Si no tiene campo tipo, intentar determinar por la estructura
        if (acta.bautizo || acta.bautismo) {
          ceremonia = "Bautismo"
        } else if (acta.confirmacion) {
          ceremonia = "Confirmacion"
        } else if (acta.matrimonio || acta.novio || acta.novia) {
          ceremonia = "Matrimonio"
        }
      }

      // Base de campos comunes
      const transformedActa = {
        id: acta.id ?? "",
        acta: acta.numeroActa ?? acta.numero ?? "",
        libro: acta.libro ?? "",
        folio: acta.folio ?? "",
        ceremonia,
        fecha: acta.fecha ?? "",
        notaMarginal: acta.notaMarginal ?? "",
        oficiante: acta.nombresSacerdote ?? acta.oficiante ?? "",
        doyFe: acta.nombresDoyFe ?? acta.doyFe ?? "",

        // Nombres de la persona central
        primerNombre: acta.nombre1 ?? acta.primerNombre ?? "",
        segundoNombre: acta.nombre2 ?? acta.segundoNombre ?? "",
        primerApellido: acta.apellido1 ?? acta.primerApellido ?? "",
        segundoApellido: acta.apellido2 ?? acta.segundoApellido ?? "",
      }

      // Campos específicos según el tipo de ceremonia
      if (ceremonia === "Bautizo") {
        Object.assign(transformedActa, this.extractBautismoFields(acta))
      } else if (ceremonia === "Confirmacion") {
        Object.assign(transformedActa, this.extractConfirmacionFields(acta))
      } else if (ceremonia === "Matrimonio") {
        Object.assign(transformedActa, this.extractMatrimonioFields(acta))
      }

      return transformedActa
    })
  }


  extractBautismoFields(acta) {
    // Si los datos están anidados en un objeto bautizo o bautismo
    const bautismoData = acta.bautizo || acta.bautismo || acta

    return {
      fechaNacimiento: bautismoData.fechaNacimiento ?? "",
      lugarNacimiento: bautismoData.lugarNacimiento ?? "",
      nombresPadre: bautismoData.nombresPadre ?? bautismoData.nombrePadre ?? "",
      nombresMadre: bautismoData.nombresMadre ?? bautismoData.nombreMadre ?? "",
      abueloPaterno: bautismoData.abueloPaterno ?? "",
      abuelaPaterna: bautismoData.abuelaPaterna ?? "",
      abueloMaterno: bautismoData.abueloMaterno ?? "",
      abuelaMaterna: bautismoData.abuelaMaterna ?? "",
      nombrepadrinos: bautismoData.nombrepadrinos ?? bautismoData.padrino ?? "",
      nombremadrinas: bautismoData.nombremadrinas ?? bautismoData.madrina ?? "",
    }
  }

  extractConfirmacionFields(acta) {
    // Si los datos están anidados en un objeto confirmacion
    const confirmacionData = acta.confirmacion || acta

    return {
      fechaConfirmacion: confirmacionData.fechaConfirmacion ?? confirmacionData.fechaNacimiento ?? "",
      monsenor: confirmacionData.nombresmonsr ?? confirmacionData.monseñor ?? "",
      padrino: confirmacionData.nombrespadrino ?? confirmacionData.padrino ?? "",
      madrina: confirmacionData.nombresmadrina ?? confirmacionData.madrina ?? "",
    }
  }


  extractMatrimonioFields(acta) {
  // Si los datos están anidados en un objeto matrimonio
  const matrimonioData = acta.matrimonio || acta;

  // Construir nombre completo de la esposa
  const nombreCompletoEsposa = [
    matrimonioData.esposanombre1 || "",
    matrimonioData.esposanombre2 || "",
    matrimonioData.esposaapellido1 || "",
    matrimonioData.esposaapellido2 || "",
  ].filter(Boolean).join(" ");

  return {
    nombreCompletoEsposa,
    fechaNacimientoEsposo: matrimonioData.fechaNacimientoEsposo || "",
    lugarNacimientoEsposo: matrimonioData.lugarNacimientoEsposo || "",
    padreEsposo: matrimonioData.nombresPadreEsposo || "",
    madreEsposo: matrimonioData.nombresMadreEsposo || "",
    fechaNacimientoEsposa: matrimonioData.fechaNacimientoEsposa || "",
    lugarNacimientoEsposa: matrimonioData.lugarNacimientoEsposa || "",
    padreEsposa: matrimonioData.nombresPadreEsposa || "",
    madreEsposa: matrimonioData.nombresMadreEsposa || "",
    testigo1: matrimonioData.nombrestestigo1 || "",
    testigo2: matrimonioData.nombrestestigo2 || "",
    testigo3: matrimonioData.nombrestestigo3 || "",
    testigo4: matrimonioData.nombrestestigo4 || "",

    // Campos comunes del esposo
    primerNombre: matrimonioData.esposonombre1 || "",
    segundoNombre: matrimonioData.esposonombre2 || "",
    primerApellido: matrimonioData.esposoapellido1 || "",
    segundoApellido: matrimonioData.esposoapellido2 || ""
  };
}
  

   /**
   * Obtiene los detalles de un bautizo por ID
   * @param {string} id ID del bautizo
   * @returns {Promise} Promesa con los detalles del bautizo
   */
  async getBautizoById(id) {
    try {
      const token = localStorage.getItem("token")
      console.log(`Fetching bautizo with ID ${id} using token: ${token ? "Token present" : "No token"}`)
      console.log(`Consultando endpoint: https://actaseclesiasticas.koyeb.app/api/bautizos/${id}`)

      const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/bautizos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Bautizo response:", response.data)

      // Check if we have data and it's properly structured
      if (response.data && (response.data.length > 0 || Object.keys(response.data).length > 0)) {
        // If it's an array, take the first item
        const data = Array.isArray(response.data) ? response.data[0] : response.data

        // Process the data to ensure all expected properties are accessible
        const processedData = {
          ...data,
          // Ensure these properties exist even if they're nested
          abuelaMaterna: data.abuelaMaterna || (data[0] && data[0].abuelaMaterna),
          abueloMaterno: data.abueloMaterno || (data[0] && data[0].abueloMaterno),
          abuelaPaterna: data.abuelaPaterna || (data[0] && data[0].abuelaPaterna),
          abueloPaterno: data.abueloPaterno || (data[0] && data[0].abueloPaterno),
          // Add any other properties that might be nested
        }

        console.log("Processed bautizo data:", processedData)
        return processedData
      }

      // If the response is empty or doesn't have the expected structure, try to fetch as a generic acta
      console.log("Empty or invalid bautizo response, trying generic acta endpoint")
      const genericResponse = await axios.get(`https://actaseclesiasticas.koyeb.app/api/actas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("Generic acta response:", genericResponse.data)
      return genericResponse.data
    } catch (error) {
      console.error(`Error al obtener bautizo con ID ${id}:`, error)
      if (error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
      }

      // If the specific endpoint fails, try the generic acta endpoint as fallback
      try {
        console.log("Trying fallback to generic acta endpoint")
        const token = localStorage.getItem("token")
        const fallbackResponse = await axios.get(`https://actaseclesiasticas.koyeb.app/api/actas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log("Fallback response:", fallbackResponse.data)
        return fallbackResponse.data
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError)
        throw error
      }
    }
  }
  /**
   * Obtiene los detalles de una confirmación por ID
   * @param {string} id ID de la confirmación
   * @returns {Promise} Promesa con los detalles de la confirmación
   */
  async getConfirmacionById(id) {
    try {
      const token = localStorage.getItem("token")
      console.log(`Fetching confirmacion with ID ${id} using token: ${token ? "Token present" : "No token"}`)
      console.log(`Consultando endpoint: https://actaseclesiasticas.koyeb.app/api}/confirmaciones/${id}`)

      const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/confirmaciones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Confirmacion response:", response.data)
      return response.data
    } catch (error) {
      console.error(`Error al obtener confirmación con ID ${id}:`, error)
      if (error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
      }
      throw error
    }
  }

  /**
   * Obtiene los detalles de un matrimonio por ID
   * @param {string} id ID del matrimonio
   * @returns {Promise} Promesa con los detalles del matrimonio
   */
  async getMatrimonioById(id) {
    try {
      const token = localStorage.getItem("token")
      console.log(`Fetching matrimonio with ID ${id} using token: ${token ? "Token present" : "No token"}`)
      console.log(`Consultando endpoint: https://actaseclesiasticas.koyeb.app/api/matrimonios/${id}`)

      const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/matrimonios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Matrimonio response:", response.data)
      return response.data
    } catch (error) {
      console.error(`Error al obtener matrimonio con ID ${id}:`, error)
      if (error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
      }
      throw error
    }
  }

  /**
   * Busca actas por nombre
   * @param {string} nombre Nombre a buscar
   * @returns {Promise} Promesa con los resultados de la búsqueda
   */
  async searchByName(nombre) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/actas/buscar`, {
        params: { nombre },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al buscar actas por nombre:", error)
      throw error
    }
  }

  /**
   * Busca actas por combinación de nombres y apellidos
   * @param {Object} params Parámetros de búsqueda (primerNombre, segundoNombre, primerApellido, segundoApellido)
   * @returns {Promise} Promesa con los resultados de la búsqueda
   */
  async searchByFullName(params) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/actas/buscaravanzado`, {
      params: {
        nombre1: params.nombre1 || "",
        nombre2: params.nombre2 || "",
        apellido1: params.apellido1 || "",
        apellido2: params.apellido2 || ""
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error en búsqueda avanzada:", error);
    throw error;
  }
}

  
  /**
   * Obtiene un acta específica por ID
   * @param {string} id ID del acta
   * @returns {Promise} Promesa con el acta encontrada
   */
  async getActaById(id) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/actas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al obtener acta por ID:", error)
      throw error
    }
  }

  /**
   * Busca actas con filtros avanzados
   * @param {Object} params Parámetros de búsqueda (libro, folio, acta, nombre, etc.)
   * @returns {Promise} Promesa con la lista de actas que coinciden con los criterios
   */
  async searchActas(params) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/actas/buscar`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al buscar actas:", error)
      throw error
    }
  }

  /**
   * Crea una nueva acta de bautismo
   * @param {Object} bautizoData Datos del bautismo
   * @returns {Promise} Promesa con el acta creada
   */
  async createBautizo(bautizoData) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${API_URL}/actas/bautismo`, bautizoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al crear acta de bautismo:", error)
      throw error
    }
  }

  /**
   * Crea una nueva acta de confirmación
   * @param {Object} confirmacionData Datos de la confirmación
   * @returns {Promise} Promesa con el acta creada
   */
  async createConfirmacion(confirmacionData) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${API_URL}/actas/confirmacion`, confirmacionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al crear acta de confirmación:", error)
      throw error
    }
  }

  /**
   * Crea una nueva acta de matrimonio
   * @param {Object} matrimonioData Datos del matrimonio
   * @returns {Promise} Promesa con el acta creada
   */
  async createMatrimonio(matrimonioData) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${API_URL}/actas/matrimonio`, matrimonioData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al crear acta de matrimonio:", error)
      throw error
    }
  }

  /**
   * Crea una nueva acta genérica
   * @param {Object} actaData Datos del acta
   * @returns {Promise} Promesa con el acta creada
   */
  async createActa(actaData) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${API_URL}/actas`, actaData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al crear acta:", error)
      throw error
    }
  }

  /**
   * Crea múltiples actas en lote
   * @param {Array} actasData Lista de actas para crear en lote
   * @returns {Promise} Promesa con el resultado de la operación
   */
 // Modificar el método createActasBatch para añadir más logs y mejorar el manejo de errores
  async createActasBatch(actasData) {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("No se encontró token de autenticación")
        throw new Error("No se encontró token de autenticación")
      }

      // Convertir cada acta al formato exacto que espera el backend
      const batchData = actasData.map((acta) => {
        console.log("Procesando acta original:", acta)

        // Crear un objeto plano con todos los campos como strings
        const actaFormateada = this.convertirActaAFormatoPlano(acta)

        // SOLUCIÓN DIRECTA: Forzar los nombres de oficiantes para confirmación
        if (acta.tipo && acta.tipo.toLowerCase().includes("confirm")) {
          // Forzar los valores de los nombres de oficiantes
          console.log("Forzando nombres para acta de confirmación")

          // Usar valores de cualquier fuente disponible, con prioridad
          actaFormateada.nombresSacerdote = String(
            acta.oficiante || acta.nombresSacerdote || (acta.confirmacion && acta.confirmacion.sacerdote) || "",
          )

          actaFormateada.nombresDoyFe = String(
            acta.doyFe || acta.nombresDoyFe || (acta.confirmacion && acta.confirmacion.doyFe) || "",
          )

          actaFormateada.nombresmonsr = String(
            (acta.confirmacion && acta.confirmacion.monseñor) || acta.nombresmonsr || acta.oficiante || "",
          )

          // Asegurar que estos campos nunca sean null o undefined
          if (
            !actaFormateada.nombresSacerdote ||
            actaFormateada.nombresSacerdote === "undefined" ||
            actaFormateada.nombresSacerdote === "null"
          ) {
            actaFormateada.nombresSacerdote = ""
          }

          if (
            !actaFormateada.nombresDoyFe ||
            actaFormateada.nombresDoyFe === "undefined" ||
            actaFormateada.nombresDoyFe === "null"
          ) {
            actaFormateada.nombresDoyFe = ""
          }

          if (
            !actaFormateada.nombresmonsr ||
            actaFormateada.nombresmonsr === "undefined" ||
            actaFormateada.nombresmonsr === "null"
          ) {
            actaFormateada.nombresmonsr = ""
          }

          console.log("Nombres forzados:", {
            nombresSacerdote: actaFormateada.nombresSacerdote,
            nombresDoyFe: actaFormateada.nombresDoyFe,
            nombresmonsr: actaFormateada.nombresmonsr,
          })
        }

        return actaFormateada
      })

      console.log("Datos formateados para enviar:", JSON.stringify(batchData, null, 2))

      const response = await axios.post("https://actaseclesiasticas.koyeb.app/api/actas/batch", batchData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Respuesta del servidor:", response.data)
      return response.data
    } catch (error) {
      console.error("Error al crear actas en lote:", error)

      // Mejor manejo de errores
      let errorMessage = "Error desconocido"
      if (error.response) {
        errorMessage = error.response.data.message || JSON.stringify(error.response.data)
        console.error("Detalles del error:", error.response.data)
        console.error("Status:", error.response.status)
        console.error("Headers:", error.response.headers)
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor"
        console.error("Request:", error.request)
      } else {
        errorMessage = error.message
      }

      throw new Error(`Error en el servidor: ${errorMessage}`)
    }
  }

  // ActaService.js

// ... (código existente)

  /**
   * Actualiza un acta existente
   * @param {string} tipo Tipo de acta (bautismo, confirmacion, matrimonio)
   * @param {string} id ID del acta a actualizar
   * @param {Object} actaData Datos del acta actualizada
   * @returns {Promise} Promesa con el resultado de la actualización
   
  async updateActa(tipo, id, actaData) {
  try {
    const token = localStorage.getItem("token");

    const formattedData = this.convertirActaAFormatoPlano({
      tipo: tipo.toLowerCase(),
      id,
      ...actaData,
    });

    // Asegúrate que el ID se mande como string
    formattedData.id = String(id);
    formattedData.tipo = tipo.toLowerCase(); // aseguramos esto

    const response = await axios.put(
      "https://actaseclesiasticas.koyeb.app/api/actas/editar",
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar acta:", error);
    throw error;
  }
}
  */

async updateActa(plano) {
  try {
    const token = localStorage.getItem("token");
    //const formattedData = this.convertirActaAFormatoPlano(actaData);
    
    // Asegurar que todos los valores sean strings
    /*
    const stringData = {};
    for (const key in formattedData) {
      stringData[key] = String(formattedData[key]);
    }
    
    // Agregar campos requeridos por el backend
    stringData.id = String(id);
    stringData.tipo = tipo.toLowerCase();
    */

    const response = await axios.put(`https://actaseclesiasticas.koyeb.app/api/actas/editar`, 
      plano, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
    return response.data;
  } catch (error) {
    console.error("Error al actualizar acta:", error);
    throw error;
  }
}

convertirPlanoAActa(plan) {
  const parseFecha = (fechaStr) => {
    if (!fechaStr) return null
    const [dia, mes, año] = fechaStr.split("-").map(Number)
    return { dia, mes, año }
  }

  const base = {
    id: plan.numero_formulario ? parseInt(plan.numero_formulario) : undefined,
    numeroActa: plan.numeroActa || "",
    folio: plan.folio || "",
    libro: plan.libro || "",
    fecha: plan.fecha || "",
    tipo: plan.tipo?.toLowerCase(),
    idSacerdote: plan.idSacerdote || "",
    nombresSacerdote: plan.nombresSacerdote || "",
    idDoyFe: plan.idDoyFe || "",
    nombresDoyFe: plan.nombresDoyFe || "",
    idmonsr: plan.idmonsr || "",
    nombresmonsr: plan.nombresmonsr || "",
    idParroquia: plan.idParroquia || "",
    notaMarginal: plan.notaMarginal || "",
  }

  switch (base.tipo) {
    case "bautizo":
      return {
        ...base,
        bautismo: {
          primerNombre: plan.nombre1 || "",
          segundoNombre: plan.nombre2 || "",
          primerApellido: plan.apellido1 || "",
          segundoApellido: plan.apellido2 || "",
          fechaNacimiento: parseFecha(plan.fechaNacimiento),
          lugarNacimiento: plan.lugarNacimiento || "",
          ciudadNacimiento: plan.ciudadNacimiento || "",
          nombrePadre: plan.nombresPadre || "",
          nombreMadre: plan.nombresMadre || "",
          abueloPaterno: plan.abueloPaterno || "",
          abuelaPaterna: plan.abuelaPaterna || "",
          abueloMaterno: plan.abueloMaterno || "",
          abuelaMaterna: plan.abuelaMaterna || "",
          padrino: plan.nombrepadrinos || "",
          madrina: plan.nombremadrinas || "",
        },
      }

    case "confirmacion":
      return {
        ...base,
        confirmacion: {
          primerNombre: plan.nombre1 || "",
          segundoNombre: plan.nombre2 || "",
          primerApellido: plan.apellido1 || "",
          segundoApellido: plan.apellido2 || "",
          fechaNacimiento: parseFecha(plan.fechaNacimiento),
          lugarNacimiento: plan.lugarNacimiento || "",
          ciudadNacimiento: plan.ciudadNacimiento || "",
          nombrePadre: plan.nombresPadre || "",
          nombreMadre: plan.nombresMadre || "",
          padrino: plan.nombrespadrino || "",
          madrina: plan.nombresmadrina || "",
          monseñor: plan.nombresmonsr || "",
          doyFe: plan.nombresDoyFe || "",
          sacerdote: plan.nombresSacerdote || "",
        },
      }

    case "matrimonio":
      return {
        ...base,
        matrimonio: {
          novio: {
            primerNombre: plan.esposonombre1 || "",
            segundoNombre: plan.esposonombre2 || "",
            primerApellido: plan.esposoapellido1 || "",
            segundoApellido: plan.esposoapellido2 || "",
            fechaNacimiento: parseFecha(plan.fechaNacimientoEsposo),
            lugarNacimiento: plan.lugarNacimientoEsposo || "",
            nombrePadre: plan.nombresPadreEsposo || "",
            nombreMadre: plan.nombresMadreEsposo || "",
          },
          novia: {
            primerNombre: plan.esposanombre1 || "",
            segundoNombre: plan.esposanombre2 || "",
            primerApellido: plan.esposaapellido1 || "",
            segundoApellido: plan.esposaapellido2 || "",
            fechaNacimiento: parseFecha(plan.fechaNacimientoEsposa),
            lugarNacimiento: plan.lugarNacimientoEsposa || "",
            nombrePadre: plan.nombresPadreEsposa || "",
            nombreMadre: plan.nombresMadreEsposa || "",
          },
          testigo1: plan.nombrestestigo1 || "",
          testigo2: plan.nombrestestigo2 || "",
          testigo3: plan.nombrestestigo3 || "",
          testigo4: plan.nombrestestigo4 || "",
        },
      }

    default:
      return base
  }
}

  convertirActaPlano(acta) {
  // Función para formatear fechas
  const formatearFecha = (fecha) => {
    if (typeof fecha === "string") return fecha;
    if (fecha && fecha.dia != null && fecha.mes != null && fecha.año != null) {
      const dia = String(fecha.dia).padStart(2, "0");
      const mes = String(fecha.mes).padStart(2, "0");
      const año = String(fecha.año).padStart(4, "0");
      return `${dia}-${mes}-${año}`;
    }
    return "";
  };

  // Aplanar el objeto de entrada
  const flat = { ...acta };
  if (acta.bautismo) Object.assign(flat, acta.bautismo);
  if (acta.confirmacion) Object.assign(flat, acta.confirmacion);
  if (acta.matrimonio) {
    // Datos de novio y novia
    const { novio = {}, novia = {}, testigo1, testigo2, testigo3, testigo4 } = acta.matrimonio;
    Object.assign(flat,
      novio,
      novia,
      { testigo1, testigo2, testigo3, testigo4 }
    );
  }

  // Normalizar tipo
  let tipo = '';
  if (flat.tipo) {
    const tl = flat.tipo.toLowerCase();
    if (tl.includes('baut')) tipo = 'bautizo';
    else if (tl.includes('confirm')) tipo = 'confirmacion';
    else if (tl.includes('matri')) tipo = 'matrimonio';
    else tipo = tl;
  }

  // Mapeo a formato plano
  const actaPlana = {
    numero_formulario: String(flat.id || Date.now()),
    numeroActa: String(flat.acta || flat.numeroActa || ''),
    folio: String(flat.folio || ''),
    libro: String(flat.libro || ''),
    fecha: formatearFecha(flat.fechaCeremonia) || flat.fecha || '',
    tipo: tipo || '',

    nombresSacerdote: String(flat.oficiante || flat.sacerdote || flat.monseñor || ''),
    nombresDoyFe: String(flat.doyFe || ''),
    notaMarginal: String(flat.notaMarginal || ''),

    // Campos personales (bautizo/confirmacion)
    nombre1: String(flat.primerNombre || ''),
    nombre2: String(flat.segundoNombre || ''),
    apellido1: String(flat.primerApellido || ''),
    apellido2: String(flat.segundoApellido || ''),
    fechaNacimiento: formatearFecha(flat.fechaNacimiento) || '',
    lugarNacimiento: String(flat.lugarNacimiento || ''),
    ciudadNacimiento: String(flat.lugarNacimiento || ''),
    nombresPadre: String(flat.nombrePadre || ''),
    nombresMadre: String(flat.nombreMadre || ''),

    // Padrinos
    nombrepadrinos: String(flat.padrino || ''),
    nombremadrinas: String(flat.madrina || ''),
    nombrespadrino: String(flat.padrino || ''),
    nombresmadrina: String(flat.madrina || ''),

    // Campos monseñor (confirmacion)
        // ...existing code...
    idmonsr: flat.idMonsr?.id !== undefined && flat.idMonsr?.id !== null
      ? String(flat.idMonsr.id)
      : (flat.idmonsr !== undefined && flat.idmonsr !== null && flat.idmonsr !== "null"
          ? String(flat.idmonsr)
          : ''),
    // ...existing code...
    nombresmonsr: String(flat.nombresmonsr || ''),

    

    // Matrimonio: esposo/esposa y testigos
    esposonombre1: String(flat.primerNombre || ''),
    esposonombre2: String(flat.segundoNombre || ''),
    esposoapellido1: String(flat.primerApellido || ''),
    esposoapellido2: String(flat.segundoApellido || ''),
    fechaNacimientoEsposo: formatearFecha(flat.fechaNacimiento) || '',
    lugarNacimientoEsposo: String(flat.lugarNacimiento || ''),
    nombresPadreEsposo: String(flat.nombrePadre || ''),
    nombresMadreEsposo: String(flat.nombreMadre || ''),

    esposanombre1: String(flat.primerNombre || ''),
    esposanombre2: String(flat.segundoNombre || ''),
    esposaapellido1: String(flat.primerApellido || ''),
    esposaapellido2: String(flat.segundoApellido || ''),
    fechaNacimientoEsposa: formatearFecha(flat.fechaNacimiento) || '',
    lugarNacimientoEsposa: String(flat.lugarNacimiento || ''),
    nombresPadreEsposa: String(flat.nombrePadre || ''),
    nombresMadreEsposa: String(flat.nombreMadre || ''),

    nombrestestigo1: String(flat.testigo1 || ''),
    nombrestestigo2: String(flat.testigo2 || ''),
    nombrestestigo3: String(flat.testigo3 || ''),
    nombrestestigo4: String(flat.testigo4 || '')
  };

  return actaPlana;
}




/*


convertirActaPlano(acta) {
    const plain = {}
    // Helper para formatear fechas objeto {dia,mes,año} o string
    const fmt = (f) => {
      if (!f) return ''
      if (typeof f === 'string') return f
      const { año, mes, dia } = f
      const y = String(año).padStart(4, '0')
      const m = String(mes).padStart(2, '0')
      const d = String(dia).padStart(2, '0')
      return `${d}-${m}-${y}`
    }

    // Campos comunes
    plain.id = String(acta.id)
    plain.tipo = String(acta.tipo)
    plain.numero_formulario = String(acta.numeroFormulario || acta.numero_formulario || '')
    plain.numeroActa = String(acta.numeroActa || acta.acta || '')
    plain.folio = String(acta.folio || '')
    plain.libro = String(acta.libro || '')
    // Fecha de ceremonia o fallback
    plain.fecha = fmt(acta.fechaCeremonia || acta.fecha)
    plain.notas = String(acta.notaMarginal || acta.notas || '')
    plain.nombresSacerdote = String(acta.nombresSacerdote || '')
    plain.nombresDoyFe = String(acta.nombresDoyFe || '')

    // Datos según tipo
    if (acta.tipo === 'bautizo') {
      const b = acta.bautismo || {}
      Object.assign(plain, {
        nombre1: String(b.primerNombre || b.nombre1 || ''),
        nombre2: String(b.segundoNombre || b.nombre2 || ''),
        apellido1: String(b.primerApellido || b.apellido1 || ''),
        apellido2: String(b.segundoApellido || b.apellido2 || ''),
        fechaNacimiento: fmt(b.fechaNacimiento),
        lugarNacimiento: String(b.lugarNacimiento || ''),
        ciudadNacimiento: String(b.ciudadNacimiento || ''),
        nombresPadre: String(b.nombrePadre || ''),
        nombresMadre: String(b.nombreMadre || ''),
        abueloPaterno: String(b.abueloPaterno || ''),
        abuelaPaterna: String(b.abuelaPaterna || ''),
        abueloMaterno: String(b.abueloMaterno || ''),
        abuelaMaterna: String(b.abuelaMaterna || ''),
        nombresPadrino: String(b.padrino || ''),
        nombresMadrina: String(b.madrina || '')
      })
    } else if (acta.tipo === 'confirmacion') {
      const c = acta.confirmacion || {}
      Object.assign(plain, {
        nombre1: String(c.primerNombre || c.nombre1 || ''),
        nombre2: String(c.segundoNombre || c.nombre2 || ''),
        apellido1: String(c.primerApellido || c.apellido1 || ''),
        apellido2: String(c.segundoApellido || c.apellido2 || ''),
        fechaNacimiento: fmt(c.fechaNacimiento),
        lugarNacimiento: String(c.lugarNacimiento || ''),
        fechaBautismo: fmt(c.fechaBautismo),
        lugarBautismo: String(c.lugarBautismo || ''),
        nombresPadre: String(c.nombrePadre || ''),
        nombresMadre: String(c.nombreMadre || ''),
        nombresPadrino: String(c.padrino || ''),
        nombresMadrina: String(c.madrina || ''),
        monseñor: String(c.monseñor || ''),
        sacerdote: String(c.sacerdote || ''),
        doyFe: String(c.doyFe || '')
      })
    } else if (acta.tipo === 'matrimonio') {
      const m = acta.matrimonio || {}
      // Novio
      Object.assign(plain, {
        novioPrimerNombre: String(m.novio?.primerNombre || ''),
        novioSegundoNombre: String(m.novio?.segundoNombre || ''),
        novioPrimerApellido: String(m.novio?.primerApellido || ''),
        novioSegundoApellido: String(m.novio?.segundoApellido || ''),
        novioFechaNacimiento: fmt(m.novio?.fechaNacimiento),
        novioLugarNacimiento: String(m.novio?.lugarNacimiento || ''),
        novioNombrePadre: String(m.novio?.nombrePadre || ''),
        novioNombreMadre: String(m.novio?.nombreMadre || ''),
      })
      // Novia
      Object.assign(plain, {
        noviaPrimerNombre: String(m.novia?.primerNombre || ''),
        noviaSegundoNombre: String(m.novia?.segundoNombre || ''),
        noviaPrimerApellido: String(m.novia?.primerApellido || ''),
        noviaSegundoApellido: String(m.novia?.segundoApellido || ''),
        noviaFechaNacimiento: fmt(m.novia?.fechaNacimiento),
        noviaLugarNacimiento: String(m.novia?.lugarNacimiento || ''),
        noviaNombrePadre: String(m.novia?.nombrePadre || ''),
        noviaNombreMadre: String(m.novia?.nombreMadre || ''),
      })
      // Testigos
      Object.assign(plain, {
        testigo1: String(m.testigo1 || ''),
        testigo2: String(m.testigo2 || ''),
        testigo3: String(m.testigo3 || ''),
        testigo4: String(m.testigo4 || '')
      })
    }

    return plain
  }


  /**
   * Convierte un acta al formato plano que espera el backend
   * @param {Object} acta Acta a convertir
   * @returns {Object} Objeto plano con todos los campos como strings
   */
  convertirActaAFormatoPlano(acta) {
    // Objeto para almacenar todos los campos como strings
    const actaPlana = {}

    // Función para formatear fechas
    const formatearFecha = (fecha) => {
      if (typeof fecha === "string") return fecha

      if (fecha && fecha.dia && fecha.mes && fecha.año) {
        const dia = String(fecha.dia).padStart(2, "0")
        const mes = String(fecha.mes).padStart(2, "0")
        const año = String(fecha.año).padStart(4, "0")
        return `${dia}-${mes}-${año}`
      }

      return ""
    }

    // Determinar el tipo de acta y normalizarlo
    let tipo = ""
    if (acta.tipo) {
      const tipoLower = acta.tipo.toLowerCase()
      if (tipoLower.includes("baut")) {
        tipo = "bautizo"
      } else if (tipoLower.includes("confirm")) {
        tipo = "confirmacion"
      } else if (tipoLower.includes("matri")) {
        tipo = "matrimonio"
      } else {
        tipo = tipoLower
      }
    }

    // Campos comunes básicos
    actaPlana["numero_formulario"] = String(acta.id || Date.now())
    actaPlana["numeroActa"] = String(acta.acta || acta.numeroActa || "")
    actaPlana["folio"] = String(acta.folio || "")
    actaPlana["libro"] = String(acta.libro || "")
    actaPlana["fecha"] = formatearFecha(acta.fechaCeremonia) || acta.fecha || ""
    actaPlana["tipo"] = tipo

    actaPlana["nombresSacerdote"] = String(
      acta.oficiante || 
      acta.confirmacion.sacerdote || 
      acta.confirmacion.monseñor || 
      ""
    );

    actaPlana["nombresDoyFe"] = String(
      acta.doyFe || 
      acta.confirmacion.doyFe || 
      ""
    );

    actaPlana["notaMarginal"] = String(acta.notaMarginal || "")

    // Campos específicos según el tipo
    if (tipo === "bautizo" && acta.bautismo) {
      actaPlana["nombre1"] = String(acta.bautismo.primerNombre || "")
      actaPlana["nombre2"] = String(acta.bautismo.segundoNombre || "")
      actaPlana["apellido1"] = String(acta.bautismo.primerApellido || "")
      actaPlana["apellido2"] = String(acta.bautismo.segundoApellido || "")
      actaPlana["fechaNacimiento"] = formatearFecha(acta.bautismo.fechaNacimiento) || ""
      actaPlana["lugarNacimiento"] = String(acta.bautismo.lugarNacimiento || "")
      actaPlana["ciudadNacimiento"] = String(acta.bautismo.lugarNacimiento || "")
      actaPlana["nombresPadre"] = String(acta.bautismo.nombrePadre || "")
      actaPlana["nombresMadre"] = String(acta.bautismo.nombreMadre || "")
      actaPlana["abueloPaterno"] = String(acta.bautismo.abueloPaterno || "")
      actaPlana["abuelaPaterna"] = String(acta.bautismo.abuelaPaterna || "")
      actaPlana["abueloMaterno"] = String(acta.bautismo.abueloMaterno || "")
      actaPlana["abuelaMaterna"] = String(acta.bautismo.abuelaMaterna || "")
      actaPlana["nombrepadrinos"] = String(acta.bautismo.padrino || "")
      actaPlana["nombremadrinas"] = String(acta.bautismo.madrina || "")

    } else if (tipo === "confirmacion" && acta.confirmacion) {
      actaPlana["nombre1"] = String(acta.confirmacion.primerNombre || "")
      actaPlana["nombre2"] = String(acta.confirmacion.segundoNombre || "")
      actaPlana["apellido1"] = String(acta.confirmacion.primerApellido || "")
      actaPlana["apellido2"] = String(acta.confirmacion.segundoApellido || "")
      actaPlana["fechaNacimiento"] = formatearFecha(acta.confirmacion.fechaNacimiento) || ""
      actaPlana["lugarNacimiento"] = String(acta.confirmacion.lugarNacimiento || "")
      actaPlana["ciudadNacimiento"] = String(acta.confirmacion.lugarNacimiento || "")
      actaPlana["nombresPadre"] = String(acta.confirmacion.nombrePadre || "")
      actaPlana["nombresMadre"] = String(acta.confirmacion.nombreMadre || "")
      actaPlana["nombrespadrino"] = String(acta.confirmacion.padrino || "")
      actaPlana["nombresmadrina"] = String(acta.confirmacion.madrina || "")
      actaPlana["idmonsr"] = acta.idmonsr ? String(acta.idmonsr) : null
      actaPlana["nombresmonsr"] = String(acta.nombresmonsr || acta.confirmacion.monseñor || acta.oficiante || "")
    } else if (tipo === "matrimonio" && acta.matrimonio) {
      // Datos del esposo
      actaPlana["esposonombre1"] = String(acta.matrimonio.novio?.primerNombre || "")
      actaPlana["esposonombre2"] = String(acta.matrimonio.novio?.segundoNombre || "")
      actaPlana["esposoapellido1"] = String(acta.matrimonio.novio?.primerApellido || "")
      actaPlana["esposoapellido2"] = String(acta.matrimonio.novio?.segundoApellido || "")
      actaPlana["fechaNacimientoEsposo"] = formatearFecha(acta.matrimonio.novio?.fechaNacimiento) || ""
      actaPlana["lugarNacimientoEsposo"] = String(acta.matrimonio.novio?.lugarNacimiento || "")
      actaPlana["nombresPadreEsposo"] = String(acta.matrimonio.novio?.nombrePadre || "")
      actaPlana["nombresMadreEsposo"] = String(acta.matrimonio.novio?.nombreMadre || "")

      // Datos de la esposa
      actaPlana["esposanombre1"] = String(acta.matrimonio.novia?.primerNombre || "")
      actaPlana["esposanombre2"] = String(acta.matrimonio.novia?.segundoNombre || "")
      actaPlana["esposaapellido1"] = String(acta.matrimonio.novia?.primerApellido || "")
      actaPlana["esposaapellido2"] = String(acta.matrimonio.novia?.segundoApellido || "")
      actaPlana["fechaNacimientoEsposa"] = formatearFecha(acta.matrimonio.novia?.fechaNacimiento) || ""
      actaPlana["lugarNacimientoEsposa"] = String(acta.matrimonio.novia?.lugarNacimiento || "")
      actaPlana["nombresPadreEsposa"] = String(acta.matrimonio.novia?.nombrePadre || "")
      actaPlana["nombresMadreEsposa"] = String(acta.matrimonio.novia?.nombreMadre || "")

      // Testigos
      actaPlana["nombrestestigo1"] = String(acta.matrimonio.testigo1 || "")
      actaPlana["nombrestestigo2"] = String(acta.matrimonio.testigo2 || "")
      actaPlana["nombrestestigo3"] = String(acta.matrimonio.testigo3 || "")
      actaPlana["nombrestestigo4"] = String(acta.matrimonio.testigo4 || "")
    }

    return actaPlana
  }

  /**
   * Formatea un acta para el envío en lote
   * @param {Object} acta Acta a formatear
   * @param {string} numeroFormulario Número de formulario a asignar
   * @returns {Object} Acta formateada para el backend
   */
  
  formatActaForBatch(acta) {
    // Formatear fecha de DD-MM-YY o usar el valor existente si ya está formateado
    const formatearFecha = (fechaObj) => {
      // Si ya es un string formateado, devolverlo tal cual
      if (typeof fechaObj === "string") return fechaObj

      // Si es un objeto con día, mes y año, formatearlo
      if (fechaObj && fechaObj.dia && fechaObj.mes && fechaObj.año) {
        const dia = String(fechaObj.dia).padStart(2, "0")
        const mes = String(fechaObj.mes).padStart(2, "0")
        const año = String(fechaObj.año).padStart(4, "0")
        return `${dia}-${mes}-${año}`
      }

      return "" // Valor por defecto
    }

    // Objeto base para el acta
    const formattedActa = {
      numero_formulario: acta.numero_formulario || acta.id || Date.now(),
      numeroActa: acta.acta || acta.numeroActa || "",
      folio: acta.folio || "",
      libro: acta.libro || "",
      fecha: formatearFecha(acta.fechaCeremonia) || acta.fecha || "",
      notaMarginal: acta.notaMarginal || "",
    }

    // Determinar el tipo de acta y formatear según corresponda
    if (acta.tipo) {
      const tipoLowerCase = acta.tipo.toLowerCase()

      // Asignar el tipo según el formato que espera el backend
      if (tipoLowerCase.includes("baut")) {
        formattedActa.tipo = "bautizo"

        // Datos específicos de bautizo
        if (acta.bautismo) {
          formattedActa.nombresSacerdote = acta.oficiante || ""
          formattedActa.nombresDoyFe = acta.doyFe || ""
          formattedActa.nombre1 = acta.bautismo.primerNombre || ""
          formattedActa.nombre2 = acta.bautismo.segundoNombre || ""
          formattedActa.apellido1 = acta.bautismo.primerApellido || ""
          formattedActa.apellido2 = acta.bautismo.segundoApellido || ""
          formattedActa.fechaNacimiento = formatearFecha(acta.bautismo.fechaNacimiento) || ""
          formattedActa.lugarNacimiento = acta.bautismo.lugarNacimiento || ""
          formattedActa.ciudadNacimiento = acta.bautismo.lugarNacimiento || ""
          formattedActa.nombresPadre = acta.bautismo.nombrePadre || ""
          formattedActa.nombresMadre = acta.bautismo.nombreMadre || ""
          formattedActa.abueloPaterno = acta.bautismo.abueloPaterno || ""
          formattedActa.abuelaPaterna = acta.bautismo.abuelaPaterna || ""
          formattedActa.abueloMaterno = acta.bautismo.abueloMaterno || ""
          formattedActa.abuelaMaterna = acta.bautismo.abuelaMaterna || ""
          formattedActa.nombrepadrinos = acta.bautismo.padrino || ""
          formattedActa.nombremadrinas = acta.bautismo.madrina || ""
        }
      } else if (tipoLowerCase.includes("confirm")) {
        formattedActa.tipo = "confirmacion"

        // Datos específicos de confirmación
        if (acta.confirmacion) {
          formattedActa.nombresSacerdote = acta.oficiante || ""
          formattedActa.nombresDoyFe = acta.doyFe || ""
          formattedActa.nombresmonsr = acta.confirmacion.monseñor || ""
          formattedActa.nombre1 = acta.confirmacion.primerNombre || ""
          formattedActa.nombre2 = acta.confirmacion.segundoNombre || ""
          formattedActa.apellido1 = acta.confirmacion.primerApellido || ""
          formattedActa.apellido2 = acta.confirmacion.segundoApellido || ""
          formattedActa.fechaNacimiento = formatearFecha(acta.confirmacion.fechaNacimiento) || ""
          formattedActa.lugarNacimiento = acta.confirmacion.lugarNacimiento || ""
          formattedActa.ciudadNacimiento = acta.confirmacion.lugarNacimiento || ""
          formattedActa.nombresPadre = acta.confirmacion.nombrePadre || ""
          formattedActa.nombresMadre = acta.confirmacion.nombreMadre || ""
          formattedActa.nombrespadrino = acta.confirmacion.padrino || ""
          formattedActa.nombresmadrina = acta.confirmacion.madrina || ""
        }
      } else if (tipoLowerCase.includes("matri")) {
        formattedActa.tipo = "matrimonio"

        // Datos específicos de matrimonio
        formattedActa.nombresSacerdote = acta.oficiante || ""
        formattedActa.nombresDoyFe = acta.doyFe || ""

        if (acta.matrimonio) {
          // Datos del esposo
          formattedActa.esposonombre1 = acta.matrimonio.novio?.primerNombre || ""
          formattedActa.esposonombre2 = acta.matrimonio.novio?.segundoNombre || ""
          formattedActa.esposoapellido1 = acta.matrimonio.novio?.primerApellido || ""
          formattedActa.esposoapellido2 = acta.matrimonio.novio?.segundoApellido || ""
          formattedActa.fechaNacimientoEsposo = formatearFecha(acta.matrimonio.novio?.fechaNacimiento) || ""
          formattedActa.lugarNacimientoEsposo = acta.matrimonio.novio?.lugarNacimiento || ""
          formattedActa.nombresPadreEsposo = acta.matrimonio.novio?.nombrePadre || ""
          formattedActa.nombresMadreEsposo = acta.matrimonio.novio?.nombreMadre || ""

          // Datos de la esposa
          formattedActa.esposanombre1 = acta.matrimonio.novia?.primerNombre || ""
          formattedActa.esposanombre2 = acta.matrimonio.novia?.segundoNombre || ""
          formattedActa.esposaapellido1 = acta.matrimonio.novia?.primerApellido || ""
          formattedActa.esposaapellido2 = acta.matrimonio.novia?.segundoApellido || ""
          formattedActa.fechaNacimientoEsposa = formatearFecha(acta.matrimonio.novia?.fechaNacimiento) || ""
          formattedActa.lugarNacimientoEsposa = acta.matrimonio.novia?.lugarNacimiento || ""
          formattedActa.nombresPadreEsposa = acta.matrimonio.novia?.nombrePadre || ""
          formattedActa.nombresMadreEsposa = acta.matrimonio.novia?.nombreMadre || ""

          // Testigos
          formattedActa.nombrestestigo1 = acta.matrimonio.testigo1 || ""
          formattedActa.nombrestestigo2 = acta.matrimonio.testigo2 || ""
          formattedActa.nombrestestigo3 = acta.matrimonio.testigo3 || ""
          formattedActa.nombrestestigo4 = acta.matrimonio.testigo4 || ""
        }
      }
    }

    return formattedActa
  }
  
}


  
    


export default new ActaService()




