import { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate, Outlet, useLocation   } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import PrincipalSidebar from "../components/layout/PrincipalSidebar"
import PrincipalHeader from "../components/layout/PrincipalHeader"
import logocentral from "../assets/logocentral.png"

function Principal() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const location = useLocation()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    if (user) {
      console.log("Usuario en Principal:", user)
      setNombre(user.nombre || "")
      setApellido(user.apellido || "")
      setDisplayName(user.displayName || `${user.nombre || ""} ${user.apellido || ""}`.trim())
    }
  }, [user])

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"))
      if (storedUser) {
        setNombre(storedUser.nombre || "")
        setApellido(storedUser.apellido || "")
        setDisplayName(storedUser.displayName || `${storedUser.nombre || ""} ${storedUser.apellido || ""}`.trim())
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleClickOutside = useCallback((event) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }
      setIsDropdownOpen(false);
    }, []);

    useEffect(() => {
        if (isDropdownOpen) {
          document.addEventListener('mousedown', handleClickOutside, { capture: true });
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside, { capture: true });
        };
      }, [isDropdownOpen, handleClickOutside]);
    
      const toggleDropdown = useCallback((e) => {
        e?.stopPropagation();
        setIsDropdownOpen(prev => !prev);
      }, []);
    

  // Función para navegar a la vista de registros
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

  const handleLogout = () => {
    logout()
    navigate('/principal')
  }

  const currentPage = location.pathname.split('/').pop(); 

  return (
    <div style={styles.container}>
      {/* Barra superior */}
      <PrincipalHeader/>

      {/* Contenido principal */}
      <div style={styles.mainContent}>
        {/* Menú lateral */}
        <PrincipalSidebar
          currentPage={currentPage}
          onViewActas={handleViewActas}
          onSearch={handleSearch}
          onAdd={handleAdd}
          onCorrect={handleCorrect}
          onLogout={handleLogout}
        />

        {/* Área de contenido */}
        <main style={styles.content}>
          <div style={styles.logoContainer}>
          <img src={logocentral || "/logocentral.png"} alt="Logo Basílica" style={styles.logocentral} />
          </div>
          <Outlet />
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
    cursor: "default",
    userSelect: "none",
  },
  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    cursor: "default",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    maxWidth: "25rem",
    maxHeight: "25rem",
    //marginRight: "5rem",
    height: "100%",
    width: "100%",
    cursor: "pointer",
    transition: "opacity 0.2s ease-in-out",
    ":hover": {
      opacity: 0.8,
    },
  },
  logocentral: {
    width: "50rem",
    height: "auto",
    objectFit: "contain",
    cursor: "default",
  },
}

export default Principal
