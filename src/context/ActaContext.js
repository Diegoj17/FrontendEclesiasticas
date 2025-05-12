import { createContext, useContext, useState, useEffect, useRef} from "react"
import ActaService from "../services/ActaService"

// Crear el contexto
const ActaContext = createContext()

// Hook personalizado para usar el contexto
export const useActas = () => {
  const context = useContext(ActaContext)
  if (!context) {
    throw new Error("useActas debe ser usado dentro de un ActaProvider")
  }
  return context
}

// Proveedor del contexto
export const ActaProvider = ({ children }) => {
  // Inicializar actas temporales: primero intenta cargar desde localStorage
  const [actasTemporales, setActasTemporales] = useState(() => {
    try {
      const saved = localStorage.getItem("actasTemporales")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
    
  })

  // Estado para controlar si se debe mostrar el modal de éxito
  const [mostrarModalExito, setMostrarModalExito] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("")

  // Persistir cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("actasTemporales", JSON.stringify(actasTemporales))
    } catch {
      // Manejo de error opcional
    }
  }, [actasTemporales])

  // Estado para las actas confirmadas (listas para guardar en la base de datos)
  const [actasConfirmadas, setActasConfirmadas] = useState([])

  // Estado para el acta que se está editando actualmente
  const [actaEditando, setActaEditando] = useState(null)

  // Estado para indicar que estamos en modo edición
  const [modoEdicion, setModoEdicion] = useState(false)

  // Estado para manejar búsquedas
  const [resultadosBusqueda, setResultadosBusqueda] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)

  // Estado para manejar operaciones en lote
  const [isBatchProcessing, setIsBatchProcessing] = useState(false)
  const [batchError, setBatchError] = useState(null)
  const [batchSuccess, setBatchSuccess] = useState(false)

  // Ref para manejar next ID global (DB + temporales)
  const nextIdRef = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem("actasTemporales", JSON.stringify(actasTemporales))
    } catch {}
  }, [actasTemporales])


  const resetBatchStatus = () => {
    setBatchSuccess(false)
    setBatchError(null)
  }

  // Carga inicial de confirmadas
  useEffect(() => {
    const fetchActas = async () => {
      try {
        const confirmadas = await ActaService.getAllActas()
        setActasConfirmadas(confirmadas)
      } catch (err) {
        console.error("Error cargando actas:", err)
      }
    }
    fetchActas()
  }, [])

  // Cargar actas al iniciar
  /*
  useEffect(() => {
    const init = async () => {
      try {
        const confirmadas = await ActaService.getAllActas()
        setActasConfirmadas(confirmadas)
        // Determina el mayor ID existente en DB y temporales
        const dbMax = confirmadas.length ? Math.max(...confirmadas.map(a => Number(a.id))) : 0
        const tempMax = actasTemporales.length ? Math.max(...actasTemporales.map(a => Number(a.id))) : 0
        // next ID es el mayor de ambos
        nextIdRef.current = Math.max(dbMax, tempMax)
      } catch (err) {
        console.error("Error inicializando IDs:", err)
        const tempMaxOnly = actasTemporales.length ? Math.max(...actasTemporales.map(a => Number(a.id))) : 0
        nextIdRef.current = tempMaxOnly
      }
    }
    init()
  }, [])
  */

  /*
  const calcularNextId = () => {
    nextIdRef.current += 1
    return nextIdRef.current
  }
    */

  // Auxiliar: calcula siguiente ID basado en DB + temporales
  const calcularNextId = () => {
    const idsDB = actasConfirmadas.map(a => Number(a.id))
    const idsTemp = actasTemporales.map(a => Number(a.id))
    const maxDB = idsDB.length ? Math.max(...idsDB) : 0
    const maxTemp = idsTemp.length ? Math.max(...idsTemp) : 0
    return Math.max(maxDB, maxTemp) + 1
  }

  // Agregar acta temporal con ID correlativo
  const agregarActaTemporal = (acta) => {
    const newId = calcularNextId()
    const actaConId = { ...acta, id: newId }
    setActasTemporales(prev => [...prev, actaConId])
  }

  const confirmarActas = (idsActas) => {
    const seleccionadas = actasTemporales.filter(a => idsActas.includes(a.id))
    const confirmadasConFecha = seleccionadas.map(a => ({
      ...a,
      confirmado: true,
      fechaConfirmacion: new Date().toISOString(),
    }))
    setActasConfirmadas(prev => [...confirmadasConFecha, ...prev])
    setActasTemporales(prev => prev.filter(a => !idsActas.includes(a.id)))
  }

  // Eliminar temporales y recalcular en next add
  /*
  const eliminarActasTemporales = (idsActas) => {
    setActasTemporales(prev => prev.filter(a => !idsActas.includes(a.id)))
  }
    */

  // Función para confirmar actas (moverlas de temporales a confirmadas)
  /*
  const confirmarActas = (idsActas) => {
    const seleccionadas = idsActas
      .map(id => actasTemporales.find(a => a.id === id))
      .filter(a => a)

    setActasConfirmadas(prev => [
      ...seleccionadas.map(a => ({ ...a, confirmado: true, fechaConfirmacion: new Date().toISOString() })),
      ...prev,
    ])

    setActasTemporales(prev => {
      const nuevos = prev.filter(a => !idsActas.includes(a.id))
      // Recalcula nextIdRef tras confirmar (similar a eliminar)
      const dbMax = Math.max(...actasConfirmadas.map(a => Number(a.id)), 0)
      const tempMax = nuevos.length ? Math.max(...nuevos.map(a => Number(a.id))) : 0
      nextIdRef.current = Math.max(dbMax, tempMax)
      return nuevos
    })
    // Mostrar el modal de éxito
    setMensajeExito("Las actas se han guardado correctamente.")
    setMostrarModalExito(true)
  }
    */

  // Función para enviar actas en lote al servidor
  const enviarActasEnLote = async (idsActas) => {
    setIsBatchProcessing(true)
    setBatchError(null)
    setBatchSuccess(false)
  
    try {
      const seleccionadas = idsActas.map((id) => actasTemporales.find((a) => a.id === id)).filter((a) => a)

      if (!seleccionadas.length) throw new Error("No hay actas seleccionadas")

      const response = await ActaService.createActasBatch(seleccionadas)
      console.log("Respuesta del servidor:", response)

      setActasConfirmadas((prev) => [
        ...seleccionadas.map((a) => ({ ...a, confirmado: true, fechaConfirmacion: new Date().toISOString() })),
        ...prev,
      ])

      setActasTemporales((prev) => prev.filter((a) => !idsActas.includes(a.id)))
      setBatchSuccess(true)

      // Mostrar el modal de éxito
      setMensajeExito("Las actas se han guardado correctamente en la base de datos.")
      setMostrarModalExito(true)
    } catch (error) {
      console.error("Error al enviar actas en lote:", error)
      setBatchError(error.message)
    } finally {
      setIsBatchProcessing(false)
    }
  }

  // Eliminar solo temporales y recalcular IDs
  /*
  const eliminarActasTemporales = (idsActas) => {
    setActasTemporales(prev => {
      const nuevos = prev.filter(a => !idsActas.includes(a.id))
      // Recalcular nextIdRef: toma DB y nuevos temporales
      const dbMax = actasConfirmadas.length ? Math.max(...actasConfirmadas.map(a => Number(a.id))) : 0
      const tempMax = nuevos.length ? Math.max(...nuevos.map(a => Number(a.id))) : 0
      nextIdRef.current = Math.max(dbMax, tempMax)
      return nuevos
    })
  }
    */
   // Eliminar temporales y re-asignar IDs secuenciales
  const eliminarActasTemporales = (idsActas) => {
    setActasTemporales(prev => {
      const restantes = prev.filter(a => !idsActas.includes(a.id))
      // Re-asignar IDs empezando desde max ID en BD
      const idsDB = actasConfirmadas.map(a => Number(a.id))
      const maxDB = idsDB.length ? Math.max(...idsDB) : 0
      let counter = maxDB
      return restantes.map(acta => ({
        ...acta,
        id: ++counter
      }))
    })
  }
    

  // Función para editar un acta temporal
  const editarActaTemporal = (id) => {
    const acta = actasTemporales.find((a) => a.id === id)
    if (acta) {
      // Crear una copia profunda del acta para evitar problemas de referencia
      const actaCopia = JSON.parse(JSON.stringify(acta))
      console.log("Estableciendo acta para editar:", actaCopia)
      setActaEditando(actaCopia)
      setModoEdicion(true) // Activar el modo edición
    } else {
      console.error("No se encontró el acta con ID:", id)
    }
  }

  // Función para actualizar un acta temporal
  const actualizarActaTemporal = (actaActualizada) => {
    setActasTemporales((prev) => prev.map((acta) => (acta.id === actaActualizada.id ? actaActualizada : acta)))
    setActaEditando(null)
    setModoEdicion(false) // Desactivar el modo edición
  }

  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setActaEditando(null)
    setModoEdicion(false)
  }

  // Función para buscar actas por nombre simple
  const buscarActasPorNombre = async (nombre) => {
    if (!nombre || nombre.trim() === "") {
      setResultadosBusqueda([])
      return []
    }

    try {
      setIsSearching(true)
      setSearchError(null)
      const resultados = await ActaService.searchByName(nombre)
      setResultadosBusqueda(transformarResultadosBusqueda(resultados))
      setIsSearching(false)
      return resultados
    } catch (error) {
      console.error("Error al buscar actas por nombre:", error)
      setSearchError("Error al buscar actas. Por favor, intente de nuevo.")
      setIsSearching(false)
      return { personaId: null, personaName: "", matrimonios: [], bautizos: [], confirmaciones: [] }
    }
  }

  // Función para buscar actas por combinación de nombres y apellidos
  const buscarActasPorNombreCompleto = async (params) => {
    // Verificar que al menos un parámetro no esté vacío
    const hayParametros = Object.values(params).some((value) => value && value.trim() !== "")

    if (!hayParametros) {
      setSearchError("Debe proporcionar al menos un criterio de búsqueda")
      setResultadosBusqueda([])
      return []
    }

    try {
      setIsSearching(true)
      setSearchError(null)

      // Filtrar parámetros vacíos
      const filteredParams = {}
      Object.entries(params).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          filteredParams[key] = value.trim()
        }
      })

      const resultados = await ActaService.searchByFullName(filteredParams)
      setResultadosBusqueda(transformarResultadosBusqueda(resultados))
      setIsSearching(false)
      return resultados
    } catch (error) {
      console.error("Error en búsqueda avanzada:", error)
      setSearchError("Error al realizar la búsqueda avanzada. Por favor, intente de nuevo.")
      setIsSearching(false)
      return { personaId: null, personaName: "", matrimonios: [], bautizos: [], confirmaciones: [] }
    }
  }

  // Función para transformar los resultados de búsqueda al formato esperado
  const transformarResultadosBusqueda = (resultados) => {
    const actasFormateadas = []

    // Agregar matrimonios
    if (resultados.matrimonios && resultados.matrimonios.length > 0) {
      resultados.matrimonios.forEach((matrimonio) => {
        actasFormateadas.push({
          id: matrimonio.id,
          tipo: "Matrimonio",
          primerNombre: matrimonio.personaA?.nombre?.split(" ")[0] || "",
          segundoNombre: matrimonio.personaA?.nombre?.split(" ")[1] || "",
          primerApellido: matrimonio.personaA?.nombre?.split(" ")[2] || "",
          segundoApellido: matrimonio.personaA?.nombre?.split(" ")[3] || "",
          libro: matrimonio.acta?.libro || "",
          folio: matrimonio.acta?.folio || "",
          acta: matrimonio.acta?.numeroActa || "",
          ceremonia: "Matrimonio",
        })
      })
    }

    // Agregar bautizos
    if (resultados.bautizos && resultados.bautizos.length > 0) {
      resultados.bautizos.forEach((bautizo) => {
        actasFormateadas.push({
          id: bautizo.id,
          tipo: "Bautismo",
          primerNombre: bautizo.idBautizado?.nombre?.split(" ")[0] || "",
          segundoNombre: bautizo.idBautizado?.nombre?.split(" ")[1] || "",
          primerApellido: bautizo.idBautizado?.nombre?.split(" ")[2] || "",
          segundoApellido: bautizo.idBautizado?.nombre?.split(" ")[3] || "",
          libro: bautizo.acta?.libro || "",
          folio: bautizo.acta?.folio || "",
          acta: bautizo.acta?.numeroActa || "",
          ceremonia: "Bautismo",
        })
      })
    }

    // Agregar confirmaciones
    if (resultados.confirmaciones && resultados.confirmaciones.length > 0) {
      resultados.confirmaciones.forEach((confirmacion) => {
        actasFormateadas.push({
          id: confirmacion.id,
          tipo: "Confirmación",
          primerNombre: confirmacion.confirmante?.nombre?.split(" ")[0] || "",
          segundoNombre: confirmacion.confirmante?.nombre?.split(" ")[1] || "",
          primerApellido: confirmacion.confirmante?.nombre?.split(" ")[2] || "",
          segundoApellido: confirmacion.confirmante?.nombre?.split(" ")[3] || "",
          libro: confirmacion.acta?.libro || "",
          folio: confirmacion.acta?.folio || "",
          acta: confirmacion.acta?.numeroActa || "",
          ceremonia: "Confirmación",
        })
      })
    }

    return actasFormateadas
  }

  // Función para obtener actas por tipo
  const obtenerActasPorTipo = async (tipo) => {
    try {
      setIsSearching(true)
      setSearchError(null)
      const actas = await ActaService.getActasByTipo(tipo)
      setIsSearching(false)
      return actas
    } catch (error) {
      console.error(`Error al obtener actas de tipo ${tipo}:`, error)
      setSearchError(`Error al obtener actas de tipo ${tipo}. Por favor, intente de nuevo.`)
      setIsSearching(false)
      return []
    }
  }

  // Función para buscar actas con filtros avanzados
  const buscarActas = async (criterios) => {
    try {
      setIsSearching(true)
      setSearchError(null)
      const resultados = await ActaService.searchActas(criterios)
      setIsSearching(false)
      return resultados
    } catch (error) {
      console.error("Error al buscar actas:", error)
      setSearchError("Error al buscar actas. Por favor, intente de nuevo.")
      setIsSearching(false)
      return []
    }
  }

  // Valores que se proporcionarán a través del contexto
  const value = {
    actasTemporales,
    setActasTemporales,
    actasConfirmadas,
    setActasConfirmadas,
    actaEditando,
    setActaEditando,
    modoEdicion,
    setModoEdicion,
    agregarActaTemporal,
    confirmarActas,
    eliminarActasTemporales,
    editarActaTemporal,
    actualizarActaTemporal,
    cancelarEdicion,
    // Funciones de búsqueda
    buscarActasPorNombre,
    buscarActasPorNombreCompleto,
    buscarActas,
    obtenerActasPorTipo,
    // Estados de búsqueda
    resultadosBusqueda,
    isSearching,
    searchError,
    setSearchError,
    // Funciones para operaciones en lote
    enviarActasEnLote,
    isBatchProcessing,
    batchError,
    batchSuccess,
    resetBatchStatus
  }

  return <ActaContext.Provider value={value}>{children}</ActaContext.Provider>
}
