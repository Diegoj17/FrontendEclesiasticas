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
      if (tipoNormalizado === "bautismo" || tipoNormalizado === "bautizo" || tipoNormalizado === "BAUTIZO") {
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
        if (["bautizo", "bautismo"].includes(tipoRaw)) {
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
      if (ceremonia === "Bautismo") {
        Object.assign(transformedActa, this.extractBautismoFields(acta))
      } else if (ceremonia === "Confirmacion") {
        Object.assign(transformedActa, this.extractConfirmacionFields(acta))
      } else if (ceremonia === "Matrimonio") {
        Object.assign(transformedActa, this.extractMatrimonioFields(acta))
      }

      return transformedActa
    })
  }

  /**
   * Extrae los campos específicos de un bautismo
   * @param {Object} acta Acta de bautismo
   * @returns {Object} Campos específicos de bautismo
   */
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

  /**
   * Extrae los campos específicos de una confirmación
   * @param {Object} acta Acta de confirmación
   * @returns {Object} Campos específicos de confirmación
   */
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

  /**
   * Extrae los campos específicos de un matrimonio
   * @param {Object} acta Acta de matrimonio
   * @returns {Object} Campos específicos de matrimonio
   */
  extractMatrimonioFields(acta) {
    // Si los datos están anidados en un objeto matrimonio
    const matrimonioData = acta.matrimonio || acta
    const novio = matrimonioData.novio || {}
    const novia = matrimonioData.novia || {}

    // Construir nombre completo de la esposa
    const nombreCompletoEsposa = [
      novia.primerNombre || matrimonioData.novia_nombre1 || "",
      novia.segundoNombre || matrimonioData.novia_nombre2 || "",
      novia.primerApellido || matrimonioData.novia_apellido1 || "",
      novia.segundoApellido || matrimonioData.novia_apellido2 || "",
    ]
      .filter(Boolean)
      .join(" ")

    return {
      nombreCompletoEsposa,
      fechaNacimientoEsposo: novio.fechaNacimiento || matrimonioData.novio_fechaNacimiento || "",
      lugarNacimientoEsposo: novio.lugarNacimiento || matrimonioData.novio_lugarNacimiento || "",
      padreEsposo: novio.nombrePadre || matrimonioData.novio_nombresPadre || "",
      madreEsposo: novio.nombreMadre || matrimonioData.novio_nombresMadre || "",
      fechaNacimientoEsposa: novia.fechaNacimiento || matrimonioData.novia_fechaNacimiento || "",
      lugarNacimientoEsposa: novia.lugarNacimiento || matrimonioData.novia_lugarNacimiento || "",
      padreEsposa: novia.nombrePadre || matrimonioData.novia_nombresPadre || "",
      madreEsposa: novia.nombreMadre || matrimonioData.novia_nombresMadre || "",
      testigo1: matrimonioData.testigo1 || "",
      testigo2: matrimonioData.testigo2 || "",
      testigo3: matrimonioData.testigo3 || "",
      testigo4: matrimonioData.testigo4 || "",
    }
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
      return response.data
    } catch (error) {
      console.error(`Error al obtener bautizo con ID ${id}:`, error)
      if (error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
      }
      throw error
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

  /*
  getBautizoById(id) {
  return axios.get(`https://actaseclesiasticas.koyeb.app/api/bautizos/${id}`)
    .then(res => res.data);
}

getConfirmacionById(id) {
  return axios.get(`https://actaseclesiasticas.koyeb.app/api/confirmaciones/${id}`)
    .then(res => res.data);
}

getMatrimonioById(id) {
  return axios.get(`https://actaseclesiasticas.koyeb.app/api/matrimonios/${id}`)
    .then(res => res.data);
}

  /**
   * Busca actas por nombre
   * @param {string} nombre Nombre a buscar
   * @returns {Promise} Promesa con los resultados de la búsqueda
   */
  async searchByName(nombre) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/actas/busquedasimple`, {
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
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://actaseclesiasticas.koyeb.app/api/actas/busquedaavanzada`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error al buscar actas por nombre completo:", error)
      throw error
    }
  }

  
  /**
   * Busca actas por tipo
   * @param {string} tipo Tipo de acta (Bautismo, Confirmación, Matrimonio)
   * @returns {Promise} Promesa con la lista de actas del tipo especificado
  
  async getActasByTipo(tipo) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://actaseclesiasticas.koyeb.app/actas/tipo/${tipo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error(`Error al obtener actas de tipo ${tipo}:`, error)
      throw error
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
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No se encontró token de autenticación");
        throw new Error("No se encontró token de autenticación");
      }

      // Eliminar lógica de numeración secuencial del frontend
      const batchData = actasData.map(acta => {
        return this.formatActaForBatch(acta);
      });

      console.log("Datos formateados para enviar:", JSON.stringify(batchData, null, 2));

      const response = await axios.post(
        "https://actaseclesiasticas.koyeb.app/api/actas/batch",
        batchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear actas en lote:", error);

      // Mejor manejo de errores
      let errorMessage = "Error desconocido";
      if (error.response) {
        errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        console.error("Detalles del error:", error.response.data);
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        errorMessage = error.message;
      }

      throw new Error(`Error en el servidor: ${errorMessage}`);
    }
}

  /**
   * Formatea un acta para el envío en lote
   * @param {Object} acta Acta a formatear
   * @param {string} numeroFormulario Número de formulario a asignar
   * @returns {Object} Acta formateada para el backend
   */
  formatActaForBatch(acta, numeroFormulario) {
    // Formatear fecha de DD-MM-YY
    const formatearFecha = (fechaObj) => {
      if (!fechaObj || !fechaObj.dia || !fechaObj.mes || !fechaObj.año) return ""
      // Formato DD-MM-YY (los últimos dos dígitos del año)
      const año = fechaObj.año.length === 4 ? fechaObj.año.substring(2) : fechaObj.año
      return `${fechaObj.dia.padStart(2, "0")}-${fechaObj.mes.padStart(2, "0")}-${año}`
    }

    // Objeto base para el acta
    let formattedActa = {}

    // Determinar el tipo de acta y formatear según corresponda
    if (acta.tipo.toLowerCase() === "bautismo") {
      formattedActa = {
        // Usar el número de formulario secuencial proporcionado
        numero_formulario: numeroFormulario,
        numeroActa: acta.acta || "",
        folio: acta.folio || "",
        libro: acta.libro || "",
        fecha: formatearFecha(acta.fechaCeremonia) || "",
        tipo: "BAUTIZO",
        nombresSacerdote: acta.oficiante || "",
        nombresDoyFe: acta.doyFe || "",
        idSacerdote: null,
        idDoyFe: null,
        notaMarginal: acta.notaMarginal || "",
      }

      if (acta.bautismo) {
        // Nombres y apellidos
        formattedActa.nombre1 = acta.bautismo.primerNombre || ""
        formattedActa.nombre2 = acta.bautismo.segundoNombre || ""
        formattedActa.apellido1 = acta.bautismo.primerApellido || ""
        formattedActa.apellido2 = acta.bautismo.segundoApellido || ""

        // Fecha y lugar de nacimiento
        formattedActa.fechaNacimiento = formatearFecha(acta.bautismo.fechaNacimiento) || ""
        formattedActa.lugarNacimiento = acta.bautismo.lugarNacimiento || ""
        formattedActa.ciudadNacimiento = acta.bautismo.lugarNacimiento || "" // Usar el mismo valor si no hay campo específico

        // Padres y abuelos
        formattedActa.nombresPadre = acta.bautismo.nombrePadre || ""
        formattedActa.nombresMadre = acta.bautismo.nombreMadre || ""
        formattedActa.abueloPaterno = acta.bautismo.abueloPaterno || ""
        formattedActa.abuelaPaterna = acta.bautismo.abuelaPaterna || ""
        formattedActa.abueloMaterno = acta.bautismo.abueloMaterno || ""
        formattedActa.abuelaMaterna = acta.bautismo.abuelaMaterna || ""

        // Padrinos y madrinas (como string)
        formattedActa.nombrepadrinos = acta.bautismo.padrino || ""
        formattedActa.nombremadrinas = acta.bautismo.madrina || ""
      }
    } else if (acta.tipo.toLowerCase() === "confirmación") {
      formattedActa = {
        // Usar el número de formulario secuencial proporcionado
        numero_formulario: numeroFormulario,
        numeroActa: acta.acta || "",
        folio: acta.folio || "",
        libro: acta.libro || "",
        fecha: formatearFecha(acta.fechaCeremonia) || "",
        tipo: "Confirmacion",
        nombresSacerdote: acta.oficiante || "",
        nombresDoyFe: acta.doyFe || "",
        idSacerdote: null,
        idDoyFe: null,
        idmonsr: null,
        idParroquia: null,
        notaMarginal: acta.notaMarginal || "",
      }

      if (acta.confirmacion) {
        // Monseñor
        formattedActa.nombresmonsr = acta.confirmacion.monseñor || ""

        // Nombres y apellidos
        formattedActa.nombre1 = acta.confirmacion.primerNombre || ""
        formattedActa.nombre2 = acta.confirmacion.segundoNombre || ""
        formattedActa.apellido1 = acta.confirmacion.primerApellido || ""
        formattedActa.apellido2 = acta.confirmacion.segundoApellido || ""

        // Fecha y lugar de nacimiento
        formattedActa.fechaNacimiento = formatearFecha(acta.confirmacion.fechaNacimiento) || ""
        formattedActa.lugarNacimiento = acta.confirmacion.lugarNacimiento || ""
        formattedActa.ciudadNacimiento = acta.confirmacion.lugarNacimiento || "" // Usar el mismo valor si no hay campo específico

        // Padres
        formattedActa.nombresPadre = acta.confirmacion.nombrePadre || ""
        formattedActa.nombresMadre = acta.confirmacion.nombreMadre || ""

        // Padrino y madrina (singular)
        formattedActa.nombrespadrino = acta.confirmacion.padrino || ""
        formattedActa.nombresmadrina = acta.confirmacion.madrina || ""
      }
    } else if (acta.tipo.toLowerCase() === "matrimonio") {
      // Matrimonio aún no está implementado en el backend según lo indicado
      formattedActa = {
        // Usar el número de formulario secuencial proporcionado
        numero_formulario: numeroFormulario,
        numeroActa: acta.acta || "",
        folio: acta.folio || "",
        libro: acta.libro || "",
        fecha: formatearFecha(acta.fechaCeremonia) || "",
        tipo: "MATRIMONIO",
        nombresSacerdote: acta.oficiante || "",
        nombresDoyFe: acta.doyFe || "",
        idSacerdote: null,
        idDoyFe: null,
        notaMarginal: acta.notaMarginal || "",
      }

      // Añadir campos básicos para matrimonio, aunque aún no funcione en el backend
      if (acta.matrimonio) {
        if (acta.matrimonio.novio) {
          formattedActa.novio_nombre1 = acta.matrimonio.novio.primerNombre || ""
          formattedActa.novio_nombre2 = acta.matrimonio.novio.segundoNombre || ""
          formattedActa.novio_apellido1 = acta.matrimonio.novio.primerApellido || ""
          formattedActa.novio_apellido2 = acta.matrimonio.novio.segundoApellido || ""
          formattedActa.novio_fechaNacimiento = formatearFecha(acta.matrimonio.novio.fechaNacimiento) || ""
          formattedActa.novio_lugarNacimiento = acta.matrimonio.novio.lugarNacimiento || ""
          formattedActa.novio_nombresPadre = acta.matrimonio.novio.nombrePadre || ""
          formattedActa.novio_nombresMadre = acta.matrimonio.novio.nombreMadre || ""
        }

        if (acta.matrimonio.novia) {
          formattedActa.novia_nombre1 = acta.matrimonio.novia.primerNombre || ""
          formattedActa.novia_nombre2 = acta.matrimonio.novia.segundoNombre || ""
          formattedActa.novia_apellido1 = acta.matrimonio.novia.primerApellido || ""
          formattedActa.novia_apellido2 = acta.matrimonio.novia.segundoApellido || ""
          formattedActa.novia_fechaNacimiento = formatearFecha(acta.matrimonio.novia.fechaNacimiento) || ""
          formattedActa.novia_lugarNacimiento = acta.matrimonio.novia.lugarNacimiento || ""
          formattedActa.novia_nombresPadre = acta.matrimonio.novia.nombrePadre || ""
          formattedActa.novia_nombresMadre = acta.matrimonio.novia.nombreMadre || ""
        }

        // Testigos
        formattedActa.testigo1 = acta.matrimonio.testigo1 || ""
        formattedActa.testigo2 = acta.matrimonio.testigo2 || ""
        formattedActa.testigo3 = acta.matrimonio.testigo3 || ""
        formattedActa.testigo4 = acta.matrimonio.testigo4 || ""
      }
    }

    return formattedActa
  }

  /**
   * Transforma los datos de actas para mostrar en la tabla
   * @param {Array} actas Lista de actas a transformar
   * @returns {Array} Lista de actas transformadas para la tabla
   */
  /*
  transformActasForTable(actas) {
    if (!actas || !Array.isArray(actas)) {
      console.error("transformActasForTable: actas no es un array válido", actas)
      return []
    }

    return actas.map((acta) => {
      // Verificar que acta es un objeto válido
      if (!acta || typeof acta !== "object") {
        console.error("transformActasForTable: acta no es un objeto válido", acta)
        return {
          id: "error",
          primerNombre: "Error",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
          ceremonia: "Error",
        }
      }

      console.log("Procesando acta:", acta)

      // Normalizar el tipo de ceremonia para mostrar consistentemente
      let ceremoniaNormalizada = acta.tipo || ""

      if (typeof ceremoniaNormalizada === "string") {
        const tipoLower = ceremoniaNormalizada.toLowerCase()

        if (tipoLower === "BAUTIZO" || tipoLower === "Bautizo"|| tipoLower === "bautizo" 
          || tipoLower === "BAUTISMO"|| tipoLower === "Bautismo" || tipoLower === "bautismo") {
          ceremoniaNormalizada = "Bautismo"
        } else if (tipoLower === "confirmacion" || tipoLower === "confirmación") {
          ceremoniaNormalizada = "Confirmacion"
        } else if (tipoLower === "matrimonio") {
          ceremoniaNormalizada = "Matrimonio"
        }
      }

      // Datos básicos del acta
      const actaTransformada = {
        id: acta.id || "",
        primerNombre: acta.nombre1 || "",
        segundoNombre: acta.nombre2 || "",
        primerApellido: acta.apellido1 || "",
        segundoApellido: acta.apellido2 || "",
        libro: acta.libro || "",
        folio: acta.folio || "",
        acta: acta.numeroActa || "",
        ceremonia: ceremoniaNormalizada,
        fecha: acta.fecha || "",
        notaMarginal: acta.notaMarginal || "",

        // Datos de la ceremonia
        nombresSacerdote: acta.nombresSacerdote || "",
        nombresDoyFe: acta.nombresDoyFe || "",

        // Campos para bautismo
        fechaNacimiento: acta.fechaNacimiento || "",
        lugarNacimiento: acta.lugarNacimiento || "",
        ciudadNacimiento: acta.ciudadNacimiento || "",
        nombresPadre: acta.nombresPadre || "",
        nombresMadre: acta.nombresMadre || "",
        abueloPaterno: acta.abueloPaterno || "",
        abuelaPaterna: acta.abuelaPaterna || "",
        abueloMaterno: acta.abueloMaterno || "",
        abuelaMaterna: acta.abuelaMaterna || "",
        nombrepadrinos: acta.nombrepadrinos || "",
        nombremadrinas: acta.nombremadrinas || "",

        // Campos para confirmación
        monsenor: acta.nombresmonsr || "",
        padrino: acta.nombrespadrino || "",
        madrina: acta.nombresmadrina || "",

        // Campos para matrimonio
        nombreCompletoEsposa: "",
        fechaNacimientoEsposo: acta.novio_fechaNacimiento || "",
        lugarNacimientoEsposo: acta.novio_lugarNacimiento || "",
        padreEsposo: acta.novio_nombresPadre || "",
        madreEsposo: acta.novio_nombresMadre || "",
        fechaNacimientoEsposa: acta.novia_fechaNacimiento || "",
        lugarNacimientoEsposa: acta.novia_lugarNacimiento || "",
        padreEsposa: acta.novia_nombresPadre || "",
        madreEsposa: acta.novia_nombresMadre || "",
        testigo1: acta.testigo1 || "",
        testigo2: acta.testigo2 || "",
        testigo3: acta.testigo3 || "",
        testigo4: acta.testigo4 || "",
      }

      // Para matrimonio, construir el nombre completo de la esposa
      if (ceremoniaNormalizada === "Matrimonio") {
        actaTransformada.nombreCompletoEsposa =
          `${acta.novia_nombre1 || ""} ${acta.novia_nombre2 || ""} ${acta.novia_apellido1 || ""} ${acta.novia_apellido2 || ""}`.trim()
      }

      return actaTransformada
    })
  }
    */

  /*
  transformActasForTable(actas) {
  if (!actas || !Array.isArray(actas)) {
    console.error("transformActasForTable: actas no es un array válido", actas);
    return [];
  }

  return actas.map((acta) => {
    // Validar
    if (!acta || typeof acta !== "object") {
      console.error("transformActasForTable: acta no es un objeto válido", acta);
      return {
        id: "error",
        primerNombre: "Error",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        ceremonia: "Error",
      };
    }

    console.log("Procesando acta:", acta);

    // Normalizar tipo de ceremonia
    let ceremoniaNormalizada = acta.tipo || "";
    const tipoLower = ceremoniaNormalizada.toLowerCase();
    if (tipoLower === "BAUTIZO" || tipoLower === "Bautizo"|| tipoLower === "bautizo" 
          || tipoLower === "BAUTISMO"|| tipoLower === "Bautismo" || tipoLower === "bautismo")
          ceremoniaNormalizada = "Bautismo";
    else if (tipoLower === "confirmacion" || tipoLower === "confirmación") ceremoniaNormalizada = "Confirmacion";
    else if (tipoLower === "matrimonio") ceremoniaNormalizada = "Matrimonio";

    // Mapeo base
    const actaTransformada = {
      id: acta.id || "",
      primerNombre: acta.nombre1 || "",
      segundoNombre: acta.nombre2 || "",
      primerApellido: acta.apellido1 || "",
      segundoApellido: acta.apellido2 || "",
      libro: acta.libro || "",
      folio: acta.folio || "",
      acta: acta.numeroActa || "",
      ceremonia: ceremoniaNormalizada,
      fecha: acta.fecha || "",
      notaMarginal: acta.notaMarginal || "",

      // Datos de la ceremonia
      nombresSacerdote: acta.nombresSacerdote || "",
      nombresDoyFe: acta.nombresDoyFe || "",

      // Campos para Bautismo
      fechaNacimiento: acta.fechaNacimiento || "",
      lugarNacimiento: acta.lugarNacimiento || "",
      ciudadNacimiento: acta.ciudadNacimiento || "",
      nombresPadre: acta.nombresPadre || "",
      nombresMadre: acta.nombresMadre || "",
      abueloPaterno: acta.abueloPaterno || "",
      abuelaPaterna: acta.abuelaPaterna || "",
      abueloMaterno: acta.abueloMaterno || "",
      abuelaMaterna: acta.abuelaMaterna || "",
      nombrepadrinos: acta.nombrepadrinos || "",
      nombremadrinas: acta.nombremadrinas || "",

      // Campos para Confirmación
      monsenor: acta.nombresmonsr || "",
      padrino: acta.nombrespadrino || "",
      madrina: acta.nombresmadrina || "",

      // Campos para Matrimonio
      nombreCompletoEsposa: "",
      fechaNacimientoEsposo: acta.novio_fechaNacimiento || "",
      lugarNacimientoEsposo: acta.novio_lugarNacimiento || "",
      padreEsposo: acta.novio_nombresPadre || "",
      madreEsposo: acta.novio_nombresMadre || "",
      fechaNacimientoEsposa: acta.novia_fechaNacimiento || "",
      lugarNacimientoEsposa: acta.novia_lugarNacimiento || "",
      padreEsposa: acta.novia_nombresPadre || "",
      madreEsposa: acta.novia_nombresMadre || "",
      testigo1: acta.testigo1 || "",
      testigo2: acta.testigo2 || "",
      testigo3: acta.testigo3 || "",
      testigo4: acta.testigo4 || "",
    };

    // Construir nombre completo de la esposa si es Matrimonio
    if (ceremoniaNormalizada === "Matrimonio") {
      actaTransformada.nombreCompletoEsposa = [
        acta.novia_nombre1,
        acta.novia_nombre2,
        acta.novia_apellido1,
        acta.novia_apellido2,
      ]
        .filter(Boolean)
        .join(" ");
    }

    return actaTransformada;
  });
}
  */

