"use client"

import { useState, useRef, useEffect } from "react"

const ComboBox = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Seleccione o escriba...",
  className = "",
  name = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || "")
  const [filteredOptions, setFilteredOptions] = useState(options)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (inputValue) {
      const filtered = options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options)
    }
  }, [inputValue, options])

  useEffect(() => {
    setInputValue(value || "")
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange({
      target: {
        name,
        value: newValue,
        type: "text",
        isComboBox: true,
      },
    })
    setIsOpen(true) // Forzar apertura al escribir
  }

  const handleOptionClick = (option) => {
    setInputValue(option)
    onChange({
      target: {
        name,
        value: option,
        type: "text",
        isComboBox: true,
      },
    })
    setIsOpen(false)
    inputRef.current.focus()
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!document.activeElement?.closest(".combobox-container")) {
        setIsOpen(false)
      }
    }, 200)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }

    if (e.key === "Enter" && isOpen && filteredOptions.length > 0) {
      handleOptionClick(filteredOptions[0])
      e.preventDefault()
    }
  }

  return (
    <div className={`combobox-container ${className}`} style={styles.container}>
      {label && (
        <label htmlFor={`combobox-${name}`} style={styles.label}>
          {label}
        </label>
      )}
      <div style={styles.inputContainer}>
        <input
          id={`combobox-${name}`}
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={styles.input}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={styles.toggleButton}
          tabIndex="-1"
          aria-label="Toggle options"
        >
          ▼
        </button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul ref={dropdownRef} style={styles.dropdown}>
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              style={styles.option}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

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
