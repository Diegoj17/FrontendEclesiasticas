import { useState, useRef, useEffect } from "react";

const ComboBox = ({
  label,
  options = [],
  value = "",                    // valor “oficial” (o “Otro”)
  onChange,                      // para el valor “oficial”
  placeholder = "Seleccione...",
  name = "",
  onCustomValueChange,
  loadOptions, // función para cargar opciones dinámicamente
  autoLoadOptions = false,           // sólo para el campo custom
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [showCustomInput, setShowCustomInput] = useState(value === "Otro");
  const [customValue, setCustomValue] = useState("");
  const containerRef = useRef(null);
  const [localOptions, setLocalOptions] = useState(options)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar opciones dinámicamente si se proporciona loadOptions
  useEffect(() => {
    if (autoLoadOptions && loadOptions && typeof loadOptions === "function") {
      const fetchOptions = async () => {
        try {
          setLoading(true)
          setError(null)
          const fetchedOptions = await loadOptions()
          setLocalOptions(fetchedOptions)
          setLoading(false)
        } catch (err) {
          console.error("Error al cargar opciones:", err)
          setError("No se pudieron cargar las opciones")
          setLoading(false)
        }
      }

      fetchOptions()
    }
  }, [loadOptions, autoLoadOptions])

  // Actualizar opciones locales cuando cambian las props
  useEffect(() => {
    if (options && options.length > 0) {
      setLocalOptions(options)
    }
  }, [options])

  // Sincroniza sólo inputValue => cuando cambia la prop `value`
  /*
  useEffect(() => {
    setInputValue(value);
    setShowCustomInput(value === "Otro");
  }, [value]);
  */

  // Cerrar dropdown clic fuera
  useEffect(() => {
    const onClick = e => {
      if (containerRef.current?.contains(e.target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = localOptions.filter(
    (opt) => opt.toLowerCase().includes(inputValue.toLowerCase()))

  const handleInputChange = e => {
    const v = e.target.value;
    setInputValue(v);
    setIsOpen(true);
    // si el usuario está borrando o escribiendo algo distinto a “Otro”, será valor normal
    setShowCustomInput(v === "Otro");
    onChange({ target: { name, value: v, isComboBox: true } });
  };

  const handleOptionSelect = (opt) => {
    if (opt === "Otro") {
      setInputValue("Otro"); // Mostrar "Otro" en el input principal
      setShowCustomInput(true);
      onChange({ target: { name, value: "", isComboBox: true }}); // Resetear valor real
    } else {
      setInputValue(opt);
      setShowCustomInput(false);
      onChange({ target: { name, value: opt, isComboBox: true } });
    }
    setIsOpen(false);
  };

  const handleCustomChange = (e) => {
    const v = e.target.value;
    setCustomValue(v);
    // Actualizar directamente el campo principal
    onChange({ target: { name, value: v, isComboBox: true} }); 
  };

  useEffect(() => {
    // Si el valor real no está en las opciones
    if (value && localOptions.length > 0 && !localOptions.includes(value)) {
      setInputValue("Otro")
      setCustomValue(value)
      setShowCustomInput(true)
    }
  }, [value, localOptions])

  return (
    <div style={styles.container}>
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
          placeholder={
            loading ? "Cargando..." : error ? "Error al cargar" : placeholder}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          disabled={loading}
        />
        <button 
          type="button" 
          onClick={() => setIsOpen((o) => !o)} 
          style={styles.toggleButton} 
          tabIndex={-1}>
          disabled={loading}
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


export default ComboBox
