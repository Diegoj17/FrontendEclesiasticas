import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import ActaService from "../services/ActaService"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import DataTableExpandle from "../components/layout/DataTableExpandle"
import DetallesActas from "../components/layout/DetallesActas"
import { FaPrint, FaSearch, FaTimes, FaEdit } from "react-icons/fa"
import axios from "axios"

function BuscarPartidas() {
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedActas, setSelectedActas] = useState([]);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [registros, setRegistros] = useState([])
  const [error, setError] = useState(null)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  


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

  // Estado para los parámetros de búsqueda avanzada
  const [advancedSearchParams, setAdvancedSearchParams] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: ""
  });

  // Datos filtrados para la tabla
  const [registrosFiltrados, setRegistrosFiltrados] = useState([])

  useEffect(() => {
    if (selectedRow) {
      setExpandedRow(selectedRow);
    }
  }, [selectedRow]);
  
  // Búsqueda en tiempo real con el término simple
  useEffect(() => {
  if ((searchTerm.trim() === "" && !showAdvancedSearch) || 
      (showAdvancedSearch && !advancedSearchParams.nombre1 && !advancedSearchParams.apellido1)) {
    setRegistrosFiltrados([]);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);

  const timeoutId = setTimeout(async () => {
    try {
      let resultados;
      
      if (showAdvancedSearch) {
        // Búsqueda avanzada
        resultados = await ActaService.searchByFullName({
          nombre1: advancedSearchParams.primerNombre,
          nombre2: advancedSearchParams.segundoNombre,
          apellido1: advancedSearchParams.primerApellido,
          apellido2: advancedSearchParams.segundoApellido
        });
      } else {
        // Búsqueda simple
        resultados = await ActaService.searchByName(searchTerm);
      }

      const actasUnicas = [...new Map(resultados.map(item => [item.id, item])).values()];
      const actasFormateadas = ActaService.transformActasForTable(actasUnicas);

      setRegistrosFiltrados(actasFormateadas);
      setRegistros(actasFormateadas);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al buscar actas:", error);
      setError("Error al buscar actas. Por favor, intente de nuevo.");
      setIsLoading(false);
    }
  }, 300);

  return () => clearTimeout(timeoutId);
}, [searchTerm, showAdvancedSearch, advancedSearchParams]);



  // Manejar búsqueda avanzada
  

  

  

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  /*
  const handleEditActa = () => {
    if (selectedActas.length === 1) {
      const actaAEditar = selectedActas[0];
      navigate('/añadirActas', { state: { acta: actaAEditar } });
    }
  };
  */

  // Modificar la función handleEditActa
