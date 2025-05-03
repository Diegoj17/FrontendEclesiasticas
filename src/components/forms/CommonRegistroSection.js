import React from 'react'

function CommonRegistroSection({ formData, handleChange }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Datos de Registro</h2>
      <div style={styles.registroRow}>
        <div style={styles.registroGroup}>
          <label style={styles.formLabelRegistro}>Libro</label>
          <input type="text" name="libro" value={formData.libro} onChange={handleChange} style={styles.formRegistro} />
        </div>
        <div style={styles.registroGroup}>
          <label style={styles.formLabelRegistro}>Folio</label>
          <input type="text" name="folio" value={formData.folio} onChange={handleChange} style={styles.formRegistro} />
        </div>
        <div style={styles.registroGroup}>
          <label style={styles.formLabelRegistro}>Acta</label>
          <input type="text" name="acta" value={formData.acta} onChange={handleChange} style={styles.formRegistro} />
        </div>
      </div>
      <div style={styles.ceremoniaContainer}>
        <label style={styles.formLabelCeremonia}>Fecha de la Ceremonia</label>
        <div style={styles.ceremoniaRow}>
          <div style={styles.ceremoniaGroup}>
            <label style={styles.ceremoniaLabel}>Día</label>
            <input
              type="text"
              name="fechaCeremonia.dia"
              value={formData.fechaCeremonia.dia}
              onChange={handleChange}
              style={styles.ceremoniaInput}
            />
          </div>
          <div style={styles.ceremoniaGroup}>
            <label style={styles.ceremoniaLabel}>Mes</label>
            <input
              type="text"
              name="fechaCeremonia.mes"
              value={formData.fechaCeremonia.mes}
              onChange={handleChange}
              style={styles.ceremoniaInput}
            />
          </div>
          <div style={styles.ceremoniaGroup}>
            <label style={styles.ceremoniaLabel}>Año</label>
            <input
              type="text"
              name="fechaCeremonia.año"
              value={formData.fechaCeremonia.año}
              onChange={handleChange}
              style={styles.ceremoniaInput}
            />
          </div>
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
  registroRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  registroGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  formLabelRegistro: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  formRegistro: {
    width: "100%",
    alignItems: "center",
    padding: "0.5rem 0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },
  ceremoniaContainer: {
    marginTop: "0.5rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formLabelCeremonia: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  ceremoniaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  ceremoniaGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  ceremoniaLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  ceremoniaInput: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },
}

export default CommonRegistroSection

