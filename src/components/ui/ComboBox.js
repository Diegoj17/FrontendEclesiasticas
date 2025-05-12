import { useState, useRef, useEffect } from "react"

const ComboBox = ({
  label,
  options = [],
  value = "",
  onChange,
  placeholder = "Seleccione o escriba...",
  name = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customValue, setCustomValue] = useState("")
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const customInputRef = useRef(null)

  // Cada vez que cambia la prop value, sincronizo el state interno
  useEffect(() => {
    setInputValue(value)
    // Si el valor es "Otro", mostrar el campo personalizado
    setShowCustomInput(value === "Otro")
  }, [value])

  // Cerrar dropdown al clicar fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        (!customInputRef.current || !customInputRef.current.contains(e.target))
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Enfocar el campo personalizado cuando se muestra
  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus()
    }
  }, [showCustomInput])

  // Filtrar opciones
  const filtered = options.filter((opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))

  const handleInputChange = (e) => {
    const v = e.target.value
    setInputValue(v)
    onChange({
      target: { name, value: v, type: "text", isComboBox: true },
    })
    setIsOpen(true)
  }

  const handleOptionSelect = (opt) => {
    setInputValue(opt)
    onChange({
      target: { name, value: opt, type: "text", isComboBox: true },
    })

    // Si selecciona "Otro", mostrar el campo personalizado
    if (opt === "Otro") {
      setShowCustomInput(true)
      setCustomValue("")
    } else {
      setShowCustomInput(false)
    }

    setIsOpen(false)
    inputRef.current.focus()
  }

  const handleCustomInputChange = (e) => {
    const v = e.target.value
    setCustomValue(v)
    // Actualizar el valor real que se enviará al formulario
    onChange({
      target: { name, value: v, type: "text", isComboBox: true },
    })
  }

  return (
    <div style={styles.container}>
      {label && (
        <label htmlFor={`combo-${name}`} style={styles.label}>
          {label}
        </label>
      )}
      <div style={styles.inputContainer}>
        <input
          id={`combo-${name}`}
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          style={styles.input}
          autoComplete="off"
        />
        <button type="button" onClick={() => setIsOpen((o) => !o)} style={styles.toggleButton} tabIndex={-1}>
          ▼
        </button>
      </div>

      {isOpen && filtered.length > 0 && (
        <ul ref={dropdownRef} style={styles.dropdown}>
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
            ref={customInputRef}
            type="text"
            value={customValue}
            onChange={handleCustomInputChange}
            placeholder="Escriba el nombre..."
            style={styles.customInput}
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


export default ComboBox