const handleEditActa = () => {
  if (selectedRow) {
    console.log("Navegando a:", `/editar-acta/${selectedRow.id}/${selectedRow.ceremonia.toLowerCase()}`);
    navigate(`/editar-acta/${selectedRow.id}/${selectedRow.ceremonia.toLowerCase()}`);
  }
};

  const expandedRowTemplate = (rowData) => {
      return (
        <div style={styles.expandedRowContainer}>
          <DetallesActas acta={rowData} />
        </div>
      )
  }

  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const partes = new Date(fecha).toLocaleDateString('es-ES', options).split(' ');
    return `${partes[0]} de ${partes[2].toUpperCase()} de ${partes[4]}`;
  };

  const handleRowSelect = (rowData) => {
  console.log("Fila seleccionada:", rowData);
  setSelectedRow(rowData);
  
  // Si necesitas transformar los datos como en VistaActas
  const actaFormateada = ActaService.transformActasForTable(rowData);
  setSelectedRow(actaFormateada);
  };

  const handlePrint = async (tipoPdf) => {
  if (!selectedRow) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    const tipoDocumento = selectedRow.ceremonia.toLowerCase();
    let requestBody = {
      tipoPdf: tipoPdf,
      tipoDocumento: tipoDocumento,
      parametros: {}
    };

    // Obtener fecha actual formateada
    const fechaActual = new Date();
    const mesAnio = fechaActual.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    }).toUpperCase();
    
    const fechaActualFormateada = formatFecha(fechaActual);

    // Construir parámetros según el tipo de documento
    switch (tipoDocumento) {
      case "bautismo":
        requestBody.parametros = {
          libro: selectedRow.libro || "",
          folio: selectedRow.folio || "",
          acta: selectedRow.acta || "",
          num_dias: "15",
          mes_anio: mesAnio,
          monsenior: selectedRow.monsenor || selectedRow.oficiante || "",
          nombre_bautizado: `${selectedRow.primerNombre} ${selectedRow.segundoNombre} ${selectedRow.primerApellido} ${selectedRow.segundoApellido}`,
          nombre_padre: selectedRow.nombresPadre || "",
          nombre_madre: selectedRow.nombresMadre || "",
          nombre_padrinos: selectedRow.nombrepadrinos || selectedRow.padrino || "N/A",
          nombre_doyfe: selectedRow.doyFe || "",
          nota_marginal: selectedRow.notaMarginal || "Ninguna",
          fecha_nacimiento: selectedRow.fechaNacimiento 
            ? formatFecha(selectedRow.fechaNacimiento) 
            : "",
          fecha_actual: fechaActualFormateada
        };
        break;

      case "matrimonio":
        requestBody.parametros = {
          libro: selectedRow.libro || "",
          folio: selectedRow.folio || "",
          acta: selectedRow.acta || "",
          fecha: selectedRow.fecha || selectedRow.fechaCeremonia || "",

          nombres_esposo: `${selectedRow.primerNombre} ${selectedRow.segundoNombre} ${selectedRow.primerApellido} ${selectedRow.segundoApellido}`,
          nombres_padreesposo: selectedRow.nombresPadre || "",
          nombres_madresesposo: selectedRow.nombresMadre || "",
          fecha_nacimiento_esposo: selectedRow.fechaNacimiento || "",
          libro_bautizo_esposo: selectedRow.libroBautizo || "",
          folio_bautizo_esposo: selectedRow.folioBautizo || "",
          acta_bautizo_esposo: selectedRow.actaBautizo || "",
          lugar_nacimiento_esposo: selectedRow.lugarNacimiento || "",

          nombres_esposa: selectedRow.nombresEsposa || "",
          nombres_padreesposa: selectedRow.nombresPadreEsposa || "",
          nombres_madresesposa: selectedRow.nombresMadreEsposa || "",
          fecha_nacimiento_esposa: selectedRow.fechaNacimientoEsposa || "",
          libro_bautizo_esposa: selectedRow.libroBautizoEsposa || "",
          folio_bautizo_esposa: selectedRow.folioBautizoEsposa || "",
          acta_bautizo_esposa: selectedRow.actaBautizoEsposa || "",
          lugar_nacimiento_esposa: selectedRow.lugarNacimientoEsposa || "",

          primer_testigo: selectedRow.testigo1 || "",
          segundo_testigo: selectedRow.testigo2 || "",
          tercer_testigo: selectedRow.testigo3 || "",
          cuarto_testigo: selectedRow.testigo4 || "",

          monsr: selectedRow.monsenor || "",
          sacerdote: selectedRow.oficiante || "",
          doyfe: selectedRow.doyFe || "",
          notamarginal: selectedRow.notaMarginal || "Sin observaciones"
        };
        break;

      case "confirmacion":
        if (tipoPdf === "largo") {
          requestBody.parametros = {
            libro: selectedRow.libro || "",
            folio: selectedRow.folio || "",
            acta: selectedRow.acta || "",
            nombre_confirmante: `${selectedRow.primerNombre} ${selectedRow.segundoNombre} ${selectedRow.primerApellido} ${selectedRow.segundoApellido}`,
            num_dias: "15",
            mes_anio: mesAnio.split(' ')[0], // Solo el mes (ej: "MAYO")
            monsenior: selectedRow.monsenor || "",
            fecha_nacimiento: selectedRow.fechaNacimiento 
              ? formatFecha(selectedRow.fechaNacimiento) 
              : "",
            nombre_padre: selectedRow.nombresPadre || "",
            nombre_madre: selectedRow.nombresMadre || "",
            nombre_padrinos: selectedRow.nombrepadrinos || "",
            nombre_doyfe: selectedRow.doyFe || "",
            nota_marginal: selectedRow.notaMarginal || "",
            fecha_actual: fechaActualFormateada
          };
        } else {
          requestBody.parametros = {
            nombre: `${selectedRow.primerNombre} ${selectedRow.segundoNombre} ${selectedRow.primerApellido} ${selectedRow.segundoApellido}`,
            libro: selectedRow.libro || "",
            folio: selectedRow.folio || "",
            acta: selectedRow.acta || "",
            fecha: selectedRow.fecha || "",
            lugar_bautizo: selectedRow.lugarBautizo || "",
            fecha_bautizo: selectedRow.fechaBautizo || "",
            diocesis_bautizo: selectedRow.diocesis || "",
            libro_bautizo: selectedRow.libroBautizo || "",
            folio_bautizo: selectedRow.folioBautizo || "",
            acta_bautizo: selectedRow.actaBautizo || "",
            nombre_padre: selectedRow.nombresPadre || "",
            nombre_madre: selectedRow.nombresMadre || "",
            nombre_padrino: selectedRow.padrino || "",
            nombre_madrina: selectedRow.madrina || "",
            monsr: selectedRow.monsenor || "",
            sacerdote: selectedRow.oficiante || "",
            doyfe: selectedRow.doyFe || "",
            notamarginal: selectedRow.notaMarginal || ""
          };
        }
        break;

      default:
        throw new Error(`Tipo de ceremonia no válido: ${tipoDocumento}`);
    }

    console.log("Enviando a PDF:", JSON.stringify(requestBody, null, 2));

    // Enviar solicitud POST con el JSON
    const response = await axios.get(
      "https://actaseclesiasticas.koyeb.app/api/actas/pdf",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      }
    );

    // Descargar PDF
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `acta_${selectedRow.ceremonia}_${selectedRow.acta}.pdf`;
    link.click();
    URL.revokeObjectURL(pdfUrl);

  } catch (error) {
    console.error("Error al generar PDF:", error);
    
    let errorMessage = error.message;
    if (error.response) {
      // Si el backend devuelve un mensaje de error específico
      errorMessage = error.response.data.error || error.response.statusText;
    }
    
    alert(`Error al generar el PDF: ${errorMessage}`);
  }
};
  

  
  


