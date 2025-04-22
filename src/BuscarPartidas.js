import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import logo from "./logo.png"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { Tag } from "primereact/tag"
import {
  FaFileAlt,
  FaSearch,
  FaFileMedical,
  FaEdit,
  FaPrint,
  FaChevronRight,
  FaChevronUp,
  FaArrowLeft,
  FaBars,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaKey,
} from "react-icons/fa"

// Asegúrate de importar los estilos de PrimeReact
import "primereact/resources/themes/lara-light-indigo/theme.css" // tema
import "primereact/resources/primereact.min.css" // core
import "primeicons/primeicons.css" // iconos
import "primeflex/primeflex.css" // primeflex

function BuscarPartidas() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRow, setSelectedRow] = useState(null)
  const [printFormat, setPrintFormat] = useState("corto")
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Datos de ejemplo para la tabla
  const [registros] = useState([
    {
      id: 1,
      primerNombre: "Pedro",
      segundoNombre: "José",
      primerApellido: "Perez",
      segundoApellido: "Gomez",
      cedula: "1234567890",
      libro: "1",
      folio: "2",
      acta: "3",
      evento: "Bautismo",
      ceremonia: "Bautismo",
      fecha: "24/05/2004",
      sacerdote: "Juan Rodriguez",
      padre: "Carlos Perez",
      madre: "Maria Gomez",
      abueloPaterno: "José Perez",
      abueloMaterno: "Pedro Gomez",
      abuelaPaterna: "Ana Ruiz",
      abuelaMaterna: "Luisa Martinez",
      padrinos: ["Juan Perez", "Ana Gomez"],
      oficiante: "P. Juan Rodriguez",
      párroco: "P. Miguel Hernandez",
      diocesis: "Caracas",
    },
    {
      id: 3,
      primerNombre: "Pedro",
      segundoNombre: "José",
      primerApellido: "Perez",
      segundoApellido: "Gomez",
      cedula: "1234567890",
      libro: "5",
      folio: "4",
      acta: "3",
      evento: "Bautismo",
      ceremonia: "Bautismo",
      fecha: "24/05/2004",
      sacerdote: "Juan Rodriguez",
      padre: "Carlos Perez",
      madre: "Maria Gomez",
      abueloPaterno: "José Perez",
      abueloMaterno: "Pedro Gomez",
      abuelaPaterna: "Ana Ruiz",
      abuelaMaterna: "Luisa Martinez",
      padrinos: ["Juan Perez", "Ana Gomez"],
      oficiante: "P. Juan Rodriguez",
      párroco: "P. Miguel Hernandez",
      diocesis: "Caracas",
    },
    {
      id: 2,
      primerNombre: "Martin",
      segundoNombre: "Antonio",
      primerApellido: "Sanchez",
      segundoApellido: "Rodriguez",
      cedula: "0987654321",
      libro: "2",
      folio: "3",
      acta: "3",
      evento: "Matrimonio",
      ceremonia: "Matrimonio",
      fecha: "15/04/2015",
      sacerdote: "David Martinez",
      padre: "Luis Sanchez",
      madre: "Carmen Rodriguez",
      abueloPaterno: "Antonio Sanchez",
      abueloMaterno: "Martin Rodriguez",
      abuelaPaterna: "Rosa Perez",
      abuelaMaterna: "Teresa Gomez",
      padrinos: ["Pedro Sanchez", "Maria Rodriguez"],
      oficiante: "P. David Martinez",
      párroco: "P. Miguel Hernandez",
      diocesis: "Caracas",
    },
    {
      id: 4,
      primerNombre: "José",
      segundoNombre: "Luis",
      primerApellido: "Contreras",
      segundoApellido: "Hernandez",
      cedula: "9876543210",
      libro: "3",
      folio: "4",
      acta: "4",
      evento: "Defunción",
      ceremonia: "Defunción",
      fecha: "7/11/2010",
      sacerdote: "Pedro Hernandez",
      padre: "Manuel Contreras",
      madre: "Josefina Hernandez",
      abueloPaterno: "Luis Contreras",
      abueloMaterno: "José Hernandez",
      abuelaPaterna: "Marta Lopez",
      abuelaMaterna: "Juana Diaz",
      padrinos: ["Carlos Contreras", "Luisa Hernandez"],
      oficiante: "P. Pedro Hernandez",
      párroco: "P. Miguel Hernandez",
      diocesis: "Caracas",
    },
    {
      id: 5,
      primerNombre: "Carlos",
      segundoNombre: "Alberto",
      primerApellido: "Martinez",
      segundoApellido: "Lopez",
      cedula: "1234567890",
      libro: "4",
      folio: "5",
      acta: "5",
      evento: "Primera Comunión",
      ceremonia: "Primera Comunión",
      fecha: "23/7/2007",
      sacerdote: "Juan Perez",
      padre: "Alberto Martinez",
      madre: "Sofia Lopez",
      abueloPaterno: "Carlos Martinez",
      abueloMaterno: "Alberto Lopez",
      abuelaPaterna: "Patricia Diaz",
      abuelaMaterna: "Claudia Perez",
      padrinos: ["Roberto Martinez", "Patricia Lopez"],
      oficiante: "P. Juan Perez",
      párroco: "P. Miguel Hernandez",
      diocesis: "Caracas",
    },
  ])

  // Configuración de filtros para PrimeReact DataTable
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    primerNombre: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    segundoNombre: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    primerApellido: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    segundoApellido: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  })

  // Datos filtrados para la tabla
  const [registrosFiltrados, setRegistrosFiltrados] = useState([])

  // Búsqueda en tiempo real
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setRegistrosFiltrados([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const timeoutId = setTimeout(() => {
      const resultados = registros.filter((registro) => {
        const fullName =
          `${registro.primerNombre} ${registro.segundoNombre} ${registro.primerApellido} ${registro.segundoApellido}`.toLowerCase()
        return fullName.includes(searchTerm.toLowerCase())
      })

      setRegistrosFiltrados(resultados)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, registros])

  // Eventos de PrimeReact
  const getEventoColor = (ceremonia) => {
    switch(ceremonia) {
      case 'Bautismo': return '#B3E5FC';
      case 'Confirmacion': return '#F6DC43';
      case 'Matrimonio': return '#F2B28C';
      default: return null;
    }
  }

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleAdd = () => {
    navigate("/añadirPartidas")
  }

  const handleCorrect = () => {
    console.log("Corregir partida")
  }

  const generarFormatoCorto = () => {
    if (!selectedRow) return

    const selectedRecord = registros.find((r) => r.id === selectedRow.id)
    if (!selectedRecord) return

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificado Bautismal - ${selectedRecord.primerNombre}</title>
          <style>
            @page { margin: 2cm; size: A4 portrait; }
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #2c3e50;
            }
            .encabezado {
              border-bottom: 3px solid #385792;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .titulo-principal {
              color: #385792;
              font-size: 24pt;
              text-align: center;
              margin: 20px 0;
            }
            .tabla-datos {
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
            }
            .tabla-datos td {
              padding: 12px;
              border: 1px solid #ddd;
            }
            .tabla-datos td:first-child {
              font-weight: bold;
              width: 30%;
              background-color: #f8f9fa;
            }
            .sello-parroquia {
              float: right;
              width: 150px;
              margin: 20px;
            }
            @media print {
              .no-print { display: none; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <img src="/sello-oficial.png" alt="Sello Parroquial" class="sello-parroquia">
          
          <div class="encabezado">
            <h1 class="titulo-principal">CERTIFICADO DE BAUTISMO</h1>
            <p style="text-align: center;">Parroquia San Luis Gonzaga</p>
            <p style="text-align: center;">Diócesis de ${selectedRecord.diocesis || "N/A"}</p>
          </div>
  
          <table class="tabla-datos">
            <tr>
              <td>Nombre completo:</td>
              <td>${selectedRecord.primerNombre} ${selectedRecord.segundoNombre} ${selectedRecord.primerApellido} ${selectedRecord.segundoApellido}</td>
            </tr>
            <tr>
              <td>Fecha de bautizo:</td>
              <td>${selectedRecord.fecha}</td>
            </tr>
            <tr>
              <td>Libro/Acta/Folio:</td>
              <td>${selectedRecord.libro} - ${selectedRecord.folio} - ${selectedRecord.acta}</td>
            </tr>
            <tr>
              <td>Padrinos:</td>
              <td>${selectedRecord.padrinos ? selectedRecord.padrinos.join(", ") : "N/A"}</td>
            </tr>
            <tr>
              <td>Celebrante:</td>
              <td>${selectedRecord.oficiante || selectedRecord.sacerdote}</td>
            </tr>
          </table>
  
          <div style="margin-top: 50px;">
            <p>Fecha de emisión: ${new Date().toLocaleDateString()}</p>
            <div style="text-align: center; margin-top: 40px;">
              <p>__________________________</p>
              <p>P. ${selectedRecord.párroco || "N/A"}</p>
              <p>Párroco</p>
            </div>
          </div>
  
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handlePrintLargo = () => {
    if (!selectedRow) return

    const selectedRecord = registros.find((r) => r.id === selectedRow.id)
    if (!selectedRecord) return

    const formatos = {
      largo: Object.keys(selectedRecord).filter(
        (key) => typeof selectedRecord[key] !== "object" && key !== "id" && key !== "padrinos",
      ),
    }

    const camposImpresion = formatos.largo

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Partida de ${selectedRecord.primerNombre}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { 
              border-bottom: 2px solid #000; 
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
            .formato-largo td { padding: 12px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Certificado Completo</h2>
            <p>Emitido: ${new Date().toLocaleDateString()}</p>
          </div>
  
          <table class="formato-largo">
            <tbody>
              ${camposImpresion
                .map(
                  (key) => `
                <tr>
                  <th>${
                    key
                      .replace(/([A-Z])/g, " $1")
                      .charAt(0)
                      .toUpperCase() + key.replace(/([A-Z])/g, " $1").slice(1)
                  }</th>
                  <td>${selectedRecord[key] || "N/A"}</td>
                </tr>
              `,
                )
                .join("")}
              ${
                selectedRecord.padrinos
                  ? `
                <tr>
                  <th>Padrinos</th>
                  <td>${selectedRecord.padrinos.join(", ")}</td>
                </tr>
              `
                  : ""
              }
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: right;">
            <p>_________________________</p>
            <p>Firma autorizada</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // Templates para PrimeReact DataTable
  const eventoBodyTemplate = (rowData) => {
    return <Tag value={rowData.ceremonia} severity={getEventoColor(rowData.ceremonia)} />
  }

  const onGlobalFilterChange = (event) => {
    const value = event.target.value
    const _filters = { ...filters }
    _filters["global"].value = value
    setFilters(_filters)
  }

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : ""
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            value={value || ""}
            onChange={(e) => onGlobalFilterChange(e)}
            placeholder="Buscar..."
          />
        </IconField>
      </div>
    )
  }

  const header = renderHeader()

  const expandedRowTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>
          Detalles de {data.primerNombre} {data.primerApellido}
        </h5>
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-2 border-1 surface-border border-round">
              <div className="text-500 font-medium mb-2">Información Familiar</div>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="font-medium">Padre:</span>
                <span>{data.padre}</span>
              </div>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="font-medium">Madre:</span>
                <span>{data.madre}</span>
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-2 border-1 surface-border border-round">
              <div className="text-500 font-medium mb-2">Abuelos Paternos</div>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="font-medium">Abuelo:</span>
                <span>{data.abueloPaterno}</span>
              </div>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="font-medium">Abuela:</span>
                <span>{data.abuelaPaterna}</span>
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-2 border-1 surface-border border-round">
              <div className="text-500 font-medium mb-2">Abuelos Maternos</div>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="font-medium">Abuelo:</span>
                <span>{data.abueloMaterno}</span>
              </div>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="font-medium">Abuela:</span>
                <span>{data.abuelaMaterna}</span>
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-2 border-1 surface-border border-round">
              <div className="text-500 font-medium mb-2">Información Adicional</div>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="font-medium">Sacerdote:</span>
                <span>{data.sacerdote}</span>
              </div>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="font-medium">Padrinos:</span>
                <span>{data.padrinos ? data.padrinos.join(", ") : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleEditProfile = () => {
    navigate("/editar-perfil");
    setIsDropdownOpen(false);
  };

  const handleChangePassword = () => {
    navigate("/cambiar-contraseña");
    setIsDropdownOpen(false);
  };

return (
      <div style={styles.container}>
        {/* Barra superior */}
        <header style={styles.header}>
          <img src={logo || "/logo.png"} alt="Logo" style={styles.headerLogo} />
          <h1 style={styles.headerTitle}>Búsqueda de Partidas</h1>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <FaSignOutAlt style={styles.iconLogout} />
            {<span style={styles.iconLogoutText}> Cerrar Sesión</span>}
          </button>
          <div style={styles.userContainer} onClick={toggleDropdown}>
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
              height: "calc(100vh - 70px)", // Ajusta la altura del menú
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
                <button
                  onClick={handleViewRegistros}
                  style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                  title="Vista de Actas"
                >
                  <FaFileAlt style={styles.icon} />
                  {menuAbierto && <span style={styles.buttonText}>Vista de Actas</span>}
                </button>

                <button
                  style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                  title="Buscar Actas"
                >
                  <FaSearch style={styles.icon} />
                  {menuAbierto && <span style={styles.buttonText}>Buscar Actas</span>}
                </button>

                <button
                  onClick={handleAdd}
                  style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                  title="Crear Actas"
                >
                  <FaFileMedical style={styles.icon} />
                  {menuAbierto && <span style={styles.buttonText}>Crear Actas</span>}
                </button>

                <button
                  onClick={handleCorrect}
                  style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                  title="Corregir Actas"
                >
                  <FaEdit style={styles.icon} />
                  {menuAbierto && <span style={styles.buttonText}>Corregir Actas</span>}
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
              overflow: "auto",
              height: "calc(100vh - 70px)",
              position: "relative",
            }}
          >
            {/* Formulario de búsqueda */}
            <div style={styles.searchSection}>
              <div style={styles.searchLeft}>
                <label style={styles.searchLabel}>Digite los Nombres o Apellidos:</label>
                <div style={styles.searchInputContainer}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={styles.searchInput}
                    placeholder="Buscar por nombres o apellidos..."
                    autoComplete="off"
                  />
                  <button type="button" style={styles.searchButton} title="Buscar">
                    Buscar
                  </button>
                </div>
              </div>
              <div style={styles.printControls}>
                <button
                  type="button"
                  onClick={generarFormatoCorto}
                  style={{
                    ...styles.printButton,
                    opacity: selectedRow ? 1 : 0.5,
                    cursor: selectedRow ? "pointer" : "not-allowed",
                  }}
                  disabled={!selectedRow}
                  title="Imprimir Formato Corto"
                >
                  <FaPrint style={styles.iconPrint} />
                  <span style={styles.buttonText}>Formato Corto</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintLargo}
                  style={{
                    ...styles.printButton,
                    opacity: selectedRow ? 1 : 0.5,
                    cursor: selectedRow ? "pointer" : "not-allowed",
                  }}
                  disabled={!selectedRow}
                  title="Imprimir Formato Largo"
                >
                  <FaPrint style={styles.iconPrint} />
                  <span style={styles.buttonText}>Formato Largo</span>
                </button>
              </div>
            </div>

            {/* DataTable de PrimeReact */}
            <div style={styles.tableContainer}>
              {searchTerm.trim() !== "" && (
                <>
                  {isLoading ? (
                    <div className="flex justify-content-center">
                      <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
                      <span style={{ marginLeft: "0.5rem" }}>Buscando...</span>
                    </div>
                  ) : (
                    <div className="card">
                      <DataTable
                        value={registrosFiltrados}
                        showGridlines
                        sortMode="multiple"
                        scrollable
                        scrollHeight="700px"
                        filters={filters}
                        onFilter={(e) => setFilters(e.filters)}
                        selection={selectedRow}
                        onSelectionChange={(e) => setSelectedRow(e.value)}
                        selectionMode="single"
                        dataKey="id"
                        stateStorage="session"
                        stateKey="dt-state-buscar-partidas"
                        emptyMessage="No se encontraron registros que coincidan con la búsqueda."
                        tableStyle={{ minWidth: "50rem" }}
                        headerStyle={styles.columnaTabla}
                        bodyStyle={styles.filaTabla}
                        rowExpansionTemplate={expandedRowTemplate}
                        expandedRows={selectedRow ? [selectedRow] : []}
                        onRowToggle={(e) => setSelectedRow(e.data.length > 0 ? e.data[0] : null)}
                      >
                        <Column expander style={{ width: "3em" }} />
                        <Column
                          field="id"
                          header="ID"
                          headerStyle={styles.columnaTabla}
                          bodyStyle={styles.filaTabla}
                          sortable
                          style={{ width: "5%" }}>
                          </Column>
                        <Column
                          field="primerNombre"
                          header="Primer Nombre"
                          headerStyle={styles.columnaTabla}
                          bodyStyle={styles.filaTabla}
                          sortable
                          style={{ width: "15%" }}>
                          </Column>
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
                          style={{ width: "7%" }}>
                          </Column>
                        <Column 
                          field="folio"
                          header="Folio"
                          headerStyle={styles.columnaTabla}
                          bodyStyle={styles.filaTabla}
                          sortable
                          style={{ width: "7%" }}>
                          </Column>
                        <Column 
                          field="acta"
                          header="Acta"
                          headerStyle={styles.columnaTabla}
                          bodyStyle={styles.filaTabla}
                          sortable
                          style={{ width: "7%" }}>
                          </Column>
                        <Column
                          field="ceremonia"
                          header="Ceremonia"
                          headerStyle={styles.columnaTabla}
                          bodyStyle={styles.filaTabla}
                          body={eventoBodyTemplate}
                          sortable
                          style={{ width: "20%" }}
                        ></Column>
                      </DataTable>
                    </div>
                  )}
                </>
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
  iconPrint: {
    width: "18px",
    height: "18px",
    fill: "black",
    marginRight: "0.5rem"
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
    color: "#000000",
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
  printControls: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  printButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCCE74",
    color: "black",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    height: "40px",
    whiteSpace: "nowrap",
    marginLeft: "auto",
    marginBottom: "0.5rem",
    transition: "all 0.3s",
    opacity: props => props.disabled ? 0.5 : 1,
    cursor: props => props.disabled ? "not-allowed" : "pointer",
    '&:hover': {
      backgroundColor: "#2a4274"
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  },
  content: {
    flex: 1,
    padding: "1.5rem",
    overflow: "auto",
    transition: 'margin-left 0.3s',
    height: "calc(100vh - 70px)",
  },
  filtroContainer: {
    alignItems: "center",
    marginBottom: "20px",
    marginLeft: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    gap: '0rem',
  },
  label: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginLeft: '0.5rem',
    color: '#6c757d',
  },
  searchSection: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
    display: "flex",
    gap: "38rem",
    marginBottom: "0.5rem",
    whiteSpace: "nowrap",
    margin: 0,
    width: "100%",
  },
  searchLabel: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginLeft: '0.5rem',
    color: '#000000',
    whiteSpace: "nowrap",
    margin: 0,
  },
  searchForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "600px",
  },
  searchInputContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    flex: 1,
    minWidth: "400px",
    maxWidth: "800px",
  },
  searchInput: {
    flex: "1",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #ced4da",
    fontSize: "1rem",
    width: "100%",
    paddingRight: "40px",
  },
  searchButton: {
    position: "absolute",
    right: "0",
    top: "0",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    padding: "0.5rem",
    cursor: "pointer",
    color: "#000000",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "0.5rem",
  },
  searchLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flex: 1,
    maxWidth: "70%",
  },

  noResultsContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    width: "100%",
  },
  noResultsText: {
    fontSize: "1.2rem",
    color: "#000000",
    fontStyle: "italic",
    whiteSpace: "nowrap",
  },
  searchIcon: {
    width: "18px",
    height: "18px",
    color: "#000000",
  },
  tableContainer: {
    backgroundColor: "whitesmoke",
    borderRadius: "0.5rem",
    boxShadow: "none",
    overflow: "auto",
    marginBottom: "20px",
    marginLeft: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    overflowX: "auto",
    maxHeight: "calc(100vh - 200px)",
  },

  columnaTabla: {
    backgroundColor: '#FCCE74',
    border: '1px solid #000000',
    fontWeight: '600',
    fontSize: '1rem',
    color: 'black',
    textAlign: 'center',
    padding: '1rem',
  },

  filaTabla: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #000000',
    fontWeight: '600',
    fontSize: '1rem',
    color: 'black',
    textAlign: 'center',
    padding: '0rem',
  },
  
}

export default BuscarPartidas

