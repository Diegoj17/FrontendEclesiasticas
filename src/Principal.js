import { useAuth } from "./AuthContext"
import { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import logo from "./logo.png"
import user from "./user.png"
import logocentral from "./logocentral.png"
import { FaFileAlt,
  FaSearch,
  FaFileMedical,
  FaEdit,
  FaChevronDown,
  FaSignOutAlt,
  FaKey,
  FaChevronUp,
  FaUserCircle, } from "react-icons/fa"

function Principal() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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


  // Función para navegar a la vista de registros
  const handleViewRegistros = () => {
    navigate("/registros")
  }

  // Funciones para los botones
  const handleSearch = () => {
    navigate("/buscarPartidas")
  }

  const handleAdd = () => {
    navigate("/añadirPartidas")
  }

  const handleCorrect = () => {
    console.log("Función para corregir")
    // Implementa la lógica para corregir aquí
  }

  const handlePrint = () => {
    console.log("Función para imprimir")
    // Implementa la lógica de impresión aquí
  }

  const handleLogout = () => {
    // Llamar a la función logout del contexto de autenticación
    logout()
    // Redirigir al login
    navigate("/")
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleEditProfile = () => {
    navigate("/editarPerfil");
    setIsDropdownOpen(false);
  };

  const handleChangePassword = () => {
    navigate("/cambiarContraseña");
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
    <div style={styles.container} onDoubleClick={handleDoubleClick}
    tabIndex={0} >
      {/* Barra superior */}
      <header style={styles.header}>
      <div
          ref={dropdownRef}
          style={styles.userContainer}
          onClick={toggleDropdown}
        >
        </div>
        <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
        <h1 style={styles.headerTitle}>Parroquia San Luis Gonzaga</h1>
        <div style={styles.userContainer} onClick={toggleDropdown} onDoubleClick={ handleContainerClick}>
            <div style={styles.userInfo}>
              <FaUserCircle size={24} style={styles.userIcon} />
              <div style={styles.userText}>
                <span style={styles.userName}>{user?.name || "Nombre Usuario"}</span>
                <span style={styles.userRole}>{user?.role || "Rol"}</span>
              </div>
              {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
    
            {/* Menú desplegable */}
            {isDropdownOpen && (
              <div style={styles.dropdownMenu}>
                <button style={styles.dropdownItem} onClick={handleEditProfile} onKeyDown={(e) => e.key === 'Enter' && handleEditProfile()}>
                  <FaEdit style={styles.dropdownIcon} />
                  <span style={styles.dropdownIconText}>Editar perfil</span>
                </button>
                <button style={styles.dropdownItem} onClick={handleChangePassword} onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}>
                  <FaKey style={styles.dropdownIcon} />
                  <span style={styles.dropdownIconText}>Cambiar contraseña</span>
                </button>
              </div>
            )}
          </div>
        </header>

      {/* Contenido principal */}
      <div style={styles.mainContent}>
        
        {/* Menú lateral */}
        <nav style={styles.sidebar}> 
          
          {/* Botones principales */}
          <div style={styles.sidebarButtons}>

          <button onClick={handleViewRegistros} style={{ ...styles.sidebarButton}} title="Vista de Registros de Partidas">
              <FaFileAlt style={styles.buttonIcon} />
              {<span style={styles.buttonText}>Vista de Registros</span>}
            </button>

            <button onClick={handleSearch} style={{ ...styles.sidebarButton}} title="Buscar partidas">
              <FaSearch style={styles.buttonIcon} />
              {<span style={styles.buttonText}>Buscar Partidas</span>}
            </button>

            <button onClick={handleAdd} style={{ ...styles.sidebarButton}} title="Añadir partidas">
              <FaFileMedical style={styles.buttonIcon} />
              {<span style={styles.buttonText}>Añadir Partidas</span>}
            </button>

            <button onClick={handleCorrect} style={{ ...styles.sidebarButton}} title="Corregir partidas">
              <FaEdit style={styles.buttonIcon} />
              {<span style={styles.buttonText}>Corregir Partidas</span>}
            </button>
          </div>

          {/* Espacio flexible para empujar los botones inferiores al fondo */}
          <div style={{ flex: 1 }}></div>

          {/* Botones inferiores */}
            <button onClick={handleLogout} style={{ ...styles.logoutButton}}>
              <FaSignOutAlt style={styles.buttonIcon} />
              {<span style={styles.buttonText}>Cerrar Sesión</span>}
            </button>
        </nav>

        {/* Área de contenido */}
        <main style={styles.content}>
          <div style={styles.logoContainer}>
            <img src={logocentral || "/logocentral.png"} alt="Logo Basílica" style={styles.logocentral} />
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
    userSelect: 'none',
  },
  header: {
    backgroundColor: "#385792",
    color: "white",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
    position: "relative",
    zIndex: 1000,
  },
  headerTitle: {
    margin: 0,
    flex: 1,
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "600",
    
  },
  userContainer: {
    position: 'relative',
    cursor: 'pointer',
    zIndex: 1001,
    alignItems: "center",
    marginLeft: "auto",
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
  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#f0f0f0",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    with: "100%",
    height: "100%",
    overflow: "auto",
    boxShadow: "3px 0 8px rgba(0,0,0,0.15)",
  },
  sidebarButton: {
    display: "flex",
    margin: '10px 0',
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
    minHeight: "40px",
    marginBottom: "1rem",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: "0rem",
    padding: "0.75rem",
    border: "none",
    borderRadius: "1rem",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "50px",
    color: "white",
    backgroundColor: "#FF000F",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    width: "100%", 
    minHeight: "40px", 
  },
  buttonIcon: {
    width: "20px", 
    height: "20px",
    marginRight: "0.5rem",
  },
  buttonText: {
    fontSize: "1rem",
    flex: 1,
  },
  content: {
    flex: 1,
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    cursor: 'default',
  },
  logoContainer: {
    maxWidth: "400px",
    width: "100%",
  },
  logo: {
    width: "60px",
    height: "auto",
    objectFit: "contain",
    marginRight: "1rem",
  },
  logocentral: {
    width: "800px",
    height: "auto",
    objectFit: "contain",
    
  },

}

export default Principal

