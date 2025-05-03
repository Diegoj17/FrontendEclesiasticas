import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaFileAlt, FaSearch, FaFileMedical, FaEdit, FaChevronRight, FaArrowLeft, FaBars } from "react-icons/fa"

function Sidebar({menuAbierto, setMenuAbierto, currentPage, onViewActas, onSearch, onAdd, onCorrect, onBack }) {
  const navigate = useNavigate()
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
    if (!menuAbierto) {
      setIsSubmenuOpen(true)
    }
  }

  return (
    <nav
      style={{
        ...styles.sidebar,
        padding: menuAbierto ? "1rem 1rem" : "1rem 0rem",
        width: menuAbierto ? "15.6rem" : "3rem",
        transition: "all 0.3s ease-in-out",
        gap: menuAbierto ? "0rem" : "0rem",
        overflow: menuAbierto ? "hidden" : "auto",
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
          <button
            onClick={onViewActas}
            style={{
              ...styles.sidebarIconButton,
              justifyContent: menuAbierto ? "flex-start" : "center",
              backgroundColor: currentPage === "vistaActas" ? "#e0e0e0" : "#FCCE74",
            }}
            title="Vista de Actas"
          >
            <FaFileAlt style={styles.icon} />
            {menuAbierto && <span style={styles.buttonText}>Vista de Actas</span>}
          </button>

          <button
            onClick={onSearch}
            style={{
              ...styles.sidebarIconButton,
              justifyContent: menuAbierto ? "flex-start" : "center",
              backgroundColor: currentPage === "buscarPartidas" ? "#e0e0e0" : "#FCCE74",
            }}
            title="Buscar Actas"
          >
            <FaSearch style={styles.icon} />
            {menuAbierto && <span style={styles.buttonText}>Buscar Actas</span>}
          </button>

          <button
            onClick={onAdd}
            style={{
              ...styles.sidebarIconButton,
              justifyContent: menuAbierto ? "flex-start" : "center",
              backgroundColor: currentPage === "añadirPartidas" ? "#e0e0e0" : "#FCCE74",
            }}
            title="Añadir Actas"
          >
            <FaFileMedical style={styles.icon} />
            {menuAbierto && <span style={styles.buttonText}>Añadir Actas</span>}
          </button>

          <button
            onClick={onCorrect}
            style={{
              ...styles.sidebarIconButton,
              justifyContent: menuAbierto ? "flex-start" : "center",
            }}
            title="Corregir Actas"
          >
            <FaEdit style={styles.icon} />
            {menuAbierto && <span style={styles.buttonText}>Corregir Actas</span>}
          </button>
        </div>

        {/* Botón "Atrás" al final del menú */}
        <button onClick={onBack} style={styles.backButton} title="Atrás">
          <FaArrowLeft style={styles.iconBack} />
          {menuAbierto && <span style={styles.buttonText}>Atrás</span>}
        </button>
      </div>
    </nav>
  )
}

const styles = {
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
    minHeight: "70vh",
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
    color: "black",
  },
  sidebarIconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    border: "none",
    borderRadius: "0 16px 16px 0",
    backgroundColor: "#FCCE74",
    cursor: "pointer",
    textAlign: "left",
    color: "black",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    width: "100%",
    minHeight: "1rem",
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
  buttonText: {
    fontSize: "1rem",
    flex: 1,
  },
}

export default Sidebar
