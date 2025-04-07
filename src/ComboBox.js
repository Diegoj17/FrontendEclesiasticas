import { useState, useRef, useEffect } from "react"

const ComboBox = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Seleccionar o escribir...",
  className = "",
  name = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || "")
  const [filteredOptions, setFilteredOptions] = useState(options)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Filter options when input changes
  useEffect(() => {
    if (inputValue) {
      const filtered = options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options)
    }
  }, [inputValue, options])

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value || "")
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange({
      target: {
        name,
        value: newValue,
        type: "text",
      },
    })

    // Open dropdown when typing
    if (!isOpen && newValue) {
      setIsOpen(true)
    }
  }

  const handleOptionClick = (option) => {
    setInputValue(option)
    onChange({
      target: {
        name,
        value: option,
        type: "text",
      },
    })
    setIsOpen(false)
    inputRef.current.focus()
  }

  const handleInputFocus = () => {
    // Only open dropdown if there are options
    if (options.length > 0) {
      setIsOpen(true)
    }
  }

  const handleKeyDown = (e) => {
    // Close dropdown on Escape
    if (e.key === "Escape") {
      setIsOpen(false)
    }

    // Select option on Enter if dropdown is open
    if (e.key === "Enter" && isOpen && filteredOptions.length > 0) {
      handleOptionClick(filteredOptions[0])
      e.preventDefault()
    }

    // Toggle dropdown on Arrow Down
    if (e.key === "ArrowDown") {
      setIsOpen(true)
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
            <li key={index} onClick={() => handleOptionClick(option)} style={styles.option}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Inline styles
const styles = {
  container: {
    position: "relative",
    width: "100%",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    alignItems: "center",
    color: "#000000",
    fontWeight: "500",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  toggleButton: {
    position: "absolute",
    right: "0.5rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    fontSize: "0.75rem",
    color: "#6B7280",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.25rem",
    
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    width: "100%",
    maxHeight: "200px",
    overflowY: "auto",
    alignItems: "center",
    backgroundColor: "white",
    border: "1px solid #D1D5DB",
    borderRadius: "0.375rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    zIndex: "10",
    listStyle: "none",
    padding: "0.5rem 0",
    margin: "0.25rem 0 0 0",
  },
  option: {
    padding: "0.5rem 0.75rem",
    cursor: "pointer",
    alignItems: "center",
    transition: "background-color 0.2s ease",
    fontSize: "0.875rem",
    hover: {
      backgroundColor: "#F3F4F6",
    },
  },
}

export default ComboBox

