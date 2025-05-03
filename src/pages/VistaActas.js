import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import DataTable from "../components/layout/DataTable"
import { Column } from "primereact/column"
import { FaFileAlt,
  FaSearch,
  FaFileMedical,
  FaEdit,
  FaChevronRight,
  FaArrowLeft,
  FaBars,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronUp,
  FaChevronDown,
  FaKey, } from "react-icons/fa"

function VistaActas() {

  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [ceremoniaSeleccionada, setCeremoniaSeleccionada] = useState('Todos');
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  
  // Datos de ejemplo para la tabla
  const [registros] = useState([
    {
      id: 1,
      nombre: "Pedro Perez",
      cedula: "1234567890",
      libro: "1",
      folio: "2",
      acta: "3",
      ceremonia: "Bautismo",
      fechaEvento: "24/05/2024",
      sacerdote: "Juan Rodriguez",
      fechaNacimiento: "24/05/2004",
      lugarNacimiento: "Cucuta",
      padre: "Angel Perez",
      madre: "Maria Lopez",
      abueloPaterno: "Pedro Gomez",
      abueloMaterno: "Alfredo Ramirez",
      abuelaPaterna: "Ana Gomez",
      abuelaMaterna: "Ana Ramirez",
      padrino: "Pedro Gomez",
      madrina: "Ana Ramirez",
    },
    {
      id: 2,
      nombre: "Martin Sanchez",
      cedula: "0987654321",
      libro: "2",
      folio: "3",
      acta: "3",
      evento: "Matrimonio",
      fecha: "15/04/2015",
      sacerdote: "David Martinez",
      ceremonia: "Bautismo",
    },
    {
      id: 3,
      nombre: "José Contreras",
      cedula: "9876543210",
      libro: "3",
      folio: "4",
      acta: "4",
      ceremonia: "Confirmacion",
      fecha: "7/11/2010",
      sacerdote: "Pedro Hernandez",
    },
    {
      id: 4,
      nombre: "Carlos Martinez",
      cedula: "1234567890",
      libro: "4",
      folio: "5",
      acta: "5",
      ceremonia: "Bautismo",
      fecha: "23/7/2007",
      sacerdote: "Juan Perez",
    },
    {
      id: 5,
      nombre: "Pedro Perez",
      cedula: "1234567890",
      libro: "1",
      folio: "2",
      acta: "3",
      evento: "Bautismo",
      fechaEvento: "24/05/2024",
      sacerdote: "Juan Rodriguez",
      fechaNacimiento: "24/05/2004",
      lugarNacimiento: "Cucuta",
      padre: "Angel Perez",
      madre: "Maria Lopez",
      abueloPaterno: "Pedro Gomez",
      abueloMaterno: "Alfredo Ramirez",
      abuelaPaterna: "Ana Gomez",
      abuelaMaterna: "Ana Ramirez",
      padrino: "Pedro Gomez",
      madrina: "Ana Ramirez",
      estadoCivil: "Soltero",
    },
    {
      id: 6,
      primerNombre: "Martin",
      segundoNombre: "Alberto",
      primerApellido: "Sanchez",
      cedula: "0987654321",
      libro: "2",
      folio: "3",
      acta: "3",
      evento: "Matrimonio",
      fecha: "15/04/2015",
      sacerdote: "David Martinez",
    },
    {
      id: 7,
      nombre: "José Contreras",
      cedula: "9876543210",
      libro: "3",
      folio: "4",
      acta: "4",
      evento: "Defunción",
      fecha: "7/11/2010",
      sacerdote: "Pedro Hernandez",
    },
    {
      id: 8,
      nombre: "Carlos Martinez",
      cedula: "1234567890",
      libro: "4",
      folio: "5",
      acta: "5",
      evento: "Primera Comunión",
      fecha: "23/7/2007",
      sacerdote: "Juan Perez",
    },
    {
      id: 9,
      nombre: "Pedro Perez",
      cedula: "1234567890",
      libro: "1",
      folio: "2",
      acta: "3",
      evento: "Bautismo",
      fechaEvento: "24/05/2024",
      sacerdote: "Juan Rodriguez",
      fechaNacimiento: "24/05/2004",
      lugarNacimiento: "Cucuta",
      padre: "Angel Perez",
      madre: "Maria Lopez",
      abueloPaterno: "Pedro Gomez",
      abueloMaterno: "Alfredo Ramirez",
      abuelaPaterna: "Ana Gomez", 
      abuelaMaterna: "Ana Ramirez",
      padrino: "Pedro Gomez",
      madrina: "Ana Ramirez",
      estadoCivil: "Soltero",    
    },
    {
      id: 10,
      nombre: "Martin Sanchez",
      cedula: "0987654321",
      libro: "2",
      folio: "3",
      acta: "3",
      ceremonia: "Matrimonio",
      fecha: "15/04/2015",
      sacerdote: "David Martinez",    
    },
    {
      id: 11,
      nombre: "Martin Sanchez",
      cedula: "0987654321",
      libro: "2",
      folio: "3",
      acta: "3",
      evento: "Matrimonio",
      fecha: "15/04/2015",
      sacerdote: "David Martinez",    
    },
  ])

  const registrosFiltrados = ceremoniaSeleccionada === 'Todos'
  ? registros
  : registros.filter(registro => registro.ceremonia === ceremoniaSeleccionada);

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
            <div className="card" style={{ flex: 1, minHeight: 0 }}>
              <DataTable
                  registrosFiltrados={registrosFiltrados}
                  filters={filters}
                  onFilter={(e) => setFilters(e.filters)}
                  
                />
              </div>
          </div>
          </main>
        </div>
      </div>
  );
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
    marginLeft: '1rem',
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
    marginLeft: '1rem',
    width: '220px',
    fontWeight: '550',
    cursor: 'pointer',
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    border: "1px solid #000000",
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

}

export default VistaActas
