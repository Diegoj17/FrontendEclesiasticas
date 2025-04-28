import { useState, useRef, useEffect } from "react";

const ComboBox = ({
  label,
  options = [],
  onChange,
  placeholder = "Seleccione o escriba...",
  className = "",
  name = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filtrar opciones al escribir
  useEffect(() => {
    if (inputValue) {
      setFilteredOptions(
        options.filter(o =>
          o.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [inputValue, options]);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const onClickOutside = e => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleInputChange = e => {
    setInputValue(e.target.value);
    onChange({
      target: {
        name,
        value: e.target.value,
        type: "text",
        isComboBox: true
      }
    });
    setIsOpen(true);
  };

  const handleOptionClick = option => {
    setInputValue(option);
    onChange({
      target: {
        name,
        value: option,
        type: "text",
        isComboBox: true
      }
    });
    setIsOpen(false);
    inputRef.current.focus();
  };

  // Evito cerrar al blur para poder seguir tecleando
  // const handleInputBlur = () => { /* ya no lo uso */ };

  const handleKeyDown = e => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" && isOpen && filteredOptions.length) {
      handleOptionClick(filteredOptions[0]);
      e.preventDefault();
    }
  };

  return (
    <div className={`combobox-container ${className}`} style={{ position: "relative", width: "100%", marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", marginBottom: "0.5rem" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          style={{ width: "100%", padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px" }}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setIsOpen(open => !open)}
          style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer" }}
          tabIndex={-1}
        >
          ▼
        </button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
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
            zIndex: 1000,
            padding: 0,
            listStyle: "none"
          }}
        >
          {filteredOptions.map((opt, i) => (
            <li
              key={i}
              onClick={() => handleOptionClick(opt)}
              style={{ padding: "0.5rem", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f5")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
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
    padding: "0.6rem 0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "0.9rem",
    color: "#333",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    "&:focus": {
      outline: "2px solid #385792",
      borderColor: "transparent",
    },
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
    borderTop: "none",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
