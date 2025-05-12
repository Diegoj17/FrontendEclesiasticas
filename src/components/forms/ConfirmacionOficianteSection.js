"use client"
import ComboBox from "../ui/ComboBox"

function ConfirmacionOficianteSection({
  formData,
  handleChange,
  sacerdotes = [],
  monsenores = [],
  testigos = [],
  loading = false,
  error = null,
  agregarSacerdote = () => {},
}) {
  // Valores predeterminados en caso de que no se proporcionen props
  const localSacerdotes = [
    "Padre José Martínez",
    "Padre Antonio López",
    "Padre Miguel Ángel Pérez",
    "Padre Francisco Rodríguez",
    "Padre Juan Carlos Gómez",
    "Otro",
  ]

  const localMonsenores = ["Monseñor Pedro Gómez", "Monseñor Luis Fernández", "Monseñor Carlos Herrera", "Otro"]

  const localTestigos = ["María González", "Juan Pérez", "Ana Rodríguez", "Carlos Sánchez", "Laura Martínez", "Otro"]

  // Usar los valores proporcionados o los valores predeterminados
  const sacerdotesList = sacerdotes.length > 0 ? sacerdotes : localSacerdotes
  const monsenoresList = monsenores.length > 0 ? monsenores : localMonsenores
  const testigosList = testigos.length > 0 ? testigos : localTestigos

  // Manejar el cambio en el ComboBox
  const handleComboBoxChange = (e) => {
    const { name, value } = e.target

    // Llamar al manejador de cambios original
    handleChange(e)

    // Si el valor no es "Otro" y no está en la lista, agregarlo
    if (value !== "Otro" && value.trim() !== "") {
      if (name === "confirmacion.sacerdote" && !sacerdotesList.includes(value)) {
        agregarSacerdote(value, "sacerdote")
      } else if (name === "confirmacion.monseñor" && !monsenoresList.includes(value)) {
        agregarSacerdote(value, "monsenor")
      } else if (name === "confirmacion.doyFe" && !testigosList.includes(value)) {
        agregarSacerdote(value, "testigo")
      }
    }
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Datos del Encargado de Celebrar la Ceremonia</h2>

      {loading ? (
        <div style={styles.loadingContainer}>Cargando lista de sacerdotes...</div>
      ) : error ? (
        <div style={styles.errorContainer}>{error}</div>
      ) : (
        <>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <ComboBox
                label="Monseñor"
                options={monsenoresList}
                value={formData.confirmacion?.monseñor || ""}
                onChange={handleComboBoxChange}
                placeholder="Seleccione o escriba el nombre"
                name="confirmacion.monseñor"
                fullWidth
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <ComboBox
                label="Sacerdote"
                options={sacerdotesList}
                value={formData.confirmacion?.oficiante || ""}
                onChange={handleComboBoxChange}
                placeholder="Seleccione o escriba el nombre"
                name="confirmacion.sacerdote"
                fullWidth
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <ComboBox
                label="Doy Fe"
                options={testigosList}
                value={formData.confirmacion?.doyFe || ""}
                onChange={handleComboBoxChange}
                placeholder="Seleccione o escriba el nombre"
                name="confirmacion.doyFe"
                fullWidth
              />
            </div>
          </div>
        </>
      )}
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
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
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