return (
      <div style={styles.container}>
         {/* Barra superior */}
              <Header title="Búsqueda de Actas" />
        
              <div style={styles.mainContent}>
                {/* Menú lateral */}
                <Sidebar 
                menuAbierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
                currentPage="Busqueda de Actas"
                onToggle={() => setMenuAbierto(!menuAbierto)}
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
              padding: menuAbierto ? "1rem 0rem" : "1rem 1.5rem",
              transition: "margin-left 0.3s ease-in-out",
              overflow: "auto",
              height: "calc(100vh - 70px)",
            }}
          >
            {/* Formulario de búsqueda */}
            <div style={styles.searchSection}>
              <div style={styles.searchLeft}>
                <div style={styles.searchInputContainer}>
                <FaSearch style={styles.searchIcon} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={styles.searchInput}
                    placeholder="Buscar por nombres o apellidos..."
                    autoComplete="off"
                  />
                  {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")} 
                    style={styles.clearButton}
                    type="button"
                  >
                  <FaTimes style={styles.clearIcon}/>
                  </button>
                  )}
                </div>
              </div>
              <div style={styles.printControls}>
                <button
                  onClick={handleEditActa}
                  disabled={!selectedRow}
                  type="button"
                  style={{
                    ...styles.printButton,
                      opacity: selectedRow  ? 1 : 0.5,
                      cursor: selectedRow  ? "pointer" : "not-allowed",
                  }}
                  
                >
                  <FaEdit style={styles.buttonIcon} />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrint('corto')}
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
                  onClick={() => handlePrint('largo')}
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

                    <div style={styles.loadingContainer}>
                      <i className="pi pi-spin pi-spinner" style={{ fontSize: "1.5rem" }}></i>
                      <span style={styles.loadingText}>Buscando Actas...</span>
                    </div>

                  ) : (
                    <div className="card">
                      <DataTableExpandle
                        registrosFiltrados={registros}
                        filters={filters}
                        onFilter={(e) => setFilters(e.filters)}
                        expandedRowTemplate={expandedRowTemplate}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                      /> 
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
    height: "100%",
    overflow: "auto",
    cursor: 'default',
  },
  content: {
    flex: 1,
    padding: "1.5rem 1rem",
    overflow: "auto",
    transition: "margin-left 0.3s ease-in-out",
    backgroundColor: "#FFFFFF",
    minHeight: "calc(100vh - 70px)",
    cursor: 'default',
  },
  iconPrint: {
    width: "16px",
    height: "16px",
    fill: "black",
    marginRight: "0.3rem"
  },
  buttonText: {
    fontSize: "1rem",
    flex: 1,
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
    fill: "black",
    marginRight: "0.3rem"
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    gap: "1rem",
    marginTop: "1rem",
  },
  mainContent: {
    display: "flex",
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  
  printControls: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  printButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCCE74",
    color: "black",
    border: "none",
    borderRadius: "0.5rem",
    padding: "clamp(0.3rem, 1vw, 0.5rem) clamp(0.8rem, 2vw, 1rem)",
    fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
    textAlign: "center",
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
  
  label: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginLeft: '0.5rem',
    color: '#6c757d',
  },
  searchSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0rem 0.5rem",
    marginBottom: "0.5rem",
    whiteSpace: "nowrap",
    width: "100%",
    flexWrap: "wrap",
    gap: "0.5rem",
    
  },
  searchLabel: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#000000',
    whiteSpace: "nowrap",
  },
  searchForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",

  },
  searchInputContainer: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: "25rem",
    maxWidth: "600px",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    padding: "0rem 0.5rem",
    borderColor: '#000000',
    position: 'relative',
    '&:focus-within': {
      borderColor: '#000000',
      boxShadow: '0 0 0 1px #385792'
    }
  },
  searchInput: {
    flex: 1,
    outline: 'none',
    height: '100%',
    padding: "0.5rem 0.5rem",
    borderRadius: "0.5rem",
    border: "none",
    fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  searchIcon: {
    color: "#000000",
    marginRight: "0",
    fontSize: "16px",
    cursor: "default",
    
  },
  searchButton: {
    flexDirection: "center",
    alignItems: "center",
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
    flexDirection: "center",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
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
  tableContainer: {
    padding: "0rem 0.5rem",
    borderRadius: "0.5rem",
    boxShadow: "none",
    overflow: "auto",
    overflowX: "auto",
    width: "100%",
    flex: "1",
  },
  columnaTabla: {
    backgroundColor: '#FCCE74',
    border: '1px solid #000000',
    borderRadius: "0.5rem",
    fontWeight: '600',
    fontSize: '1rem',
    color: 'black',
    textAlign: 'center',
    padding: '0.5rem 1rem',
    minWidth: "50px",
    whiteSpace: "nowrap",
    cursor: "default",
  },

  filaTabla: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #000000',
    borderRadius: "0.5rem",
    fontWeight: '600',
    fontSize: '1rem',
    color: 'black',
    textAlign: 'center',
    padding: '0.5rem 1rem',
    minWidth: "50px",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },

  detailsCell: {
    padding: "0.5rem 0.5rem",
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    cursor: "default",
  },
  detailsContainer: {
    padding: "0rem 0.5rem",
    
  },
  detailsTitle: {
    padding: "0rem 0.5rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#385792",
  },
  detailsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    cursor: "default",
  },
  detailsSection: {
    flex: "1 1 calc(33.33% - 1rem)",
    minWidth: "250px",
    padding: "0rem 1rem",
    border: "1px solid #e0e0e0",
    borderRadius: "0.5rem",
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    color: "#385792",
  },
  detailsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  detailsLabel: {
    fontWeight: "500",
  },
  detailsValue: {
    textAlign: "right",
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
  loadingText: {
    fontSize: "1.2rem",
    color: "#000000",
    fontStyle: "italic",
    whiteSpace: "nowrap",
    textAlign: "center",
    justifyContent: "center",
  },
  clearButton: {
    background: 'none',
    border: 'none',
    padding: '0',
    marginLeft: '8px',
    cursor: 'pointer',
    color: '#9e9e9e',
    '&:hover': {
      color: '#000000',
    }
  },
  clearIcon: {
    color: "#000000",
    fontSize: "16px",
  }


  
}

export default BuscarPartidas

