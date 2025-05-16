import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import logo from "../../assets/logo.png" 

import { FaSignOutAlt, FaUserCircle, FaChevronDown, FaChevronUp, FaEdit, FaKey } from "react-icons/fa"

function Header({ title }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleEditProfile = () => {
    setIsDropdownOpen(false)
    navigate("/editarPerfil")
  }

  const handleChangePassword = () => {
    console.log("Navegando a cambiar contraseña") 
    setIsDropdownOpen(false) 
    navigate("/cambiarContraseña") 
  }

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
      <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
      </div>
      <div style={styles.titleContainer}>
      <h1 style={styles.headerTitle}>{title}</h1>
      </div>
      <button onClick={handleLogout} style={styles.logoutButton}>
        <FaSignOutAlt style={styles.iconLogout} />
        <span style={styles.iconLogoutText}> Cerrar Sesión</span>
      </button>
      <div style={styles.userContainer} onClick={toggleDropdown}>
        <div style={styles.userInfo}>
          <FaUserCircle size={24} style={styles.userIcon} />
          <div style={styles.userText}>
            <span style={styles.userName}>{user?.displayName || "Nombre Usuario"}</span>
            <span style={styles.userRole}>{user?.role || "Rol"}</span>
          </div>
          {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {isDropdownOpen && (
          <div style={styles.dropdownMenu}>
            <button style={styles.dropdownItem} onClick={handleEditProfile}>
              <FaEdit style={styles.dropdownIcon} />
              <span style={styles.dropdownIconText}>Editar perfil</span>
            </button>
            <button onClick={handleChangePassword} style={styles.dropdownItem}>
              <FaKey style={styles.dropdownIcon} />
              <span style={styles.dropdownIconText}>Cambiar Contraseña</span>
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
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
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
  headerTitle: {
    margin: 0,
    flex: 1,
    fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
    textAlign: "center",
    fontWeight: "700",
    whiteSpace: "nowrap", 
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  iconLogout: {
    width: "20px",
    height: "20px",
    fill: "white",
  },
  iconLogoutText: {
    color: "white",
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
  userContainer: {
    position: "relative",
    cursor: "pointer",
  },
  userName: {
    fontSize: "1rem",
    fontWeight: "600",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  userIcon: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    backgroundColor: "#fff",
  },
  userText: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.8rem",
  },
  dropdownMenu: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    right: 0,
    top: "100%",
    backgroundColor: "#385792",
    borderRadius: "4px",
    minWidth: "100px",
    zIndex: 1000,
    textAlign: "left",
    cursor: "pointer",
    marginTop: "0.5rem",
    overflow: "hidden",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0.75rem 1rem",
    border: "none",
    backgroundColor: "transparent",
    textAlign: "left",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  dropdownIcon: {
    marginRight: "0.75rem",
    color: "#ffffff",
  },
  dropdownIconText: {
    color: "#ffffff",
  },
}

export default Header
