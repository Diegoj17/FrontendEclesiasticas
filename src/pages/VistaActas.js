import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import ActaService from "../services/ActaService"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import DataTableExpandle from "../components/layout/DataTableExpandle"
import DetallesActas from "../components/layout/DetallesActas"

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


useEffect(() => {
    fetchActas();
  }, [ceremoniaSeleccionada]);

  const fetchActas = async () => {
    setLoading(true);
    setError(null);
    try {
      let actasRaw;

      if (ceremoniaSeleccionada === "Todos") {
        actasRaw = await ActaService.getAllActas();
      } else {
        actasRaw = await ActaService.getActasByTipo(ceremoniaSeleccionada);
      }

      console.log("Actas obtenidas:", actasRaw);
      const actasFormateadas = ActaService.transformActasForTable(actasRaw);
      console.log("Actas formateadas:", actasFormateadas);

      setRegistros(actasFormateadas);
      setLoading(false)
    } catch (err) {
      console.error("Error al cargar actas:", err);
      setError("No se pudieron cargar las actas.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/Principal')
  }

  const handleViewActas = () => {
    navigate('/vistaActas')
  }

  // Funciones para los botones
  const handleSearch = () => {
    navigate('/buscarActas')
  }

  const handleAdd = () => {
    navigate('/añadirActas')
  }

  const handleCorrect = () => {
    navigate('/corregirActas')
  }
  
  return (

    <div style={styles.container}>
      {/* Barra superior */}
      <Header title="Vista de Actas" />

      <div style={styles.mainContent}>
        {/* Menú lateral */}
        <Sidebar 
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
        currentPage="VistaActas"
        onViewActas={handleViewActas}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onCorrect={handleCorrect}
        onBack={handleBack}
        />

        {/* Contenido principal */}
        <main
          style={{
            ...styles.content,
            marginLeft: menuAbierto ? "15.6rem" : "3rem",
            padding: menuAbierto ? "1rem 0.5rem" : "1rem 1rem",
            transition: "margin-left 0.3s ease-in-out",
            overflow: "auto",
            height: "calc(100vh - 70px)",
          }}
        >
          {/* Selector de tipo de evento */}
          <div style={styles.filtroContainer}>
            <label htmlFor="ceremonia" style={styles.label}>
              Seleccionar Tipo de Ceremonia:
            </label>
            <select
              id="ceremonia"
              value={ceremoniaSeleccionada}
              onChange={(e) => setCeremoniaSeleccionada(e.target.value)}
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
                <button onClick={fetchActas} style={styles.reloadButton}>
                  Intentar de nuevo
                </button>
              </div>
            ) : (
              <DataTableExpandle
                registrosFiltrados={registros}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                expandedRowTemplate={(rowData) => <DetallesActas acta={rowData} />}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                responsiveLayout="scroll"
              />
            )}
          </div>
        </main>
      </div>
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
    marginLeft: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    gap: '0rem',
    cursor: 'default',
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
    marginLeft: '1rem',
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

}

export default VistaActas
