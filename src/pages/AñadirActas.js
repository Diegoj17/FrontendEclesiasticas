"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useActas } from "../context/ActaContext"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import CommonRegistroSection from "../components/forms/CommonRegistroSection"
import CommonOficianteSection from "../components/forms/CommonOficianteSection"
import ConfirmacionOficianteSection from "../components/forms/ConfirmacionOficianteSection"
import BautismoForm from "../components/forms/BautismoForm"
import ConfirmacionForm from "../components/forms/ConfirmacionForm"
import MatrimonioForm from "../components/forms/MatrimonioForm"
import { FaTimes, FaListAlt, FaFileMedical } from "react-icons/fa"

function AñadirPartidas() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [eventoSeleccionado, setEventoSeleccionado] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [errores, setErrores] = useState({})
  const [sidebarAbierto, setSidebarAbierto] = useState(true)

  // Lista de sacerdotes/oficiantes para el ComboBox
  const sacerdotes = [
    "Padre José Martínez",
    "Padre Antonio López",
    "Padre Miguel Ángel Pérez",
    "Padre Francisco Rodríguez",
    "Padre Juan Carlos Gómez",
  ]

  // Lista de testigos para el ComboBox
  const testigos = ["María González", "Juan Pérez", "Ana Rodríguez", "Carlos Sánchez", "Laura Martínez"]

  // Lista de monseñores para el ComboBox
  const monseñores = ["Monseñor Pedro Gómez", "Monseñor Luis Fernández", "Monseñor Carlos Herrera"]

  const ciudadesColombia = [
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cartagena",
    "Cúcuta",
    "Bucaramanga",
    "Pereira",
    "Santa Marta",
    "Ibagué",
    "Pasto",
    "Manizales",
    "Neiva",
    "Villavicencio",
    "Armenia",
    "Valledupar",
    "Montería",
    "Popayán",
    "Sincelejo",
    "Tunja",
    "Riohacha",
    "Quibdó",
    "Florencia",
    "Mocoa",
    "Yopal",
    "Arauca",
    "San José del Guaviare",
    "Mitú",
    "Puerto Carreño",
    "Inírida",
    "Leticia",
    "San Andrés",
  ]

  // Estado inicial para todos los tipos de formularios
  const initialFormData = {
    // Datos comunes para todos los formularios
    libro: "",
    folio: "",
    acta: "",
    oficiante: "",
    doyFe: "",
    notaMarginal: "",
    fechaCeremonia: {
      dia: "",
      mes: "",
      año: "",
    },

    // Datos específicos para Bautismo
    bautismo: {
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      fechaNacimiento: {
        dia: "",
        mes: "",
        año: "",
      },
      lugarNacimiento: "",
      nombrePadre: "",
      nombreMadre: "",
      abueloPaterno: "",
      abuelaPaterna: "",
      abueloMaterno: "",
      abuelaMaterna: "",
      padrino: "",
      madrina: "",
    },

    // Datos específicos para Confirmación
    confirmacion: {
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      fechaNacimiento: {
        dia: "",
        mes: "",
        año: "",
      },
      lugarNacimiento: "",
      fechaBautismo: {
        dia: "",
        mes: "",
        año: "",
      },
      lugarBautismo: "",
      nombrePadre: "",
      nombreMadre: "",
      padrino: "",
      madrina: "",
      monseñor: "",
      sacerdote: "",
      doyFe: "",
    },

    // Datos específicos para Matrimonio
    matrimonio: {
      // Datos del novio
      novio: {
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        fechaNacimiento: {
          dia: "",
          mes: "",
          año: "",
        },
        lugarNacimiento: "",
        nombrePadre: "",
        nombreMadre: "",
      },
      // Datos de la novia
      novia: {
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        fechaNacimiento: {
          dia: "",
          mes: "",
          año: "",
        },
        lugarNacimiento: "",
        nombrePadre: "",
        nombreMadre: "",
      },
      testigo1: "",
      testigo2: "",
      testigo3: "",
      testigo4: "",
    },
  }

  const [formData, setFormData] = useState(initialFormData)
  const [showModal, setShowModal] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked, isComboBox } = e.target

    // --- Caso ComboBox ------------------------
    if (isComboBox) {
      // si viene "confirmacion.monseñor" o similar
      if (name.includes(".")) {
        const parts = name.split(".")
        setFormData((prev) => {
          const next = { ...prev }
          let cursor = next
          for (let i = 0; i < parts.length - 1; i++) {
            const k = parts[i]
            cursor[k] = { ...cursor[k] }
            cursor = cursor[k]
          }
          cursor[parts[parts.length - 1]] = value
          return next
        })
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }))
      }
      return
    }

    // --- Resto de inputs (Libro, Folio, Acta, fechas, textareas...) ---
    if (name.includes(".")) {
      const parts = name.split(".")
      setFormData((prev) => {
        const next = { ...prev }
        let cursor = next
        for (let i = 0; i < parts.length - 1; i++) {
          const k = parts[i]
          cursor[k] = { ...cursor[k] }
          cursor = cursor[k]
        }
        cursor[parts[parts.length - 1]] = type === "checkbox" ? checked : value
        return next
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const {
    actaEditando,
    setActaEditando,
    modoEdicion,
    setModoEdicion,
    actualizarActaTemporal,
    cancelarEdicion,
    agregarActaTemporal,
  } = useActas()

  const validarCampos = () => {
    const nuevosErrores = {}

    // Validar campos comunes
    if (!formData.libro) nuevosErrores.libro = "El libro es requerido"
    if (!formData.folio) nuevosErrores.folio = "El folio es requerido"
    if (!formData.acta) nuevosErrores.acta = "El acta es requerida"

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validarCampos()) {
      setShowModal(true) // Mostrar modal de errores
      return
    }

    const actaCompleta = {
      ...formData,
      tipo: eventoSeleccionado,
      id: actaEditando?.id || Date.now(),
      fechaCreacion: actaEditando?.fechaCreacion || new Date().toISOString(),
      confirmado: false,
    }

    if (modoEdicion) {
      // Si estamos editando, actualizamos el acta existente
      actualizarActaTemporal(actaCompleta)
      navigate("/listaActas")
    } else {
      // Si es nueva, la agregamos a las actas temporales
      agregarActaTemporal(actaCompleta)
      setShowModal(true)
    }

    if (!modoEdicion) {
      setFormData(initialFormData)
      setEventoSeleccionado("")
    }

    // Resetear el formulario
    setFormData(initialFormData)
    setEventoSeleccionado("")

    // Desactivar el modo edición
    setModoEdicion(false)
    setActaEditando(null)
  }

  useEffect(() => {
    if (actaEditando && modoEdicion) {
      // Hacer una copia profunda del acta
      const actaCopia = JSON.parse(JSON.stringify(actaEditando))

      // Asegurar que todos los campos anidados existan
      const mergedData = {
        ...initialFormData,
        ...actaCopia,
        bautismo: { ...initialFormData.bautismo, ...actaCopia.bautismo },
        confirmacion: { ...initialFormData.confirmacion, ...actaCopia.confirmacion },
        matrimonio: { ...initialFormData.matrimonio, ...actaCopia.matrimonio },
      }

      setFormData(mergedData)
      setEventoSeleccionado(actaCopia.tipo)
    }
  }, [actaEditando, modoEdicion])

  const handleEventoChange = (e) => {
    const nuevoEvento = e.target.value
    setEventoSeleccionado(nuevoEvento)

    // Solo resetear el formulario si NO estamos en modo edición
    if (!modoEdicion) {
      setFormData(initialFormData)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }



  // Renderizar el formulario específico según el tipo de ceremonia seleccionado
  const renderFormularioEspecifico = () => {
    switch (eventoSeleccionado) {
      case "Bautismo":
        return <BautismoForm formData={formData} handleChange={handleChange} ciudadesColombia={ciudadesColombia} />
      case "Confirmación":
        return <ConfirmacionForm formData={formData} handleChange={handleChange} ciudadesColombia={ciudadesColombia} />
      case "Matrimonio":
        return <MatrimonioForm formData={formData} handleChange={handleChange} ciudadesColombia={ciudadesColombia} />
      default:
        return null
    }
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

  const handleBack = () => {
    navigate('/Principal')
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div style={styles.container}>
      {/* Barra superior */}
      <Header title="Inscripciones de Actas" />

      <div style={styles.mainContent}>
        {/* Menú lateral */}
        <Sidebar 
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
        currentPage="añadirActas"
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
            padding: menuAbierto ? "1rem 0rem" : "1rem 1rem",
            transition: "margin-left 0.3s ease-in-out",
            height: "calc(100vh - 70px)",
            overflow: "auto",
          }}>

        {/* Contenido principal con el formulario */}
        <main style={styles.content}>
          {/* Selector de tipo de evento */}
          <div style={styles.filtroContainer}>
            <div style={styles.filtroLeft}>
              <label htmlFor="evento" style={styles.label}>
                Seleccionar Tipo de Ceremonia:
              </label>
              <select id="evento" value={eventoSeleccionado} onChange={handleEventoChange} style={styles.select}>
                <option value="">Seleccionar</option>
                <option value="Bautismo">Bautizos</option>
                <option value="Confirmación">Confirmaciones</option>
                <option value="Matrimonio">Matrimonios</option>
              </select>
            </div>

            <div style={styles.topButtonContainer}>
              {modoEdicion && (
                <button
                  type="button"
                  onClick={() => {
                    cancelarEdicion()
                    setFormData(initialFormData)
                    setEventoSeleccionado("")
                  }}
                  style={{ ...styles.sidebarButton, backgroundColor: "#FF000F", color: "white" }}
                >
                  <FaTimes style={styles.buttonIcon} />
                  <span style={styles.buttonText}>Cancelar Edición</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleList}
                style={styles.sidebarButton}
                title="Revisar Lista"
                disabled={!eventoSeleccionado}
              >
                <FaListAlt style={styles.buttonIcon} />
                <span style={styles.buttonText}>Revisar Lista</span>
              </button>

              <button
                type="submit"
                style={{
                  ...styles.sidebarButton,
                  opacity: eventoSeleccionado ? 1 : 0.5,
                  cursor: eventoSeleccionado ? "pointer" : "not-allowed",
                }}
                disabled={!eventoSeleccionado}
                onClick={handleSubmit}
              >
                <FaFileMedical style={styles.buttonIcon} />
                <span style={styles.buttonText}>Guardar</span>
              </button>
            </div>
          </div>

          {eventoSeleccionado ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Contenedor para las dos secciones superiores */}
              <div style={styles.topSectionsContainer}>
                {/* Sección común de registro (libro, folio, acta) */}
                <CommonRegistroSection formData={formData} handleChange={handleChange} />

                {/* Sección de oficiante según el tipo de ceremonia */}
                {eventoSeleccionado === "Confirmación" ? (
                  <ConfirmacionOficianteSection
                    formData={formData}
                    handleChange={handleChange}
                    monseñores={monseñores}
                    sacerdotes={sacerdotes}
                    testigos={testigos}
                  />
                ) : (
                  <CommonOficianteSection
                    formData={formData}
                    handleChange={handleChange}
                    sacerdotes={sacerdotes}
                    testigos={testigos}
                  />
                )}
              </div>

              {/* Renderizar el formulario específico según el tipo de ceremonia */}
              {renderFormularioEspecifico()}

              {/* Nota Marginal (común para todos los formularios) */}
              <div style={styles.formSection}>
                <h2 style={styles.sectionTitle}>Nota Marginal</h2>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <textarea
                      name="notaMarginal"
                      value={formData.notaMarginal}
                      onChange={handleChange}
                      style={styles.formNota}
                      placeholder="Escriba la nota marginal aquí..."
                    />
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div style={styles.noSelectionMessage}>
              <h2>Seleccione un tipo de ceremonia para comenzar</h2>
              <p>
                Por favor, elija el tipo de ceremonia en el menú desplegable superior para mostrar el formulario
                correspondiente.
              </p>
            </div>
          )}
        </main>
      </main>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{modoEdicion ? "Acta Actualizada" : "Acta Agregada"}</h2>
              <button onClick={handleCloseModal} style={styles.closeButton}>
                <FaTimes />
              </button>
            </div>
            <div style={styles.modalBody}>
              <p>
                {modoEdicion
                  ? "El acta ha sido actualizada exitosamente."
                  : "El acta ha sido agregada exitosamente a la lista temporal."}
              </p>
              <p>Puede verla en la sección "Lista de Actas".</p>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={handleCloseModal} style={styles.modalButton}>
                Aceptar
              </button>
              <button onClick={handleList} style={styles.modalButtonSecondary}>
                Ir a Lista de Actas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto",
    cursor: "default",
  },
  mainContent: {
    display: "flex",
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: "0.5rem 0rem",
    overflow: "auto",
    transition: "margin-left 0.3s ease-in-out",
    backgroundColor: "#FFFFFF",
    gap: "0rem",
    minHeight: "calc(100vh - 70px)",
    cursor: 'default',
  },
  filtroContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    fontSize: "1rem",
    fontWeight: "600",

    width: "100%",
    marginTop: "-0.5rem",
  },
  filtroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0rem",
    flexWrap: "wrap",
  },
  topButtonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  label: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginLeft: "1rem",
    color: "#000000",
  },
  select: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #ced4da",
    marginLeft: "0.5rem",
    width: "220px",
    fontWeight: "550",
    cursor: "pointer",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "1rem",
  },
  topSectionsContainer: {
    display: "flex",
    gap: "0.5rem",
    flexDirection: "row",
    marginBottom: "0.5rem",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "stretch",
  },
  formSection: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    marginBottom: "0.5rem",
    padding: "0.75rem",
    border: "1px solid #000000",
    borderRadius: "0.5rem",
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    padding: "0rem",
    marginBottom: "0.5rem",
    fontWeight: "700",
    color: "#385792",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "0.5rem",
    width: "100%",
  },
  formGroup: {
    flex: "1",
    minWidth: "300px",
    marginBottom: "0.5rem",
  },
  formNota: {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    marginBottom: "10px",
    color: "#000000",
    fontWeight: "500",
    minHeight: "100px",
    maxHeight: "200px",
    overflowY: "auto",
    resize: "vertical",
    whiteSpace: "pre-wrap",
    verticalAlign: "top",
  },
  sidebarButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    border: "none",
    borderRadius: "0.5rem",
    backgroundColor: "#FCCE74",
    cursor: "pointer",
    textAlign: "left",
    color: "black",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    minHeight: "40px",
    opacity: 1,
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
  },
  buttonText: {
    fontSize: "1rem",
    flex: 1,
  },
  noSelectionMessage: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "2rem",
    textAlign: "center",
    alignItems: "center",
    marginTop: "15rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "15px 20px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#385792",
    color: "white",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: "600",
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "white",
  },
  modalBody: {
    padding: "20px",
    fontSize: "1rem",
  },
  modalFooter: {
    padding: "15px 20px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  modalButton: {
    padding: "8px 16px",
    backgroundColor: "#385792",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  modalButtonSecondary: {
    padding: "8px 16px",
    backgroundColor: "#FCCE74",
    color: "black",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
}



export default AñadirPartidas
