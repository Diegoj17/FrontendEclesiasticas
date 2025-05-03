import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import DataTable from "../components/layout/DataTable"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import { FaEdit } from "react-icons/fa"


function CorregirActas() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRow, setSelectedRow] = useState(null)

    const [registrosFiltrados, setRegistrosFiltrados] = useState([])
    const [registros, setRegistros] = useState([]) 
    
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

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto)
        if (!menuAbierto) {
          setIsSubmenuOpen(false)
        }
      }
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
    
      const handleList = () => {
        navigate('/listaActas')
      }
    
      const handleCorrect = () => {
        navigate('/corregirActas')
      }

      const handleEditProfile = () => {
        console.log("Navegando a editar perfil")
        setIsDropdownOpen(false)
        navigate("/editarPerfil")
      }

      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
      }

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

        const getEventoColor = (ceremonia) => {
            switch (ceremonia) {
              case 'Bautizo': return '#AED581';
              case 'Matrimonio': return '#64B5F6';
              default: return '#E0E0E0';
            }
          };

          const handleEdit = () => {
            if (!selectedRow) return;
            navigate(`/editar-acta/${selectedRow.id}`, { state: { acta: selectedRow } });
          };

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
          const renderDetallesActa = (acta) => {
            if (acta.tipo === "Bautismo") {
              return (
                <div style={styles.detailsGrid}>
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos del Bautizado</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Fecha de bautizo:</span>
                       <span style={styles.detailsValue}>
                         {acta.bautismo.fechaNacimiento?.dia}/{acta.bautismo.fechaNacimiento?.mes}/
                         {acta.bautismo.fechaNacimiento?.año}
                       </span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Lugar de bautizo:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.lugarNacimiento || "No disponible"}</span>
                     </div>
                   </div>
                  <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos del Padre</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Padre:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.nombrePadre || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Abuelo Paterno:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.abueloPaterno || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Abuela Paterna:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.abuelaPaterna || "No disponible"}</span>
                     </div>
                   </div>
         
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos de la Madre</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Madre:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.nombreMadre || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Abuelo Materno:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.abueloMaterno || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Abuela Materna:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.abuelaMaterna || "No disponible"}</span>
                     </div>
                   </div>
         
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Padrinos</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Padrino:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.padrino || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Madrina:</span>
                       <span style={styles.detailsValue}>{acta.bautismo.madrina || "No disponible"}</span>
                     </div>
                   </div>
         
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Sacerdote:</span>
                       <span style={styles.detailsValue}>{acta.oficiante || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Doy Fe:</span>
                       <span style={styles.detailsValue}>{acta.doyFe || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Fecha de la Ceremonia:</span>
                       <span style={styles.detailsValue}>
                         {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
                       </span>
                     </div>
                </div>
                <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Nota Marginal</h4>
                      <div style={styles.detailsRow}>
                        <span style={styles.detailsValue}>{acta.notaMarginal || "No disponible"}</span>
                        </div>
                        </div>
              </div>
              );
            } else if (acta.tipo === "Confirmación") {
              return (
                <div style={styles.detailsGrid}>
        
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos de Acta de Bautizo</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Libro:</span>
                       <span style={styles.detailsValue}>{acta.libro || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Folio:</span>
                       <span style={styles.detailsValue}>{acta.folio || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Acta:</span>
                       <span style={styles.detailsValue}>{acta.acta || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Fecha de bautizo:</span>
                       <span style={styles.detailsValue}>
                         {acta.confirmacion.fechaNacimiento?.dia}/{acta.confirmacion.fechaNacimiento?.mes}/
                         {acta.confirmacion.fechaNacimiento?.año}
                       </span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Lugar de bautizo:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.lugarNacimiento || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Diocesis de bautizo:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.diocesis || "No disponible"}</span>
                     </div>
                   </div>
         
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos de la Familia</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Padre:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.nombrePadre || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Madre:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.nombreMadre || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Padrino:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.padrino || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Madrina:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.madrina || "No disponible"}</span>
                     </div>
                   </div>
         
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Monseñor:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.monseñor || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Párroco o Vicario:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.sacerdote || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Doy Fe:</span>
                       <span style={styles.detailsValue}>{acta.confirmacion.doyFe || acta.doyFe || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Fecha de la Ceremonia:</span>
                       <span style={styles.detailsValue}>
                         {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
                       </span>
                     </div>
                     </div>
                     <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Nota Marginal</h4>
                      <div style={styles.detailsRow}>
                        <span style={styles.detailsValue}>{acta.notaMarginal || "No disponible"}</span>
                        </div>
                        </div>
                 </div>
              );
            } else if (acta.tipo === "Matrimonio") {
              return (
                <div style={styles.detailsGrid}>
                  <div style={styles.detailsSection}>
                    <h4 style={styles.sectionTitle}>Datos del Esposo</h4>
                    <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Libro:</span>
                       <span style={styles.detailsValue}>{acta.libro || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Folio:</span>
                       <span style={styles.detailsValue}>{acta.folio || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Acta:</span>
                       <span style={styles.detailsValue}>{acta.acta || "No disponible"}</span>
                     </div>
                    <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Fecha de nacimiento:</span>
                       <span style={styles.detailsValue}>
                         {acta.matrimonio.novio.fechaNacimiento?.dia}/{acta.matrimonio.novio.fechaNacimiento?.mes}/
                         {acta.matrimonio.novio.fechaNacimiento?.año}
                       </span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.novio.lugarNacimiento || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Padre:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.novio.nombrePadre || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Madre:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.novio.nombreMadre || "No disponible"}</span>
                     </div>
                   </div>
         
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos de la Esposa</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Nombre completo:</span>
                       <span style={styles.detailsValue}>
                         {acta.matrimonio.novia.primerNombre} {acta.matrimonio.novia.segundoNombre}{" "}
                         {acta.matrimonio.novia.primerApellido} {acta.matrimonio.novia.segundoApellido}
                       </span>
                     </div>  
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Libro:</span>
                       <span style={styles.detailsValue}>{acta.libro || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Folio:</span>
                       <span style={styles.detailsValue}>{acta.folio || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Acta:</span>
                       <span style={styles.detailsValue}>{acta.acta || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Fecha de nacimiento:</span>
                       <span style={styles.detailsValue}>
                         {acta.matrimonio.novia.fechaNacimiento?.dia}/{acta.matrimonio.novia.fechaNacimiento?.mes}/
                         {acta.matrimonio.novia.fechaNacimiento?.año}
                       </span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.novia.lugarNacimiento || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Padre:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.novia.nombrePadre || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Madre:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.novia.nombreMadre || "No disponible"}</span>
                     </div>
                   </div>
         
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Testigos</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Primer testigo:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.testigo1 || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Segundo testigo:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.testigo2 || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Tercer testigo:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.testigo3 || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Cuarto testigo:</span>
                       <span style={styles.detailsValue}>{acta.matrimonio.testigo4 || "No disponible"}</span>
                     </div>
                   </div>
         
                   <div style={styles.detailsSection}>
                     <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Sacerdote:</span>
                       <span style={styles.detailsValue}>{acta.oficiante || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Doy Fe:</span>
                       <span style={styles.detailsValue}>{acta.doyFe || "No disponible"}</span>
                     </div>
                     <div style={styles.detailsRow}>
                       <span style={styles.detailsLabel}>Fecha de la Ceremonia:</span>
                       <span style={styles.detailsValue}>
                         {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
                       </span>
                     </div>
                  </div>
                  <div style={styles.detailsSection}>
                    <h4 style={styles.sectionTitle}>Nota Marginal</h4>
                      <div style={styles.detailsRow}>
                        <span style={styles.detailsValue}>{acta.notaMarginal || "No disponible"}</span>
                      </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div style={styles.detailsGrid}>
                  <div style={styles.detailsSection}>
                    <h4 style={styles.sectionTitle}>Información no disponible</h4>
                    <p>No hay información detallada disponible para este tipo de acta.</p>
                  </div>
                </div>
              );
            }
          };
    return (
          <div style={styles.container}>
             {/* Barra superior */}
                  <Header title="Corrección de Actas" />
            
                  <div style={styles.mainContent}>
                    {/* Menú lateral */}
                    <Sidebar 
                    currentPage="VistaActas"
                    isOpen={menuAbierto}
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
            onClick={handleEdit}
            style={{
              ...styles.printButton,
              opacity: selectedRow ? 1 : 0.5,
              cursor: selectedRow ? "pointer" : "not-allowed",
            }}
            disabled={!selectedRow}
            title="Editar Acta"
          >
            <FaEdit style={styles.iconPrint} />
            <span style={styles.buttonText}>Editar Acta</span>
          </button>
        </div>
                  </div>

                  
        {/* DataTable */}
        <div style={styles.tableContainer}>
          {searchTerm.trim() !== "" && (
            <>
              {isLoading ? (
                <div className="flex justify-content-center">
                  <i className="pi pi-spin pi-spinner" style={{ fontSize: "1.5rem" }}></i>
                  <span style={styles.loadingText}>Buscando...</span>
                </div>
              ) : (
                <DataTable
                registrosFiltrados={registrosFiltrados}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                getEventoColor={getEventoColor}
                selectedRow={selectedRow}
                onSelectionChange={setSelectedRow}
                expandedRowTemplate={renderDetallesActa}
              />
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
      flexWrap: 'wrap',
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
      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
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
      flex: "1 1 400px",
      maxWidth: "800px",
      minWidth: "300px",
    },
    printControls: {
      display: "flex",
      flex: "0 1 auto",
      alignItems: "center",
      gap: "1rem",
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

    iconPrint: {
      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
      color: "#000000",
    },
    buttonText: {
      fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
      color: "#000000",
    },
    tableContainer: {
      width: "100%",
      flex: "1",
      overflow: "auto",
    },
    
}
export default CorregirActas
