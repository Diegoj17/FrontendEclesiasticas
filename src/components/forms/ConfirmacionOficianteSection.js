import React from "react"
import ComboBox from "../ui/ComboBox"

function ConfirmacionOficianteSection({ formData, handleChange, monseñores, sacerdotes, testigos }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Datos del Encargado de Celebrar la Ceremonia</h2>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <ComboBox
            label="Monseñor que Oficia la Ceremonia"
            options={monseñores}
            value={formData.confirmacion.monseñor}
            onChange={handleChange}
            placeholder="Seleccione o escriba el nombre"
            name="confirmacion.monseñor"
          />
        </div>
      </div>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <ComboBox
            label="Párroco o Vicario"
            options={sacerdotes}
            value={formData.confirmacion.sacerdote}
            onChange={handleChange}
            placeholder="Seleccione o escriba el nombre"
            name="confirmacion.sacerdote"
          />
        </div>
      </div>
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <ComboBox
            label="Doy Fe"
            options={testigos}
            value={formData.confirmacion.doyFe}
            onChange={handleChange}
            placeholder="Seleccione o escriba el nombre"
            name="confirmacion.doyFe"
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
}

export default ConfirmacionOficianteSection
