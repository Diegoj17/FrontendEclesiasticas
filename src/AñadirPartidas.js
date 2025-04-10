import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import logo from "./logo.png"
import ComboBox from "./ComboBox"
import {
  FaFileAlt,
  FaSearch,
  FaFileMedical,
  FaEdit,
  FaChevronRight,
  FaArrowLeft,
  FaBars,
  FaSignOutAlt,
  FaListAlt,
  FaUserCircle,
  FaKey,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"

function AñadirPartidas() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [eventoSeleccionado, setEventoSeleccionado] = useState("")
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const parts = name.split(".")

      if (parts.length === 2) {
        // Manejo para campos simples con un nivel de anidación
        const [parent, child] = parts
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }))
      } else if (parts.length === 3) {
        // Manejo para campos con dos niveles de anidación
        const [parent, child, grandchild] = parts
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent]?.[child],
              [grandchild]: value,
            },
          },
        }))
      }
    } else {
      // Manejo para campos simples sin anidación
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    // Handle form submission
    alert(`Partida de ${eventoSeleccionado} guardada exitosamente`)
  }

  const handleEventoChange = (e) => {
    setEventoSeleccionado(e.target.value)
  }

  const handleViewRegistros = () => {
    navigate("/registros")
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleBack = () => {
    navigate("/Principal")
  }

  const handleSearch = () => {
    navigate("/buscarPartidas")
  }

  const handleAdd = () => {
    navigate("/añadirPartidas")
  }

  const handleCorrect = () => {
    console.log("Corregir partida")
  }

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
    if (!menuAbierto) {
      setIsSubmenuOpen(false)
    }
  }

  // Componente para la sección común de registro (libro, folio, acta)
  const CommonRegistroSection = () => (
    <div style={styles.formSectionRegistro}>
      <h2 style={styles.sectionTitle}>Datos de Registro</h2>
      <div style={styles.registroRow}>
        <div style={styles.registroGroup}>
          <label style={styles.formLabelRegistro}>Libro</label>
          <input
            type="text"
            name="libro"
            value={formData.libro}
            onChange={handleChange}
            style={styles.formRegistro}
          />
        </div>
        <div style={styles.registroGroup}>
          <label style={styles.formLabelRegistro}>Folio</label>
          <input
            type="text"
            name="folio"
            value={formData.folio}
            onChange={handleChange}
            style={styles.formRegistro}
          />
        </div>
        <div style={styles.registroGroup}>
          <label style={styles.formLabelRegistro}>Acta</label>
          <input
            type="text"
            name="acta"
            value={formData.acta}
            onChange={handleChange}
            style={styles.formRegistro}
          />
        </div>
      </div>
      <div style={styles.ceremoniaRow}>
        <div style={styles.ceremoniaGroup}>
          <label style={styles.formLabel}>Fecha De La Ceremonia</label>
          <div style={styles.dateCeremonia}>
            <div style={styles.dateGroup}>
              <label style={styles.dateLabel}>Día</label>
              <input
                type="text"
                name="fechaCeremonia.dia"
                value={formData.fechaCeremonia.dia}
                onChange={handleChange}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.dateGroup}>
              <label style={styles.dateLabel}>Mes</label>
              <input
                type="text"
                name="fechaCeremonia.mes"
                value={formData.fechaCeremonia.mes}
                onChange={handleChange}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.dateGroup}>
              <label style={styles.dateLabel}>Año</label>
              <input
                type="text"
                name="fechaCeremonia.año"
                value={formData.fechaCeremonia.año}
                onChange={handleChange}
                style={styles.dateInput}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Componente para la sección común del oficiante
  const CommonOficianteSection = () => (
    <div style={{ ...styles.formSection, flex: "1" }}>
      <h2 style={styles.sectionTitle}>Datos del Encargado de Celebrar la Ceremonia</h2>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <ComboBox
            label="Nombres del Sacerdote"
            options={sacerdotes}
            value={formData.oficiante}
            onChange={handleChange}
            placeholder="Seleccione o escriba el nombre"
            name="oficiante"
          />
        </div>
      </div>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <ComboBox
            label="Doy Fe"
            options={testigos}
            value={formData.doyFe}
            onChange={handleChange}
            placeholder="Seleccione o escriba el nombre"
            name="doyFe"
          />
        </div>
      </div>
    </div>
  )

  // Componente para la sección de oficiante de confirmación (con monseñor)
  const ConfirmacionOficianteSection = () => (
    <div style={{ ...styles.formSection, flex: "1" }}>
      <h2 style={styles.sectionTitle}>Datos del Encargado de Celebrar la Ceremonia</h2>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <ComboBox
            label="Monseñor que Oficia la Ceremonia"
            options={monseñores}
            value={formData.confirmacion.monseñor}
            onChange={handleChange}
            placeholder="Seleccione o escriba el nombre"
            name="confirmacion.monseñor"
          />
        </div>
      </div>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <ComboBox
            label="Párroco o Vicario"
            options={sacerdotes}
            value={formData.confirmacion.sacerdote}
            onChange={handleChange}
            placeholder="Seleccione o escriba el nombre"
            name="confirmacion.sacerdote"
          />
        </div>
      </div>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <ComboBox
            label="Doy Fe"
            options={testigos}
            value={formData.confirmacion.doyFe}
            onChange={handleChange}
            placeholder="Seleccione o escriba el nombre"
            name="confirmacion.doyFe"
          />
        </div>
      </div>
    </div>
  )

  // Renderizar el formulario específico según el tipo de ceremonia seleccionado
  const renderFormularioEspecifico = () => {
    switch (eventoSeleccionado) {
      case "Bautismo":
        return (
          <>
            {/* Datos del bautizado */}
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Datos del Bautizado</h2>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Nombre</label>
                  <input
                    type="text"
                    name="bautismo.primerNombre"
                    value={formData.bautismo.primerNombre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Nombre</label>
                  <input
                    type="text"
                    name="bautismo.segundoNombre"
                    value={formData.bautismo.segundoNombre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Apellido</label>
                  <input
                    type="text"
                    name="bautismo.primerApellido"
                    value={formData.bautismo.primerApellido}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Apellido</label>
                  <input
                    type="text"
                    name="bautismo.segundoApellido"
                    value={formData.bautismo.segundoApellido}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Fecha de Nacimiento</label>
                  <div style={styles.dateInputs}>
                    <input
                      type="text"
                      name="bautismo.fechaNacimiento.dia"
                      placeholder="Día"
                      value={formData.bautismo.fechaNacimiento.dia}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                    <input
                      type="text"
                      name="bautismo.fechaNacimiento.mes"
                      placeholder="Mes"
                      value={formData.bautismo.fechaNacimiento.mes}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                    <input
                      type="text"
                      name="bautismo.fechaNacimiento.año"
                      placeholder="Año"
                      value={formData.bautismo.fechaNacimiento.año}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Lugar de Nacimiento</label>
                  <ComboBox
                    options={ciudadesColombia}
                    value={formData.bautismo.lugarNacimiento}
                    onChange={handleChange}
                    placeholder="Seleccione o escriba la ciudad"
                    name="bautismo.lugarNacimiento"
                  />
                </div>
              </div>
            </div>

            {/* Datos anexos */}
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Datos Anexos</h2>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres del Padre</label>
                  <input
                    type="text"
                    name="bautismo.nombrePadre"
                    value={formData.bautismo.nombrePadre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de la Madre</label>
                  <input
                    type="text"
                    name="bautismo.nombreMadre"
                    value={formData.bautismo.nombreMadre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de Abuelo Paterno</label>
                  <input
                    type="text"
                    name="bautismo.abueloPaterno"
                    value={formData.bautismo.abueloPaterno}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de Abuela Paterna</label>
                  <input
                    type="text"
                    name="bautismo.abuelaPaterna"
                    value={formData.bautismo.abuelaPaterna}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de Abuelo Materno</label>
                  <input
                    type="text"
                    name="bautismo.abueloMaterno"
                    value={formData.bautismo.abueloMaterno}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de Abuela Materna</label>
                  <input
                    type="text"
                    name="bautismo.abuelaMaterna"
                    value={formData.bautismo.abuelaMaterna}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres del padrino (ó padrinos)</label>
                  <input
                    type="text"
                    name="bautismo.padrino"
                    value={formData.bautismo.padrino}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de la madrina (ó madrinas)</label>
                  <input
                    type="text"
                    name="bautismo.madrina"
                    value={formData.bautismo.madrina}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "Confirmación":
        return (
          <>
            {/* Datos del confirmado */}
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Datos del Confirmado</h2>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Nombre</label>
                  <input
                    type="text"
                    name="confirmacion.primerNombre"
                    value={formData.confirmacion.primerNombre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Nombre</label>
                  <input
                    type="text"
                    name="confirmacion.segundoNombre"
                    value={formData.confirmacion.segundoNombre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Apellido</label>
                  <input
                    type="text"
                    name="confirmacion.primerApellido"
                    value={formData.confirmacion.primerApellido}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Apellido</label>
                  <input
                    type="text"
                    name="confirmacion.segundoApellido"
                    value={formData.confirmacion.segundoApellido}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Fecha de Bautizo</label>
                  <div style={styles.dateInputs}>
                    <input
                      type="text"
                      name="confirmacion.fechaNacimiento.dia"
                      placeholder="Día"
                      value={formData.confirmacion.fechaNacimiento.dia}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                    <input
                      type="text"
                      name="confirmacion.fechaNacimiento.mes"
                      placeholder="Mes"
                      value={formData.confirmacion.fechaNacimiento.mes}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                    <input
                      type="text"
                      name="confirmacion.fechaNacimiento.año"
                      placeholder="Año"
                      value={formData.confirmacion.fechaNacimiento.año}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Lugar de Bautizo</label>
                  <ComboBox
                    options={ciudadesColombia}
                    value={formData.confirmacion.lugarNacimiento}
                    onChange={handleChange}
                    placeholder="Seleccione o escriba la ciudad"
                    name="confirmacion.lugarNacimiento"
                  />
                  <label style={styles.formLabel}>Diocesis donde fue Bautizado</label>
                  <ComboBox
                    options={ciudadesColombia}
                    value={formData.confirmacion.lugarNacimiento}
                    onChange={handleChange}
                    placeholder="Seleccione o escriba la diocesis donde fue bautizado"
                    name="confirmacion.lugarNacimiento"
                  />
                </div>
                <div style={styles.registroRow}>
                  <label style={styles.formLabel}>Datos de Acta de Bautizo</label>
                  <div style={styles.registroField}>
                    <label style={styles.formLabel}>Libro</label>
                    <input
                      type="text"
                      name="libro"
                      value={formData.libro}
                      onChange={handleChange}
                      style={styles.formRegistro}
                    />
                  </div>
                  <div style={styles.registroField}>
                    <label style={styles.formLabel}>Folio</label>
                    <input
                      type="text"
                      name="folio"
                      value={formData.folio}
                      onChange={handleChange}
                      style={styles.formRegistro}
                    />
                  </div>
                  <div style={styles.registroField}>
                    <label style={styles.formLabel}>Acta</label>
                    <input
                      type="text"
                      name="acta"
                      value={formData.acta}
                      onChange={handleChange}
                      style={styles.formRegistro}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Datos de la familia */}
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Datos de la Familia</h2>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres del Padre</label>
                  <input
                    type="text"
                    name="confirmacion.nombrePadre"
                    value={formData.confirmacion.nombrePadre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de la Madre</label>
                  <input
                    type="text"
                    name="confirmacion.nombreMadre"
                    value={formData.confirmacion.nombreMadre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombre del Padrino</label>
                  <input
                    type="text"
                    name="confirmacion.padrino"
                    value={formData.confirmacion.padrino}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombre de la Madrina</label>
                  <input
                    type="text"
                    name="confirmacion.madrina"
                    value={formData.confirmacion.madrina}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "Matrimonio":
        return (
          <>
            {/* Datos del novio */}
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Datos del Esposo</h2>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Nombre</label>
                  <input
                    type="text"
                    name="matrimonio.novio.primerNombre"
                    value={formData.matrimonio.novio.primerNombre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Nombre</label>
                  <input
                    type="text"
                    name="matrimonio.novio.segundoNombre"
                    value={formData.matrimonio.novio.segundoNombre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Apellido</label>
                  <input
                    type="text"
                    name="matrimonio.novio.primerApellido"
                    value={formData.matrimonio.novio.primerApellido}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Apellido</label>
                  <input
                    type="text"
                    name="matrimonio.novio.segundoApellido"
                    value={formData.matrimonio.novio.segundoApellido}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Fecha de Nacimiento</label>
                  <div style={styles.dateInputs}>
                    <input
                      type="text"
                      name="matrimonio.novio.fechaNacimiento.dia"
                      placeholder="Día"
                      value={formData.matrimonio.novio.fechaNacimiento.dia}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                    <input
                      type="text"
                      name="matrimonio.novio.fechaNacimiento.mes"
                      placeholder="Mes"
                      value={formData.matrimonio.novio.fechaNacimiento.mes}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                    <input
                      type="text"
                      name="matrimonio.novio.fechaNacimiento.año"
                      placeholder="Año"
                      value={formData.matrimonio.novio.fechaNacimiento.año}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Lugar de Nacimiento</label>
                  <ComboBox
                    options={ciudadesColombia}
                    value={formData.matrimonio.novio.lugarNacimiento}
                    onChange={handleChange}
                    placeholder="Seleccione o escriba la ciudad"
                    name="matrimonio.novio.lugarNacimiento"
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres del Padre</label>
                  <input
                    type="text"
                    name="matrimonio.novio.nombrePadre"
                    value={formData.matrimonio.novio.nombrePadre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de la Madre</label>
                  <input
                    type="text"
                    name="matrimonio.novio.nombreMadre"
                    value={formData.matrimonio.novio.nombreMadre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.registroRow}>
                <label style={styles.formLabel}>Datos de Acta de Bautizo</label>
                <div style={styles.registroField}>
                  <label style={styles.formLabel}>Libro</label>
                  <input
                    type="text"
                    name="libro"
                    value={formData.libro}
                    onChange={handleChange}
                    style={styles.formRegistro}
                  />
                </div>
                <div style={styles.registroField}>
                  <label style={styles.formLabel}>Folio</label>
                  <input
                    type="text"
                    name="folio"
                    value={formData.folio}
                    onChange={handleChange}
                    style={styles.formRegistro}
                  />
                </div>
                <div style={styles.registroField}>
                  <label style={styles.formLabel}>Acta</label>
                  <input
                    type="text"
                    name="acta"
                    value={formData.acta}
                    onChange={handleChange}
                    style={styles.formRegistro}
                  />
                </div>
              </div>
            </div>

            {/* Datos de la novia */}
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Datos de la Esposa</h2>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Nombre</label>
                  <input
                    type="text"
                    name="matrimonio.novia.primerNombre"
                    value={formData.matrimonio.novia.primerNombre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Nombre</label>
                  <input
                    type="text"
                    name="matrimonio.novia.segundoNombre"
                    value={formData.matrimonio.novia.segundoNombre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Apellido</label>
                  <input
                    type="text"
                    name="matrimonio.novia.primerApellido"
                    value={formData.matrimonio.novia.primerApellido}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Apellido</label>
                  <input
                    type="text"
                    name="matrimonio.novia.segundoApellido"
                    value={formData.matrimonio.novia.segundoApellido}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Fecha de Nacimiento</label>
                  <div style={styles.dateInputs}>
                    <input
                      type="text"
                      name="matrimonio.novia.fechaNacimiento.dia"
                      placeholder="Día"
                      value={formData.matrimonio.novia.fechaNacimiento.dia}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                    <input
                      type="text"
                      name="matrimonio.novia.fechaNacimiento.mes"
                      placeholder="Mes"
                      value={formData.matrimonio.novia.fechaNacimiento.mes}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                    <input
                      type="text"
                      name="matrimonio.novia.fechaNacimiento.año"
                      placeholder="Año"
                      value={formData.matrimonio.novia.fechaNacimiento.año}
                      onChange={handleChange}
                      style={styles.dateInput}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Lugar de Nacimiento</label>
                  <ComboBox
                    options={ciudadesColombia}
                    value={formData.matrimonio.novia.lugarNacimiento}
                    onChange={handleChange}
                    placeholder="Seleccione o escriba la ciudad"
                    name="matrimonio.novia.lugarNacimiento"
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres del Padre</label>
                  <input
                    type="text"
                    name="matrimonio.novia.nombrePadre"
                    value={formData.matrimonio.novia.nombrePadre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nombres de la Madre</label>
                  <input
                    type="text"
                    name="matrimonio.novia.nombreMadre"
                    value={formData.matrimonio.novia.nombreMadre}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
              <div style={styles.registroRow}>
                <label style={styles.formLabel}>Datos de Acta de Bautizo</label>
                <div style={styles.registroField}>
                  <label style={styles.formLabel}>Libro</label>
                  <input
                    type="text"
                    name="libro"
                    value={formData.libro}
                    onChange={handleChange}
                    style={styles.formRegistro}
                  />
                </div>
                <div style={styles.registroField}>
                  <label style={styles.formLabel}>Folio</label>
                  <input
                    type="text"
                    name="folio"
                    value={formData.folio}
                    onChange={handleChange}
                    style={styles.formRegistro}
                  />
                </div>
                <div style={styles.registroField}>
                  <label style={styles.formLabel}>Acta</label>
                  <input
                    type="text"
                    name="acta"
                    value={formData.acta}
                    onChange={handleChange}
                    style={styles.formRegistro}
                  />
                </div>
              </div>
            </div>

            {/* Datos de los testigos */}
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Testigos</h2>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Primer Testigo</label>
                  <input
                    type="text"
                    name="matrimonio.testigo1"
                    value={formData.matrimonio.testigo1}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Segundo Testigo</label>
                  <input
                    type="text"
                    name="matrimonio.testigo2"
                    value={formData.matrimonio.testigo2}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Tercer Testigo</label>
                  <input
                    type="text"
                    name="matrimonio.testigo3"
                    value={formData.matrimonio.testigo3}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Cuarto Testigo</label>
                  <input
                    type="text"
                    name="matrimonio.testigo4"
                    value={formData.matrimonio.testigo4}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </div>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  const handleEditProfile = () => {
    navigate("/editar-perfil");
    setIsDropdownOpen(false);
  };

  const handleChangePassword = () => {
    navigate("/cambiar-contraseña");
    setIsDropdownOpen(false);
  };

return (
    <div style={styles.container}>
      {/* Barra superior */}
      <header style={styles.header}>
        <img src={logo || "/logo.png"} alt="Logo" style={styles.headerLogo} />
        <h1 style={styles.headerTitle}>Inscripciones de Partidas</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <FaSignOutAlt style={styles.iconLogout} />
          {<span style={styles.iconLogoutText}> Cerrar Sesión</span>}
        </button>
        <div style={styles.userContainer} onClick={toggleDropdown}>
                    <div style={styles.userInfo}>
                      <FaUserCircle size={24} style={styles.userIcon} />
                      <div style={styles.userText}>
                        <span style={styles.userName}>
                        {user?.displayName || "Nombre Usuario"}
                        </span>
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
                        <button style={styles.dropdownItem} onClick={handleChangePassword}>
                          <FaKey style={styles.dropdownIcon} />
                          <span style={styles.dropdownIconText}>Cambiar contraseña</span>
                        </button>
                      </div>
                    )}
                  </div>
                </header>

      <div style={styles.mainContent}>
        {/* Menú lateral estilo Gmail */}
        <nav
          style={{
            ...styles.sidebar,
            padding: menuAbierto ? "1rem" : "1.5rem 0",
            width: menuAbierto ? "250px" : "50px",
            transition: "all 0.2s ease-in-out",
            gap: menuAbierto ? "0.5rem" : "0",
            overflow: menuAbierto ? "hidden" : "auto",
            position: "fixed",
            zIndex: 1000,
            height: "calc(100vh - 70px)", // Ajusta la altura del menú
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
                onClick={handleViewRegistros}
                style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                title="Vista de Registros"
              >
                <FaFileAlt style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Vista de Registros</span>}
              </button>

              <button
                onClick={handleSearch}
                style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                title="Buscar partidas"
              >
                <FaSearch style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Buscar partidas</span>}
              </button>

              <button
                onClick={handleAdd}
                style={{
                  ...styles.sidebarIconButton,
                  justifyContent: menuAbierto ? "flex-start" : "center",
                }}
                title="Añadir partidas"
              >
                <FaFileMedical style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Añadir partidas</span>}
              </button>

              <button
                onClick={handleCorrect}
                style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                title="Corregir partidas"
              >
                <FaEdit style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Corregir partidas</span>}
              </button>
            </div>

            {/* Botón "Atrás" al final del menú */}
            <button onClick={handleBack} style={styles.backButton} title="Atrás">
              <FaArrowLeft style={styles.iconBack} />
              {menuAbierto && <span style={styles.buttonText}>Atrás</span>}
            </button>
          </div>
        </nav>

        {/* Contenido principal con el formulario */}
        <main
          style={{
            ...styles.content,
            marginLeft: menuAbierto ? "250px" : "50px",
            transition: "margin-left 0.2s ease-in-out",
          }}
        >
          {/* Selector de tipo de evento */}
          <div style={styles.filtroContainer}>
            <label htmlFor="evento" style={styles.label}>
              Seleccionar Tipo de Ceremonia:
            </label>
            <select id="evento" value={eventoSeleccionado} onChange={handleEventoChange} style={styles.select}>
              <option value="">Seleccione tipo de ceremonia</option>
              <option value="Bautismo">Bautizos</option>
              <option value="Confirmación">Confirmaciones</option>
              <option value="Matrimonio">Matrimonios</option>
            </select>
          </div>

          {eventoSeleccionado ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Contenedor para las dos secciones superiores */}
              <div style={styles.topSectionsContainer}>
                {/* Sección común de registro (libro, folio, acta) */}
                <CommonRegistroSection />
                
                {/* Sección de oficiante según el tipo de ceremonia */}
                {eventoSeleccionado === "Confirmación" ? (
                  <ConfirmacionOficianteSection />
                ) : (
                  <CommonOficianteSection />
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

              {/* Botones */}
              <div style={styles.buttonContainer}>
                <button type="button" onClick={handleCorrect} style={{ ...styles.sidebarButton }} title="Revisar Lista">
                  <FaListAlt style={styles.buttonIcon} />
                  {<span style={styles.buttonText}>Revisar Lista</span>}
                </button>
                <button type="submit" style={{ ...styles.sidebarButton }} title="Guardar">
                  <FaFileMedical style={styles.buttonIcon} />
                  {<span style={styles.buttonText}>Guardar</span>}
                </button>
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
  headerLogo: {
    height: "60px",
    marginRight: "800px",
  },
  headerTitle: {
    margin: -90,
    flex: 1,
    fontSize: "1.5rem",
    fontWeight: "600",
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
  iconLogout: {
    width: "20px",
    height: "20px",
    fill: "white",
  },
  userContainer: {
    position: 'relative',
    cursor: 'pointer',
  },
  userName: {
    fontSize: "1rem",
    fontWeight: "600",
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
  buttonText: {
    fontSize: "1rem",
    flex: 1,
  },
  mainContent: {
    display: "flex",
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
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
    borderRight: "1px solid #e0e0e0",
  },
  sidebarButtonsContainer: {
    display: "flex",
    color: "black",
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
    minHeight: "40px",
  },
  menuToggleButton: {
    backgroundColor: "#FCCE74",
    color: "#6c757d",
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
  content: {
    flex: 1,
    padding: "1.5rem",
    overflow: "auto",
    height: "calc(100vh - 70px)",
  },

  // Estilos del filtro de selección
  filtroContainer: {
    alignItems: "center",
    marginBottom: "20px",
    marginLeft: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    display: "flex",
    gap: "0rem",
  },
  label: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginLeft: "0.5rem",
    color: "#6c757d",
  },
  select: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #ced4da",
    marginLeft: "1rem",
    width: "220px",
    fontWeight: "550",
  },

  // Estilos del formulario
  form: {
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "1rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  topSectionsContainer: {
    display: "flex",
    gap: "20px",
    flexDirection: "row",
    marginBottom: "20px",
    width: "100%",
  },

  // Estilos de secciones del formulario
  formSection: {
    marginBottom: "0.5rem",
    padding: "0.75rem",
    border: "1px solid #000000",
    borderRadius: "0.5rem",
    backgroundColor: "#f9f9f9",
    height: "fit-content",
  },
  formSectionRegistro: {
    flex: "1",
    marginBottom: "0.5rem",
    padding: "0.75rem",
    border: "1px solid #000000",
    borderRadius: "0.5rem",
    backgroundColor: "#f9f9f9",
    height: "fit-content",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#385792",
  },
  
   // Estilos de filas y grupos del formulario
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  formGroup: {
    flex: "1 1 auto",
    minWidth: "200px",
  },
  formGroupReg: {
    flex: "1 1 auto",
    minWidth: "70px",
    marginLeft: "0",
  },

  // Estilos de etiquetas e inputs
  formLabel: {
    display: "block",
    marginBottom: "3px",
    width: '100%',
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "capitalize",
    textAlign: "center",
  },
  formLabelRegistro: {
    fontSize: "1rem",
    marginBottom: "0rem",
    textAlign: "center",
    fontWeight: "500",
    color: "#000000",
  },
  formInput: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
  },
  formRegistro: {
    display: "block",
    width: "50%",
    padding: "0.5rem",
    margin: '0 auto',
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
    color: "#000000",
    fontWeight: "500",
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

   // Estilos para fechas
  dateInputs: {
    display: "flex",
    width: "100%",
    gap: "0.5rem",
  },
  dateInput: {
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem",
    width: '50%',
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },
  dateCeremonia: {
    display: "flex",
    justifyContent: 'center',
    width: "50%",
    gap: "0.5rem",
  },
  dateGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: "0.5rem",
  },
  dateLabel: {
    fontSize: "1rem",
    marginBottom: "0rem",
    textAlign: "center",
    fontWeight: "500",
    color: "#000000",
  },
  
  // Estilos para registro y ceremonia
  registroRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "12px",
  },
  registroGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: "0.5rem",
  },
  registroField: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: "0.5rem",
  },
  ceremoniaRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    marginTop: '16px',
  },
  ceremoniaGroup: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    textAlign: "center",
  },

  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  formSelect: {
    padding: "8px 12px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "0.9rem",
    minWidth: "150px",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    marginRight: "5px",
  },
  checkboxLabel: {
    fontSize: "0.9rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "20px",
  },
  buttonIcon: {
    width: "18px",
    height: "18px",
    fill: "black",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },

  noSelectionMessage: {
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "2rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    marginTop: "2rem",
  },
}

export default AñadirPartidas

