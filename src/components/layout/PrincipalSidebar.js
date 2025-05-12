import { FaFileAlt, FaSearch, FaFileMedical, FaEdit, FaChevronRight, FaArrowLeft, FaBars, FaSignOutAlt } from "react-icons/fa"

function PrincipalSidebar({ currentPage, menuAbierto, setMenuAbierto, onViewActas, onSearch, onAdd, onCorrect, onLogout }) {
    return (
        <nav style={styles.sidebar}>
          {/* Botones principales */}
          <div style={styles.menuItems}>
            <button
              onClick={onViewActas}
              style={styles.sidebarButton}
            >
              <FaFileAlt style={styles.buttonIcon} />
              <span style={styles.buttonText}>Vista de Actas</span>
            </button>
    
            <button 
              onClick={onSearch} 
              style={styles.sidebarButton} 
              title="Buscar Actas"
            >
              <FaSearch style={styles.buttonIcon} />
              <span style={styles.buttonText}>Buscar Actas</span>
            </button>
    
            <button 
              onClick={onAdd} 
              style={styles.sidebarButton} 
              title="Añadir Actas"
            >
              <FaFileMedical style={styles.buttonIcon} />
              <span style={styles.buttonText}>Crear Actas</span>
            </button>
    
          </div>
    
          {/* Botón de cierre de sesión */}
          <button 
            onClick={onLogout} 
            style={styles.logoutButton}
          >
            <FaSignOutAlt style={styles.buttonIcon} />
            <span style={styles.buttonText}>Cerrar Sesión</span>
          </button>
        </nav>
      )
    }
    
    // Función para estilos dinámicos de botones

    
    const styles = {
      sidebar: {
    width: "15.6rem",
    backgroundColor: "#f0f0f0",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    with: "100%",
    height: "100%",
    overflow: "hidden",
    overflowX: "auto",
    textOverflow: "ellipsis",
    boxShadow: "3px 0 8px rgba(0,0,0,0.15)",
    zIndex: 999,
      },
      menuItems: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "5rem 0",
        overflow: "hidden",
      },
      sidebarButton: {
        display: "flex",
        gap: "0rem",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        padding: "0.75rem",
        border: "none",
        borderRadius: "1rem",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "1rem",
        color: "black",
        backgroundColor: "#FCCE74",
        overflow: "hidden",
        position: "relative",
        whiteSpace: "nowrap",
        width: "100%",
        minHeight: "1rem",
      },
      logoutButton: {
        display: "flex", 
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: "0rem",
    padding: "0.75rem 0.9rem",
    border: "none",
    borderRadius: "1rem",
    cursor: "pointer",
    textAlign: "left",
    color: "white",
    backgroundColor: "#FF000F",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    width: "100%", 
    minHeight: "1rem",
    marginTop: "auto" 
      },
      buttonIcon: {
        width: "2rem", 
    height: "1.2rem",
    marginRight: "0rem",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
      },
      buttonText: {
        fontSize: "1rem",
        fontWeight: "500",
        whiteSpace: "nowrap",  
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }
    }
    

export default PrincipalSidebar