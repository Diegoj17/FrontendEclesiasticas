import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { useActas } from "./ActaContext"
import logo from "./logo.png"
import {
  FaEdit,
  FaArrowLeft,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaCheck,
} from "react-icons/fa"

function ListaActas() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedActa, setSelectedActa] = useState([]);
  const [selectedActas, setSelectedActas] = useState([]);
  const [selectedActaDetalle, setSelectedActaDetalle] = useState(null);
  const { actasTemporales, confirmarActas, eliminarActasTemporales, editarActaTemporal } = useActas()
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const handleCheckboxChange = (acta) => {
    setSelectedActas(prev => {
      const exists = prev.find(a => a.id === acta.id);
      if (exists) return prev.filter(a => a.id !== acta.id);
      return [...prev, { ...acta, selectionTime: Date.now() }];
    });
  };
  
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleBack = () => {
    navigate("/añadirPartidas")
  }

  const handleEditProfile = () => {
    navigate("/editarPerfil")
    setIsDropdownOpen(false)
  }

  const handleSelectActa = (acta) => {
    setSelectedActas(prev => {
      const exists = prev.find(a => a.id === acta.id);
      if (exists) return prev.filter(a => a.id !== acta.id);
      return [...prev, { ...acta, selectionTime: Date.now() }];
    });
  };

  const handleRowClick = (acta) => {
    setSelectedActaDetalle(prev => 
      prev?.id === acta.id ? null : acta
    );
  };

  const handleDeleteSelected = () => {
    if (selectedActas.length > 0) {
      eliminarActasTemporales(selectedActas.map(a => a.id));
      setSelectedActas([]);
    }
  };

  const handleConfirmSelected = () => {
    if (selectedActas.length > 0) {
      const ordenIds = selectedActas
        .sort((a, b) => a.selectionTime - b.selectionTime)
        .map(a => a.id);
      
      confirmarActas(ordenIds);
      setSelectedActas([]);
    }
  };

  const handleEditActa = () => {
    if (selectedActas.length === 1) {
      const actaAEditar = selectedActas[0];
      editarActaTemporal(actaAEditar.id);
      navigate("/añadirPartidas");
    }
  };

  // Función para obtener el nombre completo según el tipo de acta
  const getNombreCompleto = (acta) => {
    if (acta.tipo === "Bautismo") {
      return `${acta.bautismo.primerNombre || ""} ${acta.bautismo.segundoNombre || ""} ${acta.bautismo.primerApellido || ""} ${acta.bautismo.segundoApellido || ""}`.trim()
    } else if (acta.tipo === "Confirmación") {
      return `${acta.confirmacion.primerNombre || ""} ${acta.confirmacion.segundoNombre || ""} ${acta.confirmacion.primerApellido || ""} ${acta.confirmacion.segundoApellido || ""}`.trim()
    } else if (acta.tipo === "Matrimonio") {
      return `${acta.matrimonio.novio.primerNombre || ""} ${acta.matrimonio.novio.primerApellido || ""} y ${acta.matrimonio.novia.primerNombre || ""} ${acta.matrimonio.novia.primerApellido || ""}`.trim()
    }
    return "Nombre no disponible"
  }

  // Función para obtener el primer nombre
  const getPrimerNombre = (acta) => {
    if (acta.tipo === "Bautismo") {
      return acta.bautismo.primerNombre || ""
    } else if (acta.tipo === "Confirmación") {
      return acta.confirmacion.primerNombre || ""
    } else if (acta.tipo === "Matrimonio") {
      return acta.matrimonio.novio.primerNombre || ""
    }
    return ""
  }

  // Función para obtener el segundo nombre
  const getSegundoNombre = (acta) => {
    if (acta.tipo === "Bautismo") {
      return acta.bautismo.segundoNombre || ""
    } else if (acta.tipo === "Confirmación") {
      return acta.confirmacion.segundoNombre || ""
    } else if (acta.tipo === "Matrimonio") {
      return acta.matrimonio.novio.segundoNombre || ""
    }
    return ""
  }

  // Función para obtener el primer apellido
  const getPrimerApellido = (acta) => {
    if (acta.tipo === "Bautismo") {
      return acta.bautismo.primerApellido || ""
    } else if (acta.tipo === "Confirmación") {
      return acta.confirmacion.primerApellido || ""
    } else if (acta.tipo === "Matrimonio") {
      return acta.matrimonio.novio.primerApellido || ""
    }
    return ""
  }

  // Función para obtener el segundo apellido
  const getSegundoApellido = (acta) => {
    if (acta.tipo === "Bautismo") {
      return acta.bautismo.segundoApellido || ""
    } else if (acta.tipo === "Confirmación") {
      return acta.confirmacion.segundoApellido || ""
    } else if (acta.tipo === "Matrimonio") {
      return acta.matrimonio.novio.segundoApellido || ""
    }
    return ""
  }

  // Renderizar detalles según el tipo de acta
  const renderDetallesActa = (acta) => {
    if (acta.tipo === "Bautismo") {
      return (
        <div style={styles.detailsGrid}>
          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Datos del Bautizado</h4>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Nombre completo:</span>
              <span style={styles.detailsValue}>
                {acta.bautismo.primerNombre} {acta.bautismo.segundoNombre} {acta.bautismo.primerApellido}{" "}
                {acta.bautismo.segundoApellido}
              </span>
            </div>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Fecha de nacimiento:</span>
              <span style={styles.detailsValue}>
                {acta.bautismo.fechaNacimiento?.dia}/{acta.bautismo.fechaNacimiento?.mes}/
                {acta.bautismo.fechaNacimiento?.año}
              </span>
            </div>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
              <span style={styles.detailsValue}>{acta.bautismo.lugarNacimiento}</span>
            </div>
          </div>

          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Datos de los Padres</h4>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Padre:</span>
              <span style={styles.detailsValue}>{acta.bautismo.nombrePadre || "No disponible"}</span>
            </div>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Madre:</span>
              <span style={styles.detailsValue}>{acta.bautismo.nombreMadre || "No disponible"}</span>
            </div>
          </div>

          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Abuelos Paternos</h4>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Abuelo:</span>
              <span style={styles.detailsValue}>{acta.bautismo.abueloPaterno || "No disponible"}</span>
            </div>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Abuela:</span>
              <span style={styles.detailsValue}>{acta.bautismo.abuelaPaterna || "No disponible"}</span>
            </div>
          </div>

          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Abuelos Maternos</h4>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Abuelo:</span>
              <span style={styles.detailsValue}>{acta.bautismo.abueloMaterno || "No disponible"}</span>
            </div>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Abuela:</span>
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
              <span style={styles.detailsLabel}>Fecha:</span>
              <span style={styles.detailsValue}>
                {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
              </span>
            </div>
          </div>
        </div>
      )
    } else if (acta.tipo === "Confirmación") {
      return (
        <div style={styles.detailsGrid}>
          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Datos del Confirmado</h4>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Nombre completo:</span>
              <span style={styles.detailsValue}>
                {acta.confirmacion.primerNombre} {acta.confirmacion.segundoNombre} {acta.confirmacion.primerApellido}{" "}
                {acta.confirmacion.segundoApellido}
              </span>
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
          </div>

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
              <span style={styles.detailsLabel}>Diócesis:</span>
              <span style={styles.detailsValue}>{"No disponible"}</span>
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
          </div>

          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Padrinos</h4>
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
              <span style={styles.detailsLabel}>Fecha:</span>
              <span style={styles.detailsValue}>
                {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
              </span>
            </div>
          </div>
        </div>
      )
    } else if (acta.tipo === "Matrimonio") {
      return (
        <div style={styles.detailsGrid}>
          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Datos del Esposo</h4>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Nombre completo:</span>
              <span style={styles.detailsValue}>
                {acta.matrimonio.novio.primerNombre} {acta.matrimonio.novio.segundoNombre}{" "}
                {acta.matrimonio.novio.primerApellido} {acta.matrimonio.novio.segundoApellido}
              </span>
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
              <span style={styles.detailsLabel}>Fecha:</span>
              <span style={styles.detailsValue}>
                {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
              </span>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div style={styles.detailsGrid}>
          <div style={styles.detailsSection}>
            <h4 style={styles.sectionTitle}>Información no disponible</h4>
            <p>No hay información detallada disponible para este tipo de acta.</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div style={styles.container}>
      {/* Barra superior */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <img src={logo || "/logo.png"} alt="Logo" style={styles.headerLogo} />
          <h1 style={styles.headerTitle}>Lista de Actas</h1>
        </div>

        <div style={styles.headerRight}>
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

            {/* Menú desplegable */}
            {isDropdownOpen && (
              <div style={styles.dropdownMenu}>
                <button style={styles.dropdownItem} onClick={handleEditProfile}>
                  <FaEdit style={styles.dropdownIcon} />
                  <span style={styles.dropdownIconText}>Editar perfil</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Contenido principal con la lista de actas */}
        <main style={styles.content}>
          {/* Barra de navegación y acciones */}
          <div style={styles.actionsBar}>
            <button onClick={handleBack} style={styles.backButton} title="Atrás">
              <FaArrowLeft style={styles.iconBack} />
              <span style={styles.buttonText}>Atrás</span>
            </button>

            <div style={styles.actionButtonsContainer}>
              <button
                onClick={handleEditActa}
                style={{
                  ...styles.actionButton,
                  backgroundColor: "#f8d7a4",
                  opacity: selectedActa ? 1 : 0.5,
                  cursor: selectedActa ? "pointer" : "not-allowed",
                }}
                disabled={selectedActas.length !== 1}
              >
                <FaEdit style={styles.buttonIcon} />
                <span>Editar</span>
              </button>
              <button
    onClick={() => {
      const ids = selectedActas
        .sort((a, b) => a.selectionTime - b.selectionTime)
        .map(a => a.id);
      eliminarActasTemporales(ids);
      setSelectedActas([]);
    }}
    style={{
      ...styles.actionButton,
      backgroundColor: "#FF000F",
      color: "white",
      opacity: selectedActas.length > 0 ? 1 : 0.5,
      cursor: selectedActas.length > 0 ? "pointer" : "not-allowed",
    }}
    disabled={selectedActas.length === 0}
  >
    <FaTrash style={styles.buttonIcon} />
    <span>Borrar ({selectedActas.length})</span>
  </button>
  <button
    onClick={() => {
      const ids = selectedActas
        .sort((a, b) => a.selectionTime - b.selectionTime)
        .map(a => a.id);
      confirmarActas(ids);
      setSelectedActas([]);
    }}
    style={{
      ...styles.actionButton,
      backgroundColor: "#4CAF50",
      color: "white",
      opacity: selectedActas.length > 0 ? 1 : 0.5,
      cursor: selectedActas.length > 0 ? "pointer" : "not-allowed",
    }}
    disabled={selectedActas.length === 0}
  >
    <FaCheck style={styles.buttonIcon} />
    <span>Confirmar ({selectedActas.length})</span>
  </button>
            </div>
          </div>

          {/* Tabla de actas */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}></th>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>Primer Nombre</th>
                  <th style={styles.tableHeader}>Segundo Nombre</th>
                  <th style={styles.tableHeader}>Primer Apellido</th>
                  <th style={styles.tableHeader}>Segundo Apellido</th>
                  <th style={styles.tableHeader}>Libro</th>
                  <th style={styles.tableHeader}>Folio</th>
                  <th style={styles.tableHeader}>Acta</th>
                  <th style={styles.tableHeader}>Ceremonia</th>
                </tr>
              </thead>
              <tbody>
              {actasTemporales.map((acta) => (
  <>
    <tr
      key={acta.id}
      style={{
        ...styles.tableRow,
        backgroundColor: selectedActaDetalle?.id === acta.id ? "#f0f0f0" : "white",
      }}
      onClick={() => setSelectedActaDetalle(prev => prev?.id === acta.id ? null : acta)}
    >
      <td style={styles.tableCell} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selectedActas.some(a => a.id === acta.id)}
          onChange={() => handleCheckboxChange(acta)}
          style={styles.checkbox}
        />
      </td>
                        <td style={styles.tableCell}>{acta.id}</td>
                        <td style={styles.tableCell}>{getPrimerNombre(acta)}</td>
                        <td style={styles.tableCell}>{getSegundoNombre(acta)}</td>
                        <td style={styles.tableCell}>{getPrimerApellido(acta)}</td>
                        <td style={styles.tableCell}>{getSegundoApellido(acta)}</td>
                        <td style={styles.tableCell}>{acta.libro}</td>
                        <td style={styles.tableCell}>{acta.folio}</td>
                        <td style={styles.tableCell}>{acta.acta}</td>
                        <td style={styles.tableCell}>
                          <span
                            style={{
                              ...styles.ceremonyTag,
                              backgroundColor:
                                acta.tipo === "Bautismo"
                                  ? "#B3E5FC"
                                  : acta.tipo === "Confirmación"
                                    ? "#F6DC43"
                                    : acta.tipo === "Matrimonio"
                                      ? "#F2B28C"
                                      : "#e0e0e0",
                            }}
                          >
                            {acta.tipo}
                          </span>
                        </td>
                      </tr>
                      {selectedActaDetalle?.id === acta.id && (
                        <tr>
                          <td colSpan="10" style={styles.detailsCell}>
                            <div style={styles.detailsContainer}>
                              <h3 style={styles.detailsTitle}>
                                Detalles de {getPrimerNombre(acta)} {getPrimerApellido(acta)}
                              </h3>
                              {renderDetallesActa(acta)}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                }
                {actasTemporales.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={styles.emptyMessage}>
                      No hay actas temporales. Agregue una nueva acta desde la sección 'Añadir partidas'.
                    </td>
                  </tr>
                ) 
                : null}
              </tbody>
            </table>
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
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  headerLogo: {
    height: "60px",
    marginRight: "1rem",
  },
  headerTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
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
  iconLogoutText: {
    color: "white",
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
  buttonText: {
    fontSize: "1rem",
    marginLeft: "0.5rem",
  },
  mainContent: {
    display: "flex",
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF000F",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "1rem",
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
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
  },
  content: {
    flex: 1,
    padding: "1.5rem",
    overflow: "auto",
    height: "calc(100vh - 70px)",
  },

  // Estilos para la barra de acciones
  actionsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "1rem",
  },
  actionButtonsContainer: {
    display: "flex",
    gap: "0.5rem",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    color: "black",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "500",
    minWidth: "100px",
    justifyContent: "center",
  },

  // Estilos para la tabla
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "1rem",
    overflow: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "1rem",
    
  },
  tableHeader: {
    backgroundColor: "#FCCE74",
    color: "black",
    padding: "0.75rem",
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: "600",
    border: "1px solid #000000",
    minWidth: "50px",
    whiteSpace: "nowrap",
    cursor: "default",
  },
  tableRow: {
    borderBottom: "1px solidrgb(0, 0, 0)",
    transition: "background-color 0.2s",
  },
  tableCell: {
    padding: "0.8rem",
    fontSize: "1rem",
    border: "1px solid #000000",
    textAlign: "center",
    minWidth: "120px",
    cursor: "pointer",
  },
  emptyMessage: {
    padding: "2rem",
    textAlign: "center",
    color: "#6c757d",
    fontSize: "1rem",
  },
  ceremonyTag: {
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    fontWeight: "500",
    display: "inline-block",
  },

  // Estilos para los detalles expandidos
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
  buttonIcon: {
    width: "16px",
    height: "16px",
  },

  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#385792",
  },
}

export default ListaActas
