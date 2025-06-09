import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import HeaderAdmin from "../components/layout/HeaderAdmin"
import ActaService from "../services/ActaService"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import DataTableExpandle from "../components/layout/DataTableExpandle"
import DetallesActas from "../components/layout/DetallesActas"
import { FaArrowLeft } from "react-icons/fa"

function VistaActas() {

  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [ceremoniaSeleccionada, setCeremoniaSeleccionada] = useState('Todos');
  const [menuAbierto, setMenuAbierto] = useState(false)
  const dropdownRef = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    primerNombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    segundoNombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    primerApellido: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    segundoApellido: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    fechaNacimiento: { value: null, matchMode: FilterMatchMode.BETWEEN },
    lugarNacimiento: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    padre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ceremonia: { value: null, matchMode: FilterMatchMode.EQUALS }
  })
  

  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Todos")
  const [actasFiltradas, setActasFiltradas] = useState([])
  const [actas, setActas] = useState([])
  const [actaSeleccionada, setActaSeleccionada] = useState(null)
  const [allRegistros, setAllRegistros] = useState([])


useEffect(() => {
    fetchAllActas()
  }, [])

  // Apply local filtering when tipoSeleccionado changes
  useEffect(() => {
    filterRegistrosByTipo()
  }, [tipoSeleccionado, allRegistros])

  // Fetch all records from the API
  const fetchAllActas = async () => {
    setLoading(true)
    setError(null)
    try {
      const actasRaw = await ActaService.getAllActas()
      console.log("Todas las actas obtenidas:", actasRaw)

      const actasFormateadas = ActaService.transformActasForTable(actasRaw)
      console.log("Todas las actas formateadas:", actasFormateadas)

      setAllRegistros(actasFormateadas)
      setRegistros(actasFormateadas) // Initially show all records
    } catch (err) {
      console.error("Error al cargar todas las actas:", err)
      setError("No se pudieron cargar las actas.")
    } finally {
      setLoading(false)
    }
  }

  // Filter records locally based on selected ceremony type
  const filterRegistrosByTipo = () => {
    if (!allRegistros || allRegistros.length === 0) return

    console.log("Filtrando por tipo:", tipoSeleccionado)
    console.log("Total de registros antes de filtrar:", allRegistros.length)

    if (tipoSeleccionado === "Todos") {
      setRegistros(allRegistros)
      return
    }

    const filtrados = allRegistros.filter((acta) => {
      // Normalize ceremony type for comparison
      const ceremonia = acta.ceremonia ? acta.ceremonia.toLowerCase() : ""
      console.log(`Evaluando acta ID ${acta.id}, ceremonia: ${ceremonia}`)

      // Handle different variations of ceremony types
      if (tipoSeleccionado === "Bautismo") {
        return ceremonia.includes("bautis") || ceremonia.includes("bautiz")
      } else if (tipoSeleccionado === "Confirmacion") {
        return ceremonia.includes("confirm")
      } else if (tipoSeleccionado === "Matrimonio") {
        return ceremonia.includes("matrim")
      }

      return false
    })

    console.log(`Registros filtrados por tipo ${tipoSeleccionado}:`, filtrados.length)
    setRegistros(filtrados)

    // Clear selection if no records match or if selected record is no longer in filtered list
    if (filtrados.length === 0) {
      setSelectedRow(false)
    } else if (selectedRow && !filtrados.some((acta) => acta.id === selectedRow.id)) {
      setSelectedRow(null)
    }
  }

  const handleTipoChange = (e) => {
    const nuevoTipo = e.target.value
    console.log("Tipo seleccionado:", nuevoTipo)
    setTipoSeleccionado(nuevoTipo)
    setCeremoniaSeleccionada(nuevoTipo) // Keep both state variables in sync

    // Close any expanded row when changing ceremony type
    setSelectedRow(null)
  }
  // Función para manejar la selección de una fila y mostrar detalles
  const handleRowSelect = (rowData) => {
    console.log("Fila seleccionada:", rowData)
    setSelectedRow(rowData)

    // Imprimir todos los campos del acta para depuración
    console.log("Acta seleccionada (todos los campos):", rowData)
  }

  // Función para renderizar el template de fila expandida con detalles mejorados
  const expandedRowTemplate = (rowData) => {
    return (
      <div style={styles.expandedRowContainer}>
        <DetallesActas acta={rowData} />
      </div>
    )
  }

  const handleBack = () => {
    navigate('/admin/dashboard')
  }

  
  return (

    <div style={styles.container}>
      {/* Barra superior */}
      <HeaderAdmin title="Vista de Actas" />

        {/* Contenido principal */}
        <main
          style={{
            ...styles.content,
            transition: "margin-left 0.3s ease-in-out",
            overflow: "auto",
            height: "calc(100vh - 70px)",
          }}
        >
          {/* Selector de tipo de evento */}
          <div style={styles.filtroContainer}>
            <button onClick={handleBack} style={styles.backButton} title="Atrás">
              <FaArrowLeft style={styles.iconBack} />
              <span style={styles.buttonText}>Atrás</span>
            </button>
            <label htmlFor="ceremonia" style={styles.label}>
              Seleccionar Tipo de Ceremonia:
            </label>
            <select
              id="ceremonia"
              value={tipoSeleccionado}
              onChange={handleTipoChange}
              style={styles.select}
            >
              <option value="Todos">Todos</option>
              <option value="Bautismo">Bautizos</option>
              <option value="Confirmacion">Confirmaciones</option>
              <option value="Matrimonio">Matrimonios</option>
            </select>
            
          </div>
  
          {/* Tabla de registros */}
          <div style={styles.tableContainer}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: "1.5rem" }}></i>
                <span style={styles.loadingText}>Cargando Actas...</span>
              </div>
            ) : error ? (
              <div style={styles.errorContainer}>
                <p>{error}</p>
                <button onClick={fetchAllActas} style={styles.reloadButton}>
                  Intentar de nuevo
                </button>
              </div>
              ) : registros.length === 0 ? (
              <div style={styles.emptyContainer}>
                <p>No hay actas disponibles para el tipo de ceremonia seleccionado.</p>
              </div>
            ) : (
              <DataTableExpandle
                registrosFiltrados={registros}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                expandedRowTemplate={expandedRowTemplate}
                selectedRow={selectedRow}
                setSelectedRow={handleRowSelect}
                tipoSeleccionado={tipoSeleccionado}
              />
            )}
          </div>
        </main>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
    width: "50rem auto",
    overflow: "auto",
    cursor: 'default',
  },
  
  icon: {
    width: "18px",
    height: "18px",
    fill: "black",
  },
  buttonText: {
    fontSize: "1rem",
    flex: 1,
  },
  mainContent: {
    display: "flex",
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: "1.5rem 1rem",
    position: "relative",
    flexWrap: "wrap",
    overflowX: "auto",
    overflowY: "auto",
    transition: "margin-left 0.3s ease-in-out",
    backgroundColor: "#FFFFFF",
    height: "calc(100vh - 100px)",
    cursor: 'default',
  },
  filtroContainer: {
    alignItems: "center",
    marginBottom: "0.5rem",
    marginLeft: '0rem',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    gap: '0rem',
    cursor: 'default',
    marginTop: '-0.5rem',
  },
  label: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginLeft: '0.5rem',
    color: '#000000',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      cursor: 'text',
      borderBottom: '2px solid #3498db'
    }
  },
  select: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #ced4da',
    marginLeft: '0.5rem',
    width: '220px',
    fontWeight: '550',
    cursor: 'pointer',
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    boxShadow: "none",
    overflow: "auto",
    marginBottom: "0.5rem",
    marginTop: '1rem',
    marginLeft: '0rem',
    fontSize: '1rem',
    fontWeight: '600',
    overflowX: "auto",
    overflowY: "auto",
    whiteSpace: "nowrap",
    width: "calc(100% - 1rem)",
    cursor: 'default',
  },
  columnaTabla: {
    backgroundColor: '#FCCE74',
    border: '1px solid #000000',
    fontWeight: '600',
    fontSize: '1rem',
    color: 'black',
    textAlign: 'center',
    padding: '12px',
    borderRight: '1px solid #000',
    cursor: 'pointer',
  },
  filaTabla: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #000000',
    fontWeight: '600',
    fontSize: '1rem',
    color: 'black',
    textAlign: 'center',
    padding: '12px',
    borderRight: '1px solid #000',
    cursor: 'default',
    textTransform: "capitalize",
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    width: "100%",
    color: "red",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  reloadButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#FCCE74",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    width: "100%",
    color: "#000000",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  iconBack: {
    width: "18px",
    height: "18px",
    color: "white", 
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF000F",
    color: "white",
    gap: "0.5rem",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    marginLeft: "0rem",
    marginRight: "1rem",
    cursor: "pointer",
    fontSize: "1rem",
  },

}

export default VistaActas
