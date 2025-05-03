import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useActas } from "../context/ActaContext"
import Header from "../components/layout/Header"
import DetallesActa from "../components/layout/DetallesActas"
import {
  FaEdit,
  FaArrowLeft,
  FaTrash,
  FaCheck,
} from "react-icons/fa"

function ListaActas() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedActa, setSelectedActa] = useState([]);
  const [selectedActas, setSelectedActas] = useState([]);
  const [selectedActaDetalle, setSelectedActaDetalle] = useState(null);
  const { actasTemporales, confirmarActas, eliminarActasTemporales, editarActaTemporal } = useActas();
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleCheckboxChange = (acta) => {
    setSelectedActas((prev) => {
      const exists = prev.find((a) => a.id === acta.id);
      if (exists) return prev.filter((a) => a.id !== acta.id);
      return [...prev, { ...acta, selectionTime: Date.now() }];
    });
  };

  const handleBack = () => {
    navigate('/añadirActas');
  };

  const handleEditActa = () => {
    if (selectedActas.length === 1) {
      const actaAEditar = selectedActas[0];
      editarActaTemporal(actaAEditar.id);
      navigate('/añadirActas', { state: { acta: actaAEditar } });
    }
  };

  const getNombreCompleto = (acta) => {
    if (acta.tipo === "Bautismo") {
      return `${acta.bautismo.primerNombre || ""} ${acta.bautismo.segundoNombre || ""} ${acta.bautismo.primerApellido || ""} ${acta.bautismo.segundoApellido || ""}`.trim();
    } else if (acta.tipo === "Confirmación") {
      return `${acta.confirmacion.primerNombre || ""} ${acta.confirmacion.segundoNombre || ""} ${acta.confirmacion.primerApellido || ""} ${acta.confirmacion.segundoApellido || ""}`.trim();
    } else if (acta.tipo === "Matrimonio") {
      return `${acta.matrimonio.novio.primerNombre || ""} ${acta.matrimonio.novio.primerApellido || ""} y ${acta.matrimonio.novia.primerNombre || ""} ${acta.matrimonio.novia.primerApellido || ""}`.trim();
    }
    return "Nombre no disponible";
  };

  const getPrimerNombre = (acta) => {
    if (acta.tipo === "Bautismo") {
      return acta.bautismo.primerNombre || "";
    } else if (acta.tipo === "Confirmación") {
      return acta.confirmacion.primerNombre || "";
    } else if (acta.tipo === "Matrimonio") {
      return acta.matrimonio.novio.primerNombre || "";
    }
    return "";
  };

  const getSegundoNombre = (acta) => {
    if (acta.tipo === "Bautismo") {
      return acta.bautismo.segundoNombre || "";
    } else if (acta.tipo === "Confirmación") {
      return acta.confirmacion.segundoNombre || "";
    } else if (acta.tipo === "Matrimonio") {
      return acta.matrimonio.novio.segundoNombre || "";
    }
    return "";
  };

  const getPrimerApellido = (acta) => {
    if (acta.tipo === "Bautismo") {
      return acta.bautismo.primerApellido || "";
    } else if (acta.tipo === "Confirmación") {
      return acta.confirmacion.primerApellido || "";
    } else if (acta.tipo === "Matrimonio") {
      return acta.matrimonio.novio.primerApellido || "";
    }
    return "";
  };

  const getSegundoApellido = (acta) => {
    if (acta.tipo === "Bautismo") {
      return acta.bautismo.segundoApellido || "";
    } else if (acta.tipo === "Confirmación") {
      return acta.confirmacion.segundoApellido || "";
    } else if (acta.tipo === "Matrimonio") {
      return acta.matrimonio.novio.segundoApellido || "";
    }
    return "";
  };

  return (
    <div style={styles.container}>
      {/* Barra superior */}
        <Header title="Lista de Actas" />

      <div style={styles.mainContent}>
        <main style={styles.content}>
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
                  backgroundColor: "#FCCE74",
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
                    .map((a) => a.id);
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
                    .map((a) => a.id);
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
                      onClick={() =>
                        setSelectedActaDetalle((prev) => (prev?.id === acta.id ? null : acta))
                      }
                    >
                      <td style={styles.tableCell} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedActas.some((a) => a.id === acta.id)}
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
                        <DetallesActa acta={acta} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {actasTemporales.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={styles.emptyMessage}>
                      No hay actas temporales. Agregue una nueva acta desde la sección 'Crear Actas'.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    
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
    marginBottom: "0.5rem",
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
    flex: "1 1 calc(30% - 1rem)",
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
