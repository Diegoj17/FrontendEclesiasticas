"use client"

const Modal = ({ title, message, onClose, type = "info" }) => {
  // Determinar el color del encabezado según el tipo
  const getHeaderColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50"
      case "error":
        return "#F44336"
      case "warning":
        return "#FF9800"
      default:
        return "#2196F3"
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={{ ...styles.header, backgroundColor: getHeaderColor() }}>
          <h3 style={styles.title}>{title}</h3>
        </div>
        <div style={styles.content}>
          <p style={styles.message}>{message}</p>
        </div>
        <div style={styles.footer}>
          <button onClick={onClose} style={{ ...styles.button, backgroundColor: getHeaderColor() }}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    width: "400px",
    maxWidth: "90%",
    overflow: "hidden",
  },
  header: {
    padding: "1rem",
    color: "white",
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
  },
  content: {
    padding: "1.5rem",
  },
  message: {
    margin: 0,
    fontSize: "1rem",
  },
  footer: {
    padding: "1rem",
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
}

export default Modal