/*
transformActasForTable(actas) {
  if (!actas || !Array.isArray(actas)) {
    console.error("transformActasForTable: actas no es un array válido", actas);
    return [];
  }

  return actas.map((acta) => {
    // Validar
    if (!acta || typeof acta !== "object") {
      console.error("transformActasForTable: acta no es un objeto válido", acta);
      return {
        id: "error",
        primerNombre: "Error",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        ceremonia: "Error",
      };
    }

    console.log("Procesando acta:", acta);

    // Normalize the ceremony type
    /*
    let ceremoniaNormalizada = acta.tipo || "";
    if (typeof ceremoniaNormalizada === "string") {
      const tipoLower = ceremoniaNormalizada.toLowerCase();
      if (tipoLower === "bautizo" || tipoLower === "bautismo") {
        ceremoniaNormalizada = "Bautismo";
      } else if (tipoLower === "confirmacion" || tipoLower === "confirmación") {
        ceremoniaNormalizada = "Confirmacion";
      } else if (tipoLower === "matrimonio") {
        ceremoniaNormalizada = "Matrimonio";
      }
    }

    let ceremoniaNormalizada = acta.tipo || ""

    if (typeof ceremoniaNormalizada === "string") {
        const tipoLower = ceremoniaNormalizada.toLowerCase()

        if (tipoLower === "BAUTIZO" || tipoLower === "Bautizo"|| tipoLower === "bautizo" 
          || tipoLower === "BAUTISMO"|| tipoLower === "Bautismo" || tipoLower === "bautismo") {
          ceremoniaNormalizada = "Bautismo"
        } else if (tipoLower === "CONFIRMACION" ||tipoLower === "Confirmacion" || tipoLower === "confirmacion" 
          || tipoLower === "confirmación") {
          ceremoniaNormalizada = "Confirmacion"
        } else if (tipoLower === "matrimonio") {
          ceremoniaNormalizada = "Matrimonio"
        }
      }

    const transformed = {
      id: acta.id,
      tipo: ceremoniaNormalizada,
      libro: acta.libro,
      folio: acta.folio,
      acta: acta.numeroActa,
      fechaCeremonia: acta.fecha,
      notaMarginal: acta.notaMarginal,
      oficiante: acta.nombresSacerdote,
      doyFe: acta.nombresDoyFe
    };

    // Agrupar campos según el tipo de acta
    switch(ceremoniaNormalizada.toLowerCase()) {
      case 'bautismo':
        transformed.bautismo = {
          primerNombre: acta.nombre1,
          segundoNombre: acta.nombre2,
          primerApellido: acta.apellido1,
          segundoApellido: acta.apellido2,
          fechaNacimiento: this.parseFecha(acta.fechaNacimiento),
          lugarNacimiento: acta.lugarNacimiento,
          nombrePadre: acta.nombresPadre,
          nombreMadre: acta.nombresMadre,
          abueloPaterno: acta.abueloPaterno,
          abuelaPaterna: acta.abuelaPaterna,
          abueloMaterno: acta.abueloMaterno,
          abuelaMaterna: acta.abuelaMaterna,
          padrino: acta.nombrepadrinos,
          madrina: acta.nombremadrinas
        };
        break;

      case 'confirmacion':
        transformed.confirmacion = {
          primerNombre: acta.nombre1,
          segundoNombre: acta.nombre2,
          primerApellido: acta.apellido1,
          segundoApellido: acta.apellido2,
          fechaNacimiento: this.parseFecha(acta.fechaNacimiento),
          lugarNacimiento: acta.lugarNacimiento,
          nombrePadre: acta.nombresPadre,
          nombreMadre: acta.nombresMadre,
          padrino: acta.nombrespadrino,
          madrina: acta.nombresmadrina,
          monseñor: acta.nombresmonsr
        };
        break;

      case 'matrimonio':
        transformed.matrimonio = {
          novio: {
            primerNombre: acta.novio_nombre1,
            segundoNombre: acta.novio_nombre2,
            primerApellido: acta.novio_apellido1,
            segundoApellido: acta.novio_apellido2,
            fechaNacimiento: this.parseFecha(acta.novio_fechaNacimiento),
            lugarNacimiento: acta.novio_lugarNacimiento,
            nombrePadre: acta.novio_nombresPadre,
            nombreMadre: acta.novio_nombresMadre
          },
          novia: {
            primerNombre: acta.novia_nombre1,
            segundoNombre: acta.novia_nombre2,
            primerApellido: acta.novia_apellido1,
            segundoApellido: acta.novia_apellido2,
            fechaNacimiento: this.parseFecha(acta.novia_fechaNacimiento),
            lugarNacimiento: acta.novia_lugarNacimiento,
            nombrePadre: acta.novia_nombresPadre,
            nombreMadre: acta.novia_nombresMadre
          },
          testigo1: acta.testigo1,
          testigo2: acta.testigo2,
          testigo3: acta.testigo3,
          testigo4: acta.testigo4
        };
        break;

        default: // Añadir caso default
        console.warn("Tipo de ceremonia no reconocido:", ceremoniaNormalizada);

        break;
    }

    return transformed;
  });
}

parseFecha(fechaStr) {
  if (!fechaStr) return {};
  const [dia, mes, año] = fechaStr.split('-');
  return { dia, mes, año: año.length === 2 ? `20${año}` : año };
}
  

transformActasForTable(actas) {
  if (!Array.isArray(actas)){
    console.error("transformActasForTable: actas no es un array válido", actas) 
    return [];
  }

  return actas.map((acta) => {

    console.log("Procesando acta:", acta);
    
    const tipoRaw = (acta.tipo || "").toString().toLowerCase();
    let ceremonia = "";
    if (["bautizo","bautismo"].includes(tipoRaw)) ceremonia = "Bautismo";
    else if (["confirmacion","confirmación"].includes(tipoRaw)) ceremonia = "Confirmacion";
    else if (tipoRaw === "matrimonio") ceremonia = "Matrimonio";

    // Base de campos comunes
    const t = {
      id: acta.id ?? "",
      acta: acta.numeroActa ?? "",
      libro: acta.libro ?? "",
      folio: acta.folio ?? "",
      ceremonia,
      fecha: acta.fecha ?? "",
      notaMarginal: acta.notaMarginal ?? "",
      oficiante: acta.nombresSacerdote ?? "",
      doyFe: acta.nombresDoyFe ?? "",

      // Nombres de la persona central
      primerNombre: acta.nombre1 ?? "",
      segundoNombre: acta.nombre2 ?? "",
      primerApellido: acta.apellido1 ?? acta.nombre3 ?? "",
      segundoApellido: acta.apellido2 ?? acta.nombre4 ?? "",
    };

    // Campos de Bautismo
    if (ceremonia === "Bautismo") {
      Object.assign(t, {
        fechaNacimiento: acta.fechaNacimiento ?? "",
        lugarNacimiento: acta.lugarNacimiento ?? "",
        nombresPadre: acta.nombresPadre ?? "",
        nombresMadre: acta.nombresMadre ?? "",
        abueloPaterno: acta.abueloPaterno ?? "",
        abuelaPaterna: acta.abuelaPaterna ?? "",
        abueloMaterno: acta.abueloMaterno ?? "",
        abuelaMaterna: acta.abuelaMaterna ?? "",
        nombrepadrinos: acta.nombrepadrinos ?? "",
        nombremadrinas: acta.nombremadrinas ?? "",
      });
    }

    // Campos de Confirmacion
    if (ceremonia === "Confirmacion") {
      Object.assign(t, {
        fechaConfirmacion: acta.fechaConfirmacion ?? acta.fechaNacimiento ?? "",
        monsenor: acta.nombresmonsr ?? "",
        padrino: acta.nombrespadrino ?? "",
        madrina: acta.nombresmadrina ?? "",
      });
    }

    // Campos de Matrimonio
    if (ceremonia === "Matrimonio") {
      Object.assign(t, {
        nombreCompletoEsposa: [
          acta.novia_nombre1, acta.novia_nombre2,
          acta.novia_nombre3, acta.novia_nombre4
        ].filter(Boolean).join(" "),
        fechaNacimientoEsposo: acta.novio_fechaNacimiento ?? "",
        lugarNacimientoEsposo: acta.novio_lugarNacimiento ?? "",
        padreEsposo: acta.novio_nombresPadre ?? "",
        madreEsposo: acta.novio_nombresMadre ?? "",
        fechaNacimientoEsposa: acta.novia_fechaNacimiento ?? "",
        lugarNacimientoEsposa: acta.novia_lugarNacimiento ?? "",
        padreEsposa: acta.novia_nombresPadre ?? "",
        madreEsposa: acta.novia_nombresMadre ?? "",
        testigo1: acta.testigo1 ?? "",
        testigo2: acta.testigo2 ?? "",
        testigo3: acta.testigo3 ?? "",
        testigo4: acta.testigo4 ?? "",
      });
    }

    return t;
  });
}

*/

