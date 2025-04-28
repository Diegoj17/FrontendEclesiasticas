import { useState, useEffect } from "react"
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
  FaTimes,
} from "react-icons/fa"
import { useActas } from "./ActaContext"


function AñadirPartidas() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [eventoSeleccionado, setEventoSeleccionado] = useState("")
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [errores, setErrores] = useState({});

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
  } // Ensure this closing brace matches the corresponding opening brace

  const [formData, setFormData] = useState(initialFormData)
  const [showModal, setShowModal] = useState(false)
  
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

  const { 
    actasTemporales,
    actasConfirmadas,
    confirmarActas,
    actaEditando,
    setActaEditando,
    modoEdicion,
    setModoEdicion,
    actualizarActaTemporal,
    cancelarEdicion,
    agregarActaTemporal,
    setActasTemporales,
  } = useActas();

  const validarCampos = () => {
    const nuevosErrores = {};
    
    // Validar campos comunes
    if (!formData.libro) nuevosErrores.libro = "El libro es requerido";
    if (!formData.folio) nuevosErrores.folio = "El folio es requerido";
    if (!formData.acta) nuevosErrores.acta = "El acta es requerida";
    
    // Validar según tipo de ceremonia
    switch(eventoSeleccionado) {
      case "Bautismo":
        if (!formData.bautismo.primerNombre) nuevosErrores.primerNombre = "El primer nombre es requerido";
        if (!formData.bautismo.primerApellido) nuevosErrores.primerApellido = "El primer apellido es requerido";
        break;
        
      case "Confirmación":
        if (!formData.confirmacion.primerNombre) nuevosErrores.primerNombre = "El primer nombre es requerido";
        break;
        
      case "Matrimonio":
        if (!formData.matrimonio.novio.primerNombre) nuevosErrores.novioNombre = "El nombre del novio es requerido";
        break;
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      setShowModal(true); // Mostrar modal de errores
      return;
    }

    const actaCompleta = {
      ...formData,
      tipo: eventoSeleccionado,
      id: actaEditando?.id || Date.now(),
      fechaCreacion: actaEditando?.fechaCreacion || new Date().toISOString(),
      confirmado: false,
    };

    if (modoEdicion) {
      // Si estamos editando, actualizamos el acta existente
      actualizarActaTemporal(actaCompleta);
      navigate("/listaActas");
    } else {
      // Si es nueva, la agregamos a las actas temporales
      agregarActaTemporal(actaCompleta);
      setShowModal(true);
    }

    if (!modoEdicion) {
      setFormData(initialFormData);
      setEventoSeleccionado("");
    }

    // Resetear el formulario
    setFormData(initialFormData);
    setEventoSeleccionado("");
    
    // Desactivar el modo edición
    setModoEdicion(false);
    setActaEditando(null);
  }

  const ErrorMessage = ({ mensaje }) => (
    <span style={styles.errorText}>{mensaje}</span>
  );

  useEffect(() => {
  if (actaEditando && modoEdicion) {
    // Hacer una copia profunda del acta
    const actaCopia = JSON.parse(JSON.stringify(actaEditando));
    
    // Asegurar que todos los campos anidados existan
    const mergedData = {
      ...initialFormData,
      ...actaCopia,
      bautismo: {...initialFormData.bautismo, ...actaCopia.bautismo},
      confirmacion: {...initialFormData.confirmacion, ...actaCopia.confirmacion},
      matrimonio: {...initialFormData.matrimonio, ...actaCopia.matrimonio}
    };
    
    setFormData(mergedData);
    setEventoSeleccionado(actaCopia.tipo);
  }
}, [actaEditando, modoEdicion]);
  
  

  const handleEventoChange = (e) => {
    const nuevoEvento = e.target.value;
    setEventoSeleccionado(nuevoEvento);
    
    // Solo resetear el formulario si NO estamos en modo edición
    if (!modoEdicion) {
      setFormData(initialFormData);
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleViewRegistros = () => {
    navigate("/vistaActas")
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

  const handleList = () => {
    navigate("/listaActas")
  }

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
    if (!menuAbierto) {
      setIsSubmenuOpen(false)
    }
  }

  const handleEditProfile = () => {
    console.log("Navegando a editar perfil") // Agregamos un log para depuración
    setIsDropdownOpen(false) // Cerramos el dropdown
    navigate("/editarPerfil") // Navegamos a la ruta correcta
  }
  

  // Componente para la sección común de registro (libro, folio, acta)
  const CommonRegistroSection = () => (
    <div style={styles.section}>
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
      <div style={styles.ceremoniaContainer}>
      <label style={styles.formLabelCeremonia}>Fecha de la Ceremonia</label>
      <div style={styles.ceremoniaRow}>
        <div style={styles.ceremoniaGroup}>
          <label style={styles.ceremoniaLabel}>Día</label>
            <input
                type="text"
                name="fechaCeremonia.dia"
                value={formData.fechaCeremonia.dia}
                onChange={handleChange}
                style={styles.ceremoniaInput}
              />
            </div>
            <div style={styles.ceremoniaGroup}>
              <label style={styles.ceremoniaLabel}>Mes</label>
              <input
                type="text"
                name="fechaCeremonia.mes"
                value={formData.fechaCeremonia.mes}
                onChange={handleChange}
                style={styles.ceremoniaInput}
              />
            </div>
            <div style={styles.ceremoniaGroup}>
              <label style={styles.ceremoniaLabel}>Año</label>
              <input
                type="text"
                name="fechaCeremonia.año"
                value={formData.fechaCeremonia.año}
                onChange={handleChange}
                style={styles.ceremoniaInput}
              />
            </div>
          </div>
        </div>
      </div>
  )

  // Componente para la sección común del oficiante
  const CommonOficianteSection = () => (
    <div style={styles.section}>
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
    <div style={styles.section}>
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
                {/* Fecha de Nacimiento */}
              <div style={{ ...styles.nacimientoDatosContainer, flex: 1 }}>
              <label style={styles.formLabelNacimiento}>Fecha de Nacimiento</label>
                <div style={styles.nacimientoRow}>
                <div style={styles.nacimientoGroup}>
                  <label style={styles.nacimientoDatosLabel}>Dia</label>
                    <input
                      type="text"
                      name="bautismo.fechaNacimiento.dia"
                      placeholder="Día"
                      value={formData.bautismo.fechaNacimiento.dia}
                      onChange={handleChange}
                      style={styles.nacimientoInput}
                    />
                  </div>
                  <div style={styles.nacimientoGroup}>
                  <label style={styles.nacimientoDatosLabel}>Mes</label>
                    <input
                      type="text"
                      name="bautismo.fechaNacimiento.mes"
                      placeholder="Mes"
                      value={formData.bautismo.fechaNacimiento.mes}
                      onChange={handleChange}
                      style={styles.nacimientoInput}
                    />
                  </div>
                  <div style={styles.nacimientoGroup}>
                  <label style={styles.nacimientoDatosLabel}>Año</label>
                    <input
                      type="text"
                      name="bautismo.fechaNacimiento.año"
                      placeholder="Año"
                      value={formData.bautismo.fechaNacimiento.año}
                      onChange={handleChange}
                      style={styles.nacimientoInput}
                    />
                  </div>
                </div>
                </div>
                <div style={{ ...styles.lugarNacimientoContainer, flex: 1 }}>
                <div style={styles.formRow}>
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
                  {/* Fecha de Bautizo */}
                  <div style={{ ...styles.bautizoDatosContainer, flex: 1 }}>
                    <label style={styles.formLabelBautizo}>Fecha De Bautizo</label>
                      <div style={styles.bautizoDatosRow}>
                        <div style={styles.bautizoDatosGroup}>
                        <label style={styles.bautizoDatosLabel}>Día</label>
                      <input
                        type="text"
                        name="confirmacion.fechaNacimiento.dia"
                        value={formData.confirmacion.fechaNacimiento.dia || "" }
                        onChange={handleChange}
                        style={styles.bautizoDatosInput}
                      />
                      </div>
                      <div style={styles.bautizoDatosGroup}>
                        <label style={styles.bautizoDatosLabel}>Mes</label>
                      <input
                        type="text"
                        name="confirmacion.fechaNacimiento.mes"
                        value={formData.confirmacion.fechaNacimiento.mes}
                        onChange={handleChange}
                        style={styles.bautizoDatosInput}
                      />
                      </div>
                      <div style={styles.bautizoDatosGroup}>
                      <label style={styles.bautizoDatosLabel}>Año</label>
                      <input
                        type="text"
                        name="confirmacion.fechaNacimiento.año"
                        value={formData.confirmacion.fechaNacimiento.año}
                        onChange={handleChange}
                        style={styles.bautizoDatosInput}
                      />
                      </div>
                    </div>
                  </div>

                  {/* Datos de Acta de Bautizo */}
                  <div style={{ ...styles.bautizoDatosContainer, flex: 1 }}>
                    <label style={styles.formLabelBautizo}>Datos De Acta De Bautizo</label>
                    <div style={styles.bautizoDatosRow}>
                      <div style={styles.bautizoDatosGroup}>
                        <label style={styles.bautizoDatosLabel}>Libro</label>
                        <input
                          type="text"
                          name="confirmacion.libroBautizo"
                          value={formData.confirmacion.libroBautizo || ""}
                          onChange={handleChange}
                          style={styles.bautizoDatosInput}
                        />
                      </div>
                      <div style={styles.bautizoDatosGroup}>
                        <label style={styles.bautizoDatosLabel}>Folio</label>
                        <input
                          type="text"
                          name="confirmacion.folioBautizo"
                          value={formData.confirmacion.folioBautizo || ""}
                          onChange={handleChange}
                          style={styles.bautizoDatosInput}
                        />
                      </div>
                      <div style={styles.bautizoDatosGroup}>
                        <label style={styles.bautizoDatosLabel}>Acta</label>
                        <input
                          type="text"
                          name="confirmacion.actaBautizo"
                          value={formData.confirmacion.actaBautizo || ""}
                          onChange={handleChange}
                          style={styles.bautizoDatosInput}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nueva fila: Lugar de Bautizo + Diócesis */}
                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.formLabel}>Lugar De Bautizo</label>
                    <ComboBox
                      options={ciudadesColombia}
                      value={formData.confirmacion.lugarNacimiento}
                      onChange={handleChange}
                      placeholder="Seleccione o escriba la ciudad"
                      name="confirmacion.lugarNacimiento"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ ...styles.formGroup, flex: 1, marginLeft: '1rem' }}>
                    <label style={styles.formLabel}>Diócesis Donde Fue Bautizado</label>
                    <ComboBox
                      options={ciudadesColombia}
                      value={formData.confirmacion.diocesis}
                      onChange={handleChange}
                      placeholder="Seleccione o escriba la diócesis"
                      name="confirmacion.diocesis"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
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
                <div style={{ ...styles.fechaNacimientoContainer, flex: 1 }}>
                <label style={styles.formLabelNacimiento}>Fecha de Nacimiento</label>
                <div style={styles.fechaNacimientoRow}>
                <div style={styles.fechaNacimientoGroup}>
                <label style={styles.fechaNacimientoLabel}>Dia</label>
                    <input
                      type="text"
                      name="matrimonio.novio.fechaNacimiento.dia"
                      value={formData.matrimonio.novio.fechaNacimiento.dia}
                      onChange={handleChange}
                      style={styles.fechaNacimientoInput}
                    />
                  </div>
                    <div style={styles.fechaNacimientoGroup}>
                    <label style={styles.fechaNacimientoLabel}>Mes</label>
                    <input
                      type="text"
                      name="matrimonio.novio.fechaNacimiento.mes"
                      value={formData.matrimonio.novio.fechaNacimiento.mes}
                      onChange={handleChange}
                      style={styles.fechaNacimientoInput}
                    />
                  </div>
                    <div style={styles.fechaNacimientoGroup}>
                    <label style={styles.fechaNacimientoLabel}>Año</label>
                    <input
                      type="text"
                      name="matrimonio.novio.fechaNacimiento.año"
                      value={formData.matrimonio.novio.fechaNacimiento.año}
                      onChange={handleChange}
                      style={styles.fechaNacimientoInput}
                    />
                  </div>
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
              <div style={{ ...styles.bautizoDatosContainer, flex: 1 }}>
                    <label style={styles.formLabelBautizo}>Datos De Acta De Bautizo</label>
                    <div style={styles.bautizoDatosRow}>
                      <div style={styles.bautizoDatosGroup}>
                        <label style={styles.bautizoDatosLabel}>Libro</label>
                        <input
                          type="text"
                          name="confirmacion.libroBautizo"
                          value={formData.confirmacion.libroBautizo || ""}
                          onChange={handleChange}
                          style={styles.bautizoDatosInput}
                        />
                      </div>
                      <div style={styles.bautizoDatosGroup}>
                        <label style={styles.bautizoDatosLabel}>Folio</label>
                        <input
                          type="text"
                          name="confirmacion.folioBautizo"
                          value={formData.confirmacion.folioBautizo || ""}
                          onChange={handleChange}
                          style={styles.bautizoDatosInput}
                        />
                      </div>
                      <div style={styles.bautizoDatosGroup}>
                        <label style={styles.bautizoDatosLabel}>Acta</label>
                        <input
                          type="text"
                          name="confirmacion.actaBautizo"
                          value={formData.confirmacion.actaBautizo || ""}
                          onChange={handleChange}
                          style={styles.bautizoDatosInput}
                        />
                      </div>
                    </div>
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
                title="Vista de Actas"
              >
                <FaFileAlt style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Vista de Actas</span>}
              </button>

              <button
                onClick={handleSearch}
                style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                title="Buscar Actas"
              >
                <FaSearch style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Buscar Actas</span>}
              </button>

              <button
                onClick={handleAdd}
                style={{
                  ...styles.sidebarIconButton,
                  justifyContent: menuAbierto ? "flex-start" : "center",
                }}
                title="Añadir Actas"
              >
                <FaFileMedical style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Añadir Actas</span>}
              </button>

              <button
                onClick={handleCorrect}
                style={{ ...styles.sidebarIconButton, justifyContent: menuAbierto ? "flex-start" : "center" }}
                title="Corregir Actas"
              >
                <FaEdit style={styles.icon} />
                {menuAbierto && <span style={styles.buttonText}>Corregir Actas</span>}
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
            <div style={styles.filtroLeft}>
              <label htmlFor="evento" style={styles.label}>
                Seleccionar Tipo de Ceremonia:
              </label>
              <select id="evento" value={eventoSeleccionado} onChange={handleEventoChange} style={styles.select}>
                <option value=""></option>
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
                <CommonRegistroSection/>

                {/* Sección de oficiante según el tipo de ceremonia */}
                {eventoSeleccionado === "Confirmación"
                ? <ConfirmacionOficianteSection/>
                : <CommonOficianteSection/>
                }
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
    height: "100vh",
    overflow: "hidden",
    cursor: "default",
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
    ":hover": {
      backgroundColor: "#e9ecef",
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
    display: "flex",
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
    ":hover": {
      backgroundColor: "#ffffff",
      color: "#ffffff",
      transform: "translateX(2px)",
      boxShadow: "inset 4px 0 0 0rgb(16, 18, 19)",
    },
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
    ":hover": {
      backgroundColor: "#ffffff",
    },
  },
  dropdownIcon: {
    marginRight: "0.75rem",
    color: "#ffffff",
    transition: "color 0.2s ease",
    ":hover": {
      color: "#495057",
      transform: "scale(1.1)",
    },
  },
  dropdownIconText: {
    color: "#ffffff",
  },
  divider: {
    height: "1px",
    backgroundColor: "#ffffff",
    margin: "0.25rem 0",
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
    opacity: 1,
    ":disabled": {
      backgroundColor: "#e0e0e0",
      cursor: "not-allowed",
      opacity: 0.6,
    },
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    gap: "35rem",
  },
  filtroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0rem",
  },
  topButtonContainer: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
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
    cursor: "pointer",
  },

  // Estilos del formulario
  form: {
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    padding: "1rem",
  },
  topSectionsContainer: {
    display: "flex",
    gap: "20px",
    flexDirection: "row",
    marginBottom: "20px",
    width: "100%",
    alignItems: "stretch",
  },

  // Estilos de secciones del formulario
  section: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    padding: "0.75rem",
    border: "1px solid #000000",
    borderRadius: "0.5rem",
    backgroundColor: "#f9f9f9",
    width: "100%",
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
  formSectionRegistro: {
    flex: "1",
    display: "flex",
    marginBottom: "0.5rem",
    padding: "0.75rem",
    border: "1px solid #000000",
    borderRadius: "0.5rem",
    backgroundColor: "#f9f9f9",
    width: "100%",
    flexDirection: "column",
    height: "100%",
    alignSelf: "stretch",
  },
  formSectionOficiante: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    padding: "0.75rem 0.5rem",
    border: "1px solid #000000",
    borderRadius: "0.5rem",
    backgroundColor: "#f9f9f9",
    marginBottom: "0.5rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    padding: "0rem 0.5rem",
    marginBottom: "0.5rem",
    fontWeight: "700",
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
    width: "100%",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "capitalize",
    textAlign: "center",
  },
  formInput: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
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

  // Estilos para los datos de registro
  registroRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  registroGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  formLabelRegistro: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  formRegistro: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },

  // Estilos para los datos de la ceremonia
  ceremoniaDatosContainer: {
    marginTop: "0.5rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formLabelCeremonia: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  ceremoniaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  ceremoniaGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  ceremoniaLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  ceremoniaInput: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },

  // Estilos para los datos de nacimiento
  lugarNacimientoContainer: {
    marginTop: "0.5rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  fechaNacimientoContainer: {
    marginTop: "0.5rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  nacimientoDatosContainer: {
    marginTop: "0.5rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formLabelNacimiento: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  nacimientoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  fechaNacimientoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  nacimientoGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  fechaNacimientoGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  nacimientoDatosLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  fechaNacimientoLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  nacimientoDatosInput: {
    width: "100%",
    alignItems: "center",
    padding: "0.5rem 0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },
  fechaNacimientoInput: {
    width: "100%",
    alignItems: "center",
    padding: "0.5rem 0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },

  // Estilos para los datos de acta de bautizo
  bautizoDatosContainer: {
    marginTop: "0.5rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formLabelBautizo: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  bautizoDatosRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  bautizoDatosGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  bautizoDatosLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  bautizoDatosInput: {
    width: "100%",
    alignItems: "center",
    padding: "0.5rem 0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },
}

export default AñadirPartidas

