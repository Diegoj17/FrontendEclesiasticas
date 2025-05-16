import ComboBoxSacerdotes from "../ui/ComboBoxSacerdotes"
const ConfirmacionOficianteSection = ({ formData, handleChange }) => {
  // Función modificada para manejar la selección de sacerdotes
  const handleSacerdoteChange = (e) => {
    const { name, value, sacerdoteData } = e.target

    // SOLUCIÓN: Actualizar múltiples campos para asegurar consistencia
    if (name === "oficiante") {
      // Actualizar tanto el campo principal como el campo en confirmacion
      handleChange({
        target: {
          name: "oficiante",
          value: value,
          isComboBox: true,
        },
      })

      // También actualizar nombresSacerdote para el backend
      handleChange({
        target: {
          name: "nombresSacerdote",
          value: value,
          isComboBox: true,
        },
      })

      // Actualizar el campo en confirmacion para mantener la UI consistente
      handleChange({
        target: {
          name: "confirmacion.sacerdote",
          value: value,
          isComboBox: true,
        },
      })
    }

    // Guardar tanto el nombre visible como los datos completos del sacerdote
    if (sacerdoteData) {
      console.log("Datos del sacerdote seleccionado:", sacerdoteData)
      // Guardar el ID del sacerdote si está disponible
      if (sacerdoteData.id) {
        handleChange({
          target: {
            name: "idSacerdote",
            value: sacerdoteData.id,
            isComboBox: true,
          },
        })
      }
    }

    // Siempre actualizar el nombre visible
    handleChange(e)
  }

  const handleDoyFeChange = (e) => {
    const { name, value, sacerdoteData } = e.target

    // SOLUCIÓN: Actualizar múltiples campos para asegurar consistencia
    if (name === "doyFe") {
      // Actualizar tanto el campo principal como el campo en confirmacion
      handleChange({
        target: {
          name: "doyFe",
          value: value,
          isComboBox: true,
        },
      })

      // También actualizar nombresDoyFe para el backend
      handleChange({
        target: {
          name: "nombresDoyFe",
          value: value,
          isComboBox: true,
        },
      })

      // Actualizar el campo en confirmacion para mantener la UI consistente
      handleChange({
        target: {
          name: "confirmacion.doyFe",
          value: value,
          isComboBox: true,
        },
      })
    }

    // Guardar tanto el nombre visible como los datos completos
    if (sacerdoteData) {
      console.log("Datos del Doy Fe seleccionado:", sacerdoteData)
      // Guardar el ID si está disponible
      if (sacerdoteData.id) {
        handleChange({
          target: {
            name: "idDoyFe",
            value: sacerdoteData.id,
            isComboBox: true,
          },
        })
      }
    }

    // Siempre actualizar el nombre visible
    handleChange(e)
  }

  const handleMonsenorChange = (e) => {
    const { name, value, sacerdoteData } = e.target

    // SOLUCIÓN: Actualizar múltiples campos para asegurar consistencia
    if (name === "confirmacion.monseñor") {
      // Actualizar el campo monseñor en confirmacion
      handleChange({
        target: {
          name: "confirmacion.monseñor",
          value: value,
          isComboBox: true,
        },
      })

      // También actualizar nombresmonsr para el backend
      handleChange({
        target: {
          name: "nombresmonsr",
          value: value,
          isComboBox: true,
        },
      })
    }

    // Guardar tanto el nombre visible como los datos completos
    if (sacerdoteData) {
      console.log("Datos del Monseñor seleccionado:", sacerdoteData)
      // Guardar el ID si está disponible
      if (sacerdoteData.id) {
        handleChange({
          target: {
            name: "idmonsr",
            value: sacerdoteData.id,
            isComboBox: true,
          },
        })
      }
    }

    // Siempre actualizar el nombre visible
    handleChange(e)
  }

  // Función para depurar el estado del formulario
  const debugFormData = () => {
    console.log("Estado actual del formData:", {
      oficiante: formData.oficiante,
      nombresSacerdote: formData.nombresSacerdote,
      doyFe: formData.doyFe,
      nombresDoyFe: formData.nombresDoyFe,
      nombresmonsr: formData.nombresmonsr,
      "confirmacion.monseñor": formData.confirmacion?.monseñor,
      "confirmacion.sacerdote": formData.confirmacion?.sacerdote,
      "confirmacion.doyFe": formData.confirmacion?.doyFe,
    })
  }

  // Ejecutar depuración cuando se renderiza el componente
  console.log("Renderizando ConfirmacionOficianteSection con formData:", formData)
  debugFormData()

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Datos del Encargado de Celebrar la Ceremonia</h2>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label htmlFor="confirmacion.monseñor" style={styles.label}>
          Monseñor  
          </label>
          <ComboBoxSacerdotes
            name="confirmacion.monseñor"
            value={formData.confirmacion?.monseñor || formData.nombresmonsr || ""}
            onChange={handleMonsenorChange}
            placeholder="Seleccione un monseñor..."
          />
          {/* Campo oculto para asegurar que el nombre se guarde correctamente */}
          <input
            type="hidden"
            name="nombresmonsr"
            value={formData.confirmacion?.monseñor || formData.nombresmonsr || ""}
          />
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label htmlFor="oficiante" style={styles.label}>
            Sacerdote
          </label>
          <ComboBoxSacerdotes
            name="oficiante"
            value={formData.oficiante || formData.nombresSacerdote || formData.confirmacion?.sacerdote || ""}
            onChange={handleSacerdoteChange}
            placeholder="Seleccione un sacerdote..."
          />
          {/* Campo oculto para asegurar que el nombre se guarde correctamente */}
          <input
            type="hidden"
            name="nombresSacerdote"
            value={formData.oficiante || formData.nombresSacerdote || formData.confirmacion?.sacerdote || ""}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="doyFe" style={styles.label}>
            Doy Fe
          </label>
          <ComboBoxSacerdotes
            name="doyFe"
            value={formData.doyFe || formData.nombresDoyFe || formData.confirmacion?.doyFe || ""}
            onChange={handleDoyFeChange}
            placeholder="Seleccione quien da fe..."
          />
          {/* Campo oculto para asegurar que el nombre se guarde correctamente */}
          <input
            type="hidden"
            name="nombresDoyFe"
            value={formData.doyFe || formData.nombresDoyFe || formData.confirmacion?.doyFe || ""}
          />
        </div>
      </div>
      
    </div>
  )
}

const styles = {
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
  sectionTitle: {
    fontSize: "1.1rem",
    padding: "0rem",
    marginBottom: "0.5rem",
    fontWeight: "700",
    color: "#385792",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0rem",
    marginBottom: "0.5rem",
    width: "100%",
  },
  formGroup: {
    flex: "1",
    minWidth: "100%",
  },
  loadingContainer: {
    padding: "1rem",
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
  errorContainer: {
    padding: "1rem",
    textAlign: "center",
    color: "#d32f2f",
    backgroundColor: "#ffebee",
    borderRadius: "0.25rem",
    marginBottom: "1rem",
  },
}

export default ConfirmacionOficianteSection
