import ComboBox from "../ui/ComboBoxSacerdotes"
import SacerdoteService from "../../services/SacerdoteService"
import { useState, useEffect } from "react"

function CommonOficianteSection({
  formData,
  handleChange,
  sacerdotes = [],
  testigos = [],
  loading: externalLoading = false,
  error: externalError = null,
  agregarSacerdote = () => {},
}) {
  const [loading, setLoading] = useState(externalLoading)
  const [error, setError] = useState(externalError)
  const [sacerdotesList, setSacerdotesList] = useState([])

  // Cargar sacerdotes al montar el componente
  useEffect(() => {
    const fetchSacerdotes = async () => {
      // Si ya tenemos sacerdotes proporcionados, usarlos
      if (sacerdotes.length > 0) {
        setSacerdotesList(sacerdotes)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const options = await SacerdoteService.getAllSacerdotes()
        setSacerdotesList(options)
      } catch (err) {
        console.error("Error al cargar sacerdotes:", err)
        setError("No se pudieron cargar los sacerdotes")
      } finally {
        setLoading(false)
      }
    }

    fetchSacerdotes()
  }, [sacerdotes])

  // Manejar el cambio en el ComboBox
  const handleComboBoxChange = (e) => {
    const { name, value } = e.target

    // Llamar al manejador de cambios original
    handleChange(e)

    // Si el valor no es "Otro" y no está en la lista, agregarlo
    if (value !== "Otro" && value.trim() !== "") {
      if (name === "oficiante" && !sacerdotesList.includes(value)) {
        agregarSacerdote(value, "sacerdote")
      } else if (name === "doyFe" && !sacerdotesList.includes(value)) {
        agregarSacerdote(value, "testigo")
      }
    }
  }

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Datos del Encargado de Celebrar la Ceremonia</h2>

      
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <ComboBox
                label="Sacerdote"
                options={sacerdotesList}
                value={formData.oficiante || ""}
                onChange={handleComboBoxChange}
                placeholder="Seleccione o escriba el nombre"
                name="oficiante"
              />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <ComboBox
                label="Doy Fe"
                options={sacerdotesList}
                value={formData.doyFe || ""}
                onChange={handleComboBoxChange}
                placeholder="Seleccione o escriba el nombre"
                name="doyFe"
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
    minWidth: "300px",
    marginBottom: "0.5rem",
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

export default CommonOficianteSection

