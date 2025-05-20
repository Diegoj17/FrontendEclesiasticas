import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import ActaService from "../services/ActaService"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import DataTableExpandle from "../components/layout/DataTableExpandle"
import DetallesActas from "../components/layout/DetallesActas"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaPrint, FaSearch, FaTimes, FaEdit } from "react-icons/fa"

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

  // Datos filtrados para la tabla
  const [registrosFiltrados, setRegistrosFiltrados] = useState([])

  useEffect(() => {
    if (selectedRow) {
      setExpandedRow(selectedRow);
    }
  }, [selectedRow]);
  
  // Búsqueda en tiempo real con el término simple
  useEffect(() => {
    if (searchTerm.trim() === "" || showAdvancedSearch) {
      setRegistrosFiltrados([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const timeoutId = setTimeout(async () => {
      try {
        // Usar el servicio para buscar actas por nombre
        const resultados = await ActaService.searchByName(searchTerm)

        // Transformar los resultados al formato esperado por la tabla
        const actasFormateadas = ActaService.transformActasForTable(resultados)

        setRegistrosFiltrados(actasFormateadas)
        setRegistros(actasFormateadas)
        setIsLoading(false)
      } catch (error) {
        console.error("Error al buscar actas:", error)
        setError("Error al buscar actas. Por favor, intente de nuevo.")
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, showAdvancedSearch])
  



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

  const handleEditActa = () => {
    if (selectedActas.length === 1) {
      const actaAEditar = selectedActas[0];
      navigate('/añadirActas', { state: { acta: actaAEditar } });
    }
  };

  const expandedRowTemplate = (rowData) => {
      return (
        <div style={styles.expandedRowContainer}>
          <DetallesActas acta={rowData} />
        </div>
      )
  }

  const handleRowSelect = (rowData) => {
    console.log("Fila seleccionada:", rowData)
    setSelectedRow(rowData)

    // Imprimir todos los campos del acta para depuración
    console.log("Acta seleccionada (todos los campos):", rowData)
  }



  const generarPDFCorto = () => {
    if (!selectedRow) return;
    const r = registros.find(r => r.id === selectedRow.id);
    if (!r) return;
  
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    // Header
    doc.setFontSize(18);
    doc.setTextColor("#385792");
    doc.text("CERTIFICADO DE BAUTISMO", 210, 40, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Parroquia San Luis Gonzaga — Diócesis de ${r.diocesis}`, 210, 60, { align: "center" });
  
    // Tabla breve
    autoTable(doc, {
      startY: 90,
      theme: "grid",
      head: [["Campo", "Valor"]],
      body: [
        ["Nombre completo", `${r.primerNombre} ${r.segundoNombre} ${r.primerApellido} ${r.segundoApellido}`],
        ["Fecha de bautizo", r.fecha],
        ["Libro/Acta/Folio", `${r.libro} / ${r.acta} / ${r.folio}`],
        ["Padrinos", r.padrinos?.join(", ") || "N/A"],
        ["Celebrante", r.oficiante || r.sacerdote],
      ],
      headStyles: { fillColor: "#385792", textColor: "#fff" },
      styles: { fontSize: 11 },
      columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 350 } },
    });
  
    // Pie y descarga
    const fechaEmision = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Emitido: ${fechaEmision}`, 40, doc.lastAutoTable.finalY + 30);
    doc.save(`certificado_bautismo_${r.primerNombre}.pdf`);
  };
  

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
                  disabled={selectedActas.length !== 1}
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
                        setSelectedRow={handleRowSelect}
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

