import { FaSignOutAlt, FaUserCircle, FaChevronUp, FaChevronDown, FaEdit } from "react-icons/fa"
import { useState, useRef, useCallback, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png" 

function PrincipalHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

  const handleEditProfile = () => {
    console.log("Navegando a editar perfil") // Agregamos un log para depuración
    setIsDropdownOpen(false) // Cerramos el dropdown
    navigate("/editarPerfil") // Navegamos a la ruta correcta
  }

  const toggleDropdown = useCallback((e) => {
      e?.stopPropagation();
      setIsDropdownOpen(prev => !prev);
    }, []);
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
      <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
      </div>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>Parroquia San Luis Gonzaga</h1>
      </div>
        <div ref={dropdownRef} style={styles.userContainer} onClick={toggleDropdown}>
      
      <div style={styles.userSection}>
        <FaUserCircle style={styles.userIcon} />
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.displayName || "Usuario"}</span>
          <span style={styles.userRole}>{user?.role || "Rol"}</span>
        </div>
        {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* Menú desplegable */}
                {isDropdownOpen && (
                  <div style={styles.dropdownMenu}>
                    {/* Usamos un botón normal en lugar de un elemento de menú para mejor compatibilidad */}
                    <button onClick={handleEditProfile} style={styles.dropdownItem}>
                      <FaEdit style={styles.dropdownIcon} />
                      <span style={styles.dropdownIconText}>Editar perfil</span>
                    </button>
                  </div>
                )}
        </div>
    </header>
  )
}

const styles = {
  header: {
    backgroundColor: "#385792",
    color: "white",
    padding: "0 1rem",
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  logo: {
    height: "3.8rem",
    width: "auto",
    objectFit: "contain",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "20rem",
  },
  titleContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },
  title: {
    fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
    fontWeight: "700",
    textAlign: "center",
    color: "#ffffff",
    margin: 0,
    flex: 1,
    whiteSpace: "nowrap", 
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "90%"
  },
  userSection: {
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
  userContainer: {
    position: 'relative',
    cursor: 'pointer',
    zIndex: 1001,
    alignItems: "center",
    marginLeft: "auto",
  },
  userIcon: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    backgroundColor: "#fff",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "1rem",
    fontWeight: "600"
  },
  userRole: {
    fontSize: "0.75rem",
    opacity: 0.8
  },
  logoutButton: {
    backgroundColor: "#FF000F",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    transition: "opacity 0.2s",
    ":hover": {
      opacity: 0.9
    }
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
}

export default PrincipalHeader