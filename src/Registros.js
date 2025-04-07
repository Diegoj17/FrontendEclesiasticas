import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import logo from "./logo.png"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import { DataTable } from "primereact/datatable"
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

function Registros() {

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
      nombre: "Martin Sanchez",
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
      evento: "Matrimonio",
      fecha: "15/04/2015",
      sacerdote: "David Martinez",    
    },
  ])

  
  const getEventoColor = (ceremonia) => {
    switch(ceremonia) {
      case 'Bautismo': return '#B3E5FC';
      case 'Confirmacion': return '#F6DC43';
      case 'Matrimonio': return '#F2B28C';
      default: return null;
    }
  }

  const handleClickOutside = useCallback((event) => {
      // Verificación segura de la referencia
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }
      setIsDropdownOpen(false);
    }, []);
  
    // 2. Efecto para el click fuera
    useEffect(() => {
      if (isDropdownOpen) {
        // Usamos capture: true para mejor manejo de eventos
        document.addEventListener('mousedown', handleClickOutside, { capture: true });
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, { capture: true });
      };
    }, [isDropdownOpen, handleClickOutside]);
  
    // 3. Manejo seguro del toggle
    const toggleDropdown = useCallback((e) => {
      e?.stopPropagation();
      setIsDropdownOpen(prev => !prev);
    }, []);

  

  const registrosFiltrados = ceremoniaSeleccionada === 'Todos'
  ? registros
  : registros.filter(registro => registro.ceremonia === ceremoniaSeleccionada);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
    if (!menuAbierto) {
      setIsSubmenuOpen(false)
    }
  }

  const handleViewRegistros = () => {
    navigate("/registros")
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleBack = () => {
    navigate("/Principal")
  }

  const handleSearch = () => {
    navigate("/buscarPartidas")
  }

  const handleAdd = () => {
    navigate("/añadirPartidas")
  }

  const handleCorrect = () => {
    console.log("Corregir partida")
  }

  const handleEditProfile = () => {
    navigate("/editar-perfil");
    setIsDropdownOpen(false);
  };

  const handleChangePassword = () => {
    navigate("/cambiar-contraseña");
    setIsDropdownOpen(false);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
  };

  const handleContainerClick = (e) => {
    // Cierra el menú si se hace clic en cualquier parte del contenedor principal
    if (isDropdownOpen && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  
  return (

    <div style={styles.container} onDoubleClick={handleDoubleClick}>
      {/* Barra superior */}
      <header style={styles.header}>
      <div
          ref={dropdownRef}
          style={styles.userContainer}
          onClick={toggleDropdown}
        >
        </div>
        <img src={logo || "/logo.png"} alt="Logo" style={styles.headerLogo} />
        <h1 style={styles.headerTitle}>Vista de Registros</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <FaSignOutAlt style={styles.iconLogout} />
          {<span style={styles.iconLogoutText}> Cerrar Sesión</span>}
        </button>
        <div style={styles.userContainer} onClick={toggleDropdown} onDoubleClick={ handleContainerClick}>
            <div style={styles.userInfo}>
              <FaUserCircle size={24} style={styles.userIcon} />
              <div style={styles.userText}>
                <span style={styles.userName}>
                {user?.displayName || "Nombre Usuario"}
                </span>
                <span style={styles.userRole}>{user?.role || "Rol"}</span>
              </div>
              {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
    
            {/* Menú desplegable */}
            {isDropdownOpen && (
              <div style={styles.dropdownMenu}>
                <button style={styles.dropdownItem} onClick={handleEditProfile}>
                  <FaEdit style={styles.dropdownIcon} />
                  <span style={styles.dropdownIconText}>Editar perfil</span>
                </button>
                <button style={styles.dropdownItem} onClick={handleChangePassword}>
                  <FaKey style={styles.dropdownIcon} />
                  <span style={styles.dropdownIconText}>Cambiar contraseña</span>
                </button>
              </div>
            )}
          </div>
        </header>
  
      <div style={styles.mainContent}>
        {/* Menú lateral estilo Gmail */}
        <nav
          style={{
            ...styles.sidebar,
            padding: menuAbierto ? "1rem" : "1.5rem 0",
            width: menuAbierto ? "250px" : "50px",
            transition: "all 0.2s ease-in-out",
            gap: menuAbierto ? "0.5rem" : "0",
            overflow: menuAbierto ? "hidden" : "auto",
            position: "fixed",
            zIndex: 1000,
            height: "calc(100vh - 70px)",
          }}
        >
          {/* Botón para expandir/colapsar */}
          <button onClick={toggleMenu} style={styles.menuToggleButton}>
            {menuAbierto ? <FaChevronRight /> : <FaBars />}
          </button>
  
          {/* Contenedor principal de botones */}
          <div style={styles.sidebarButtonsContainer}>
            {/* Botones de navegación */}
            <div style={styles.sidebarButtons}>
              <button onClick={handleViewRegistros} style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }} title="Vista de Registros">
                <FaFileAlt style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Vista de Registros</span>}
              </button>
  
              <button onClick={handleSearch} style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }} title="Buscar partidas">
                <FaSearch style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Buscar Partidas</span>}
              </button>
  
              <button onClick={handleAdd} style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }} title="Añadir partidas">
                <FaFileMedical style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Añadir Partidas</span>}
              </button>
  
              <button onClick={handleCorrect} style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }} title="Corregir partidas">
                <FaEdit style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Corregir Partidas</span>}
              </button>
            </div>
  
            {/* Botón "Atrás" al final del menú */}
            <button onClick={handleBack} style={styles.backButton} title="Atrás">
              <FaArrowLeft style={styles.iconBack} />
              {menuAbierto && <span style={styles.buttonText}>Atrás</span>}
            </button>
          </div>
        </nav>
  
        {/* Contenido principal */}
        <main
          style={{
            ...styles.content,
            marginLeft: menuAbierto ? "250px" : "50px",
            padding: menuAbierto ? "1.5rem" : "1.5rem",
            transition: "margin-left 0.2s ease-in-out",
            overflow: "hidden",
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
            <div className="card" style={{ flex: 1, overflow: "hidden" }}>
              <DataTable
                  value={registrosFiltrados}
                  showGridlines
                  sortMode="multiple"
                  scrollable
                  scrollHeight="800px"
                  filters={filters}
                  onFilter={(e) => setFilters(e.filters)}
                  tableStyle={{minWidth: "50rem", height: "100%", cursor: 'text',}}
                  
                >
                  <Column
                    field="id"
                    header="ID"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "5%" }}
                  ></Column>
                  <Column
                    field="primerNombre"
                    header="Primer Nombre"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="segundoNombre"
                    header="Segundo Nombre"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="primerApellido"
                    header="Primer Apellido"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="segundoApellido"
                    header="Segundo Apellido"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="libro"
                    header="Libro"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "7%" }}
                  ></Column>
                  <Column
                    field="folio"
                    header="Folio"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "7%" }}
                  ></Column>
                  <Column
                    field="acta"
                    header="Acta"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "7%" }}
                  ></Column>
                  <Column
                    field="ceremonia"
                    header="Ceremonia"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    body={(rowData) => (
                      <div style={{
                        backgroundColor: getEventoColor(rowData.ceremonia),
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {rowData.ceremonia}
                      </div>
                    )}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="fechaCeremonia"
                    header="Fecha Ceremonia"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="sacerdote"
                    header="Sacerdote"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="fechaNacimiento"
                    header="Fecha Nacimiento"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="lugarNacimiento"
                    header="Lugar Nacimiento"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="padre"
                    header="Padre"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="madre"
                    header="Madre"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="abueloPaterno"
                    header="Abuelo Paterno"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="abueloMaterno"
                    header="Abuelo Materno"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="abueloPaterna"
                    header="Abuela Paterna"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="abueloMaterna"
                    header="Abuelo Materna"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="padrino"
                    header="Padrino"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="madrina"
                    header="Madrina"
                    headerStyle={styles.columnaTabla}
                    bodyStyle={styles.filaTabla}
                    sortable
                    style={{ width: "20%" }}
                  ></Column>
                </DataTable>
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
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    cursor: 'default',
  },
  header: {
    backgroundColor: "#385792",
    color: "white",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
  },
  headerLogo: {
    height: "60px",
    marginRight: '800px',
  },
  headerTitle: {
    margin: -90,
    flex: 1,
    fontSize: "1.5rem",
    fontWeight: "600",
    cursor: 'default',
  },
  icon: {
    width: "18px",
    height: "18px",
    fill: "black",
  },
  iconBack: {
    width: "18px",
    height: "18px",
    fill: "white",
  },
  iconLogout: {
    width: "20px",
    height: "20px",
    fill: "white",
  },
  userContainer: {
    position: 'relative',
    cursor: 'pointer',
  },
  userName: {
    fontSize: "1rem",
    fontWeight: "600",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#e9ecef',
    },
  },
  userIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#fff",
  },
  userText: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.8rem",
  },
  roleText: {
    opacity: 0.8,
    fontSize: "0.7rem",
  },
  dropdownMenu: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    right: 0,
    top: '100%',
    backgroundColor: '#385792',
    borderRadius: '4px',
    minWidth: '100px',
    zIndex: 1000,
    textAlign: 'left',
    cursor: 'pointer',
    marginTop: '0.5rem',
    overflow: 'hidden',
    ':hover': {
      backgroundColor: '#ffffff',
      color: '#ffffff',
      transform: 'translateX(2px)',
      boxShadow: 'inset 4px 0 0 0rgb(16, 18, 19)'
    },
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#ffffff',
    },
  },
  dropdownIcon: {
    marginRight: '0.75rem',
    color: '#ffffff',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#495057',
      transform: 'scale(1.1)'
    }
  },
  dropdownIconText: {
    color: '#ffffff',
  },
  divider: {
    height: '1px',
    backgroundColor: '#ffffff',
    margin: '0.25rem 0',
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
  sidebar: {
    backgroundColor: "#f0f0f0",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 70px)",
    position: "fixed",
    left: 0,
    zIndex: 1000,
    boxShadow: "3px 0 8px rgba(0,0,0,0.15)",
    gap: "0.8rem",
    with: "100%",
    minWidth: "70px",
    borderRight: "1px solid #e0e0e0",
  },
  sidebarButtonsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "calc(100% - 50px)",
    overflow: "hidden",
  },
  sidebarButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
    overflow: "auto",
    height: "100%",
  },
  sidebarIconButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    border: "none",
    borderRadius: "0 16px 16px 0",
    backgroundColor: "#FCCE74",
    cursor: "pointer",
    textAlign: "left",
    color: "#202124",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    width: "100%",
    minHeight: "40px",
  },
  menuToggleButton: {
    backgroundColor: "#FCCE74",
    color: "black",
    border: "none",
    borderRadius: "50%",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    alignSelf: "center",
    marginBottom: "1rem",
    top: "5rem",
    left: "1rem",
    zIndex: 100,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF000F",
    gap: "0.5rem",
    color: "white",
    border: "none",
    fontSize: "1rem",
    padding: "0.5rem 1.5rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    marginRight: "1.5rem",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    border: "none",
    borderRadius: "0 16px 16px 0",
    backgroundColor: "#FF000F",
    cursor: "pointer",
    textAlign: "left",
    color: "white",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    width: "100%", 
    minHeight: "40px", 
  },
  content: {
    flex: 1,
    padding: "1.5rem",
    position: "relative",
    overflow: "auto",
    marginLeft: "200px",
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
    backgroundColor: "white",
    borderRadius: "0.5rem",
    border: "1px solid #000000",
    boxShadow: "none",
    overflow: "hidden",
    flexDirection: "column",
    marginBottom: "20px",
    marginLeft: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    overflowX: "auto",
    maxHeight: "calc(100vh - 100px)",
  },
  headerCell: {
    backgroundColor: '#FCCE74',
    fontWeight: '600',
    padding: '12px',
    borderRight: '1px solid #000'
  },
  bodyCell: {
    backgroundColor: '#FCCE74',
    padding: '12px',
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000'
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

export default Registros

