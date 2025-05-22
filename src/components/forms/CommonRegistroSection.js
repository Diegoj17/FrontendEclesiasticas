import React from 'react'

function CommonRegistroSection({ formData, handleChange }) {

  // Generar opciones para días, meses y años
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const añoActual = new Date().getFullYear();
  const años = Array.from({ length: 500 }, (_, i) => añoActual - i);

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

      <div style={styles.formRow}>
        {/* Fecha de Ceremonia */}
        <div style={styles.formGroup}>
          <label style={styles.formLabelCeremonia}>Fecha de la Ceremonia</label>
          <div style={styles.dateContainer}>
            <div style={styles.ceremoniaGroup}>
            <select
              name="fechaCeremonia.dia"
              value={formData.fechaCeremonia.dia}
              onChange={handleChange}
              style={styles.ceremoniaInput}
            >
            <option value="">Día</option>
              {dias.map((dia) => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
            </div>

            <div style={styles.ceremoniaGroup}>
            <select
              name="fechaCeremonia.mes"
              value={formData.fechaCeremonia.mes}
              onChange={handleChange}
              style={styles.ceremoniaInput}
            >
              <option value="">Mes</option>
              {meses.map((mes) => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
            </div>

            <div style={styles.ceremoniaGroup}>
            <select
              name="fechaCeremonia.año"
              value={formData.fechaCeremonia.año || ""}
              onChange={handleChange}
              style={styles.ceremoniaInput}
            >
              <option value="">Año</option>
              {años.map((año) => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
            </div>
        </div>
      </div>
    </div>
  </div>
  );
};

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
    marginBottom: "1.4rem",
    fontWeight: "700",
    color: "#385792",
    marginTop: "-0rem",
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
  dateContainer: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "0.5rem",
    width: "100%",
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
    padding: "0.5rem 1rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },
}

export default CommonRegistroSection

