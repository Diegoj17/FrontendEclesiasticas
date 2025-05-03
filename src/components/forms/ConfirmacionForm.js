import React from "react"
import ComboBox from "../../components/ui/ComboBox"

function ConfirmacionForm({ formData, handleChange, ciudadesColombia }) {
  return (
    <>
      {/* Datos del confirmado */}
      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Datos del Confirmado</h2>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Nombre</label>
            <input
              type="text"
              name="confirmacion.primerNombre"
              value={formData.confirmacion.primerNombre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Nombre</label>
            <input
              type="text"
              name="confirmacion.segundoNombre"
              value={formData.confirmacion.segundoNombre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Apellido</label>
            <input
              type="text"
              name="confirmacion.primerApellido"
              value={formData.confirmacion.primerApellido}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Apellido</label>
            <input
              type="text"
              name="confirmacion.segundoApellido"
              value={formData.confirmacion.segundoApellido}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>

        {/* Nueva fila: Lugar de Bautizo + Diócesis */}
        <div style={styles.formRow}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.formLabel}>Lugar De Bautizo</label>
            <ComboBox
              options={ciudadesColombia}
              value={formData.confirmacion.lugarNacimiento}
              onChange={handleChange}
              placeholder="Seleccione o escriba la ciudad"
              name="confirmacion.lugarNacimiento"
            />
          </div>
          <div style={{ ...styles.formGroup, flex: 1, marginLeft: "1rem" }}>
            <label style={styles.formLabel}>Diócesis Donde Fue Bautizado</label>
            <ComboBox
              options={ciudadesColombia}
              value={formData.confirmacion.diocesis}
              onChange={handleChange}
              placeholder="Seleccione o escriba la diócesis"
              name="confirmacion.diocesis"
            />
          </div>
        </div>

        <div style={styles.formRow}>
          {/* Fecha de Bautizo */}
          <div style={{ ...styles.bautizoDatosContainer, flex: 1 }}>
            <label style={styles.formLabelBautizo}>Fecha De Bautizo</label>
            <div style={styles.bautizoDatosRow}>
              <div style={styles.bautizoDatosGroup}>
                <label style={styles.bautizoDatosLabel}>Día</label>
                <input
                  type="text"
                  name="confirmacion.fechaNacimiento.dia"
                  value={formData.confirmacion.fechaNacimiento.dia || ""}
                  onChange={handleChange}
                  style={styles.bautizoDatosInput}
                />
              </div>
              <div style={styles.bautizoDatosGroup}>
                <label style={styles.bautizoDatosLabel}>Mes</label>
                <input
                  type="text"
                  name="confirmacion.fechaNacimiento.mes"
                  value={formData.confirmacion.fechaNacimiento.mes}
                  onChange={handleChange}
                  style={styles.bautizoDatosInput}
                />
              </div>
              <div style={styles.bautizoDatosGroup}>
                <label style={styles.bautizoDatosLabel}>Año</label>
                <input
                  type="text"
                  name="confirmacion.fechaNacimiento.año"
                  value={formData.confirmacion.fechaNacimiento.año}
                  onChange={handleChange}
                  style={styles.bautizoDatosInput}
                />
              </div>
            </div>
          </div>

          {/* Datos de Acta de Bautizo */}
          <div style={{ ...styles.bautizoDatosContainer, flex: 1 }}>
            <label style={styles.formLabelBautizo}>Datos De Acta De Bautizo</label>
            <div style={styles.bautizoDatosRow}>
              <div style={styles.bautizoDatosGroup}>
                <label style={styles.bautizoDatosLabel}>Libro</label>
                <input
                  type="text"
                  name="confirmacion.libroBautizo"
                  value={formData.confirmacion.libroBautizo || ""}
                  onChange={handleChange}
                  style={styles.bautizoDatosInput}
                />
              </div>
              <div style={styles.bautizoDatosGroup}>
                <label style={styles.bautizoDatosLabel}>Folio</label>
                <input
                  type="text"
                  name="confirmacion.folioBautizo"
                  value={formData.confirmacion.folioBautizo || ""}
                  onChange={handleChange}
                  style={styles.bautizoDatosInput}
                />
              </div>
              <div style={styles.bautizoDatosGroup}>
                <label style={styles.bautizoDatosLabel}>Acta</label>
                <input
                  type="text"
                  name="confirmacion.actaBautizo"
                  value={formData.confirmacion.actaBautizo || ""}
                  onChange={handleChange}
                  style={styles.bautizoDatosInput}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Datos de la Familia</h2>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres del Padre</label>
            <input
              type="text"
              name="confirmacion.nombrePadre"
              value={formData.confirmacion.nombrePadre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de la Madre</label>
            <input
              type="text"
              name="confirmacion.nombreMadre"
              value={formData.confirmacion.nombreMadre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombre del Padrino</label>
            <input
              type="text"
              name="confirmacion.padrino"
              value={formData.confirmacion.padrino}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombre de la Madrina</label>
            <input
              type="text"
              name="confirmacion.madrina"
              value={formData.confirmacion.madrina}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  formSection: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    marginBottom: "0.5rem",
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
  formLabel: {
    display: "block",
    marginBottom: "3px",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "capitalize",
    textAlign: "center",
  },
  formInput: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
  },
  bautizoDatosContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formLabelBautizo: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    textAlign: "center",
  },
  bautizoDatosRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  bautizoDatosGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  bautizoDatosLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  bautizoDatosInput: {
    width: "100%",
    alignItems: "center",
    padding: "0.5rem 0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
  },
}

export default ConfirmacionForm