transformActasForTable(actas) {
    if (!Array.isArray(actas)) {
      console.error("transformActasForTable: actas no es un array válido", actas)
      return []
    }

    return actas.map((acta) => {
      console.log("Procesando acta:", acta)

      const tipoRaw = (acta.tipo || "").toString().toLowerCase()
      let ceremonia = ""
      if (["bautizo", "bautismo"].includes(tipoRaw)) ceremonia = "Bautismo"
      else if (["confirmacion", "confirmación"].includes(tipoRaw)) ceremonia = "Confirmacion"
      else if (tipoRaw === "matrimonio") ceremonia = "Matrimonio"

      // Base de campos comunes
      const t = {
        id: acta.id ?? "",
        acta: acta.numeroActa ?? "",
        libro: acta.libro ?? "",
        folio: acta.folio ?? "",
        ceremonia,
        fecha: acta.fecha ?? "",
        notaMarginal: acta.notaMarginal ?? "",
        oficiante: acta.nombresSacerdote ?? "",
        doyFe: acta.nombresDoyFe ?? "",

        // Nombres de la persona central
        primerNombre: acta.nombre1 ?? "",
        segundoNombre: acta.nombre2 ?? "",
        primerApellido: acta.apellido1 ?? acta.nombre3 ?? "",
        segundoApellido: acta.apellido2 ?? acta.nombre4 ?? "",
      }

      // Campos de Bautismo
      if (ceremonia === "Bautismo") {
        Object.assign(t, {
          fechaNacimiento: acta.fechaNacimiento ?? "",
          lugarNacimiento: acta.lugarNacimiento ?? "",
          nombresPadre: acta.nombresPadre ?? "",
          nombresMadre: acta.nombresMadre ?? "",
          abueloPaterno: acta.abueloPaterno ?? "",
          abuelaPaterna: acta.abuelaPaterna ?? "",
          abueloMaterno: acta.abueloMaterno ?? "",
          abuelaMaterna: acta.abuelaMaterna ?? "",
          nombrepadrinos: acta.nombrepadrinos ?? "",
          nombremadrinas: acta.nombremadrinas ?? "",
        })
      }

      // Campos de Confirmacion
      if (ceremonia === "Confirmacion") {
        Object.assign(t, {
          fechaConfirmacion: acta.fechaConfirmacion ?? acta.fechaNacimiento ?? "",
          monsenor: acta.nombresmonsr ?? "",
          padrino: acta.nombrespadrino ?? "",
          madrina: acta.nombresmadrina ?? "",
        })
      }

      // Campos de Matrimonio
      if (ceremonia === "Matrimonio") {
        Object.assign(t, {
          nombreCompletoEsposa: [acta.novia_nombre1, acta.novia_nombre2, acta.novia_nombre3, acta.novia_nombre4]
            .filter(Boolean)
            .join(" "),
          fechaNacimientoEsposo: acta.novio_fechaNacimiento ?? "",
          lugarNacimientoEsposo: acta.novio_lugarNacimiento ?? "",
          padreEsposo: acta.novio_nombresPadre ?? "",
          madreEsposo: acta.novio_nombresMadre ?? "",
          fechaNacimientoEsposa: acta.novia_fechaNacimiento ?? "",
          lugarNacimientoEsposa: acta.novia_lugarNacimiento ?? "",
          padreEsposa: acta.novia_nombresPadre ?? "",
          madreEsposa: acta.novia_nombresMadre ?? "",
          testigo1: acta.testigo1 ?? "",
          testigo2: acta.testigo2 ?? "",
          testigo3: acta.testigo3 ?? "",
          testigo4: acta.testigo4 ?? "",
        })
      }

      return t
    })
  }

}

export default new ActaService()




