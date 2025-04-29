import { useState, useRef, useEffect } from "react";

const ComboBox = ({
  label,
  options = [],
  value = "",
  onChange,
  placeholder = "Seleccione o escriba...",
  name = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Cada vez que cambia la prop value, sincronizo el state interno
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Cerrar dropdown al clicar fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar opciones
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e) => {
    const v = e.target.value;
    setInputValue(v);
    onChange({
      target: { name, value: v, type: "text", isComboBox: true },
    });
    setIsOpen(true);
  };

  const handleOptionSelect = (opt) => {
    setInputValue(opt);
    onChange({
      target: { name, value: opt, type: "text", isComboBox: true },
    });
    setIsOpen(false);
    inputRef.current.focus();
  };

  return (
    <div style={{ position: "relative", width: "100%", marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={`combo-${name}`}
          style={{ display: "block", marginBottom: "0.25rem" }}
        >
          {label}
        </label>
      )}
      <input
        id={`combo-${name}`}
        ref={inputRef}
        type="text"
        name={name}
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        style={{
          width: "100%",
          padding: "0.5rem 2rem 0.5rem 0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "0.8rem",
        }}
        tabIndex={-1}
      >
        ▼
      </button>

      {isOpen && filtered.length > 0 && (
        <ul
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "200px",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "0.25rem",
            listStyle: "none",
            padding: 0,
            zIndex: 1000,
          }}
        >
          {filtered.map((opt, i) => (
            <li
              key={i}
              onMouseDown={() => handleOptionSelect(opt)}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Estilos actualizados
const styles = {
  container: {
    position: "relative",
    width: "100%",
    marginBottom: "1rem",
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
}

export default ComboBox
