"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"

const ComboBoxSacerdotes = ({
  label,
  value = "", // valor "oficial" (o "Otro")
  onChange, // para el valor "oficial"
  placeholder = "Seleccione un sacerdote...",
  name = "",
  onCustomValueChange, // sólo para el campo custom
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [showCustomInput, setShowCustomInput] = useState(value === "Otro")
  const [customValue, setCustomValue] = useState("")
  const containerRef = useRef(null)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar la lista de sacerdotes cuando se monta el componente
  useEffect(() => {
    const fetchSacerdotes = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No se encontró token de autenticación")
        }

        const response = await axios.get("https://actaseclesiasticas.koyeb.app/api/sacerdotes/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Transformar los datos de sacerdotes a un array de strings para el ComboBox
        // Asumiendo que cada sacerdote tiene un campo 'nombre' o similar
        const sacerdotesOptions = response.data.map(
          (sacerdote) => sacerdote.nombre || `${sacerdote.nombres || ""} ${sacerdote.apellidos || ""}`.trim(),
        )

        // Añadir la opción "Otro" al final
        sacerdotesOptions.push("Otro")

        setOptions(sacerdotesOptions)
        setLoading(false)
      } catch (err) {
        console.error("Error al cargar sacerdotes:", err)
        setError("No se pudieron cargar los sacerdotes")
        setLoading(false)
      }
    }

    fetchSacerdotes()
  }, [])

  // Cerrar dropdown clic fuera
  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current?.contains(e.target)) return
      setIsOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  useEffect(() => {
    // Si el valor real no está en las opciones
    if (value && options.length > 0 && !options.includes(value)) {
      setInputValue("Otro")
      setCustomValue(value)
      setShowCustomInput(true)
    }
  }, [value, options])

  const filtered = options.filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))

  const handleInputChange = (e) => {
    const v = e.target.value
    setInputValue(v)
    setIsOpen(true)
    // si el usuario está borrando o escribiendo algo distinto a "Otro", será valor normal
    setShowCustomInput(v === "Otro")
    onChange({ target: { name, value: v, isComboBox: true } })
  }

  const handleOptionSelect = (opt) => {
    if (opt === "Otro") {
      setInputValue("Otro") // Mostrar "Otro" en el input principal
      setShowCustomInput(true)
      onChange({ target: { name, value: "", isComboBox: true } }) // Resetear valor real
    } else {
      setInputValue(opt)
      setShowCustomInput(false)
      onChange({ target: { name, value: opt, isComboBox: true } })
    }
    setIsOpen(false)
  }

  const handleCustomChange = (e) => {
    const v = e.target.value
    setCustomValue(v)
    // Actualizar directamente el campo principal
    onChange({ target: { name, value: v, isComboBox: true } })
  }

  return (
    <div style={styles.container} ref={containerRef}>
      {label && (
        <label htmlFor={`combo-${name}`} style={styles.label}>
          {label}
        </label>
      )}
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          name={name}
          value={inputValue}
          placeholder={loading ? "Cargando sacerdotes..." : error ? "Error al cargar" : placeholder}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          style={styles.toggleButton}
          tabIndex={-1}
          disabled={loading}
        >
          ▼
        </button>
      </div>

      {isOpen && filtered.length > 0 && (
        <ul style={styles.dropdown}>
          {filtered.map((opt, i) => (
            <li
              key={i}
              onMouseDown={() => handleOptionSelect(opt)}
              style={styles.option}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}

      {showCustomInput && (
        <div style={styles.customInputContainer}>
          <input
            style={styles.customInput}
            type="text"
            name={`${name}_custom`}
            value={customValue}
            placeholder="Escriba aquí..."
            onChange={handleCustomChange}
            autoComplete="off"
          />
        </div>
      )}
    </div>
  )
}

// Estilos del ComboBox
const styles = {
  container: {
    position: "relative",
    width: "100%",
    marginBottom: "0.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#333",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #ccc",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    color: "#333",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  toggleButton: {
    position: "absolute",
    right: "0.5rem",
    background: "transparent",
    border: "none",
    fontSize: "0.8rem",
    color: "#666",
    cursor: "pointer",
    padding: "0",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    width: "100%",
    maxHeight: "200px",
    overflowY: "auto",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: "1000",
    listStyle: "none",
    padding: "0",
    margin: "0.25rem 0 0 0",
  },
  option: {
    padding: "0.5rem 0.75rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
    backgroundColor: "white",
  },
  customInputContainer: {
    width: "100%",
    marginTop: "0.5rem",
    display: "flex",
  },
  customInput: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #ccc",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    color: "#333",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
}

export default ComboBoxSacerdotes
