import React from "react"
import ComboBox from "../ui/ComboBox"

function MatrimonioForm({ formData, handleChange, ciudadesColombia }) {

  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const añoActual = new Date().getFullYear();
  const años = Array.from({ length: 500 }, (_, i) => añoActual - i);

  return (
    <>
      {/* Datos del novio */}
      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Datos del Esposo</h2>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Nombre</label>
            <input
              type="text"
              name="matrimonio.novio.primerNombre"
              value={formData.matrimonio.novio.primerNombre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Nombre</label>
            <input
              type="text"
              name="matrimonio.novio.segundoNombre"
              value={formData.matrimonio.novio.segundoNombre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Apellido</label>
            <input
              type="text"
              name="matrimonio.novio.primerApellido"
              value={formData.matrimonio.novio.primerApellido}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Apellido</label>
            <input
              type="text"
              name="matrimonio.novio.segundoApellido"
              value={formData.matrimonio.novio.segundoApellido}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres del Padre</label>
            <input
              type="text"
              name="matrimonio.novio.nombrePadre"
              value={formData.matrimonio.novio.nombrePadre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de la Madre</label>
            <input
              type="text"
              name="matrimonio.novio.nombreMadre"
              value={formData.matrimonio.novio.nombreMadre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
        <div style={styles.registroRow}>
          <div style={{ ...styles.fechaNacimientoContainer, flex: 1 }}>
            <label style={styles.formLabelNacimiento}>Fecha de Nacimiento</label>
            <div style={styles.fechaNacimientoRow}>

              <div style={styles.fechaNacimientoGroup}>
                <select
                  name="matrimonio.novio.fechaNacimiento.dia"
                  value={formData.matrimonio.novio.fechaNacimiento.dia}
                  onChange={handleChange}
                  style={styles.fechaNacimientoInput}
                >
                <option value="">Día</option>
                  {dias.map((dia) => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>

              <div style={styles.fechaNacimientoGroup}>
                <select
                  name="matrimonio.novio.fechaNacimiento.mes"
                  value={formData.matrimonio.novio.fechaNacimiento.mes}
                  onChange={handleChange}
                  style={styles.fechaNacimientoInput}
                >
                <option value="">Mes</option>
                  {meses.map((mes) => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>

              <div style={styles.fechaNacimientoGroup}>
                <select
                  name="matrimonio.novio.fechaNacimiento.año"
                  value={formData.matrimonio.novio.fechaNacimiento.año}
                  onChange={handleChange}
                  style={styles.fechaNacimientoInput}
                >
                <option value="">Año</option>
                  {años.map((año) => (
                    <option key={año} value={año}>{año}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
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
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Lugar de Nacimiento</label>
            <ComboBox
              options={ciudadesColombia}
              value={formData.matrimonio.novio.lugarNacimiento}
              onChange={handleChange}
              placeholder="Seleccione o escriba la ciudad"
              name="matrimonio.novio.lugarNacimiento"
            />
          </div>
        </div>
      </div>

      {/* Datos de la novia */}
      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Datos de la Esposa</h2>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Nombre</label>
            <input
              type="text"
              name="matrimonio.novia.primerNombre"
              value={formData.matrimonio.novia.primerNombre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Nombre</label>
            <input
              type="text"
              name="matrimonio.novia.segundoNombre"
              value={formData.matrimonio.novia.segundoNombre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Apellido</label>
            <input
              type="text"
              name="matrimonio.novia.primerApellido"
              value={formData.matrimonio.novia.primerApellido}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Apellido</label>
            <input
              type="text"
              name="matrimonio.novia.segundoApellido"
              value={formData.matrimonio.novia.segundoApellido}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres del Padre</label>
            <input
              type="text"
              name="matrimonio.novia.nombrePadre"
              value={formData.matrimonio.novia.nombrePadre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de la Madre</label>
            <input
              type="text"
              name="matrimonio.novia.nombreMadre"
              value={formData.matrimonio.novia.nombreMadre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>

        <div style={styles.registroRow}>
          <div style={{ ...styles.fechaNacimientoContainer, flex: 1 }}>
            <label style={styles.formLabelNacimiento}>Fecha de Nacimiento</label>
            <div style={styles.fechaNacimientoRow}>

              <div style={styles.fechaNacimientoGroup}>
                <select
                  name="matrimonio.novia.fechaNacimiento.dia"
                  value={formData.matrimonio.novia.fechaNacimiento.dia}
                  onChange={handleChange}
                  style={styles.fechaNacimientoInput}
                >
                <option value="">Día</option>
                  {dias.map((dia) => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>

              <div style={styles.fechaNacimientoGroup}>
                <select
                  name="matrimonio.novia.fechaNacimiento.mes"
                  value={formData.matrimonio.novia.fechaNacimiento.mes}
                  onChange={handleChange}
                  style={styles.fechaNacimientoInput}
                >
                <option value="">Mes</option>
                  {meses.map((mes) => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>

              <div style={styles.fechaNacimientoGroup}>
                <select
                  name="matrimonio.novia.fechaNacimiento.año"
                  value={formData.matrimonio.novia.fechaNacimiento.año}
                  onChange={handleChange}
                  style={styles.fechaNacimientoInput}
                >
                <option value="">Año</option>
                  {años.map((año) => (
                    <option key={año} value={año}>{año}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div style={{ ...styles.bautizoDatosContainer, flex: 1 }}>
            <label style={styles.formLabelBautizo}>Datos de Acta De Bautizo</label>
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
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Lugar de Nacimiento</label>
            <ComboBox
              options={ciudadesColombia}
              value={formData.matrimonio.novia.lugarNacimiento}
              onChange={handleChange}
              placeholder="Seleccione o escriba la ciudad"
              name="matrimonio.novia.lugarNacimiento"
            />
          </div>
        </div>
      </div>

      {/* Datos de los testigos */}
      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Testigos</h2>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Testigo</label>
            <input
              type="text"
              name="matrimonio.testigo1"
              value={formData.matrimonio.testigo1}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Testigo</label>
            <input
              type="text"
              name="matrimonio.testigo2"
              value={formData.matrimonio.testigo2}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Tercer Testigo</label>
            <input
              type="text"
              name="matrimonio.testigo3"
              value={formData.matrimonio.testigo3}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Cuarto Testigo</label>
            <input
              type="text"
              name="matrimonio.testigo4"
              value={formData.matrimonio.testigo4}
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
  registroRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
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
  fechaNacimientoContainer: {
    marginTop: "0.5rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formLabelNacimiento: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  fechaNacimientoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "5px",
  },
  fechaNacimientoGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "7rem",
    marginBottom: "0.5rem",
  },
  fechaNacimientoLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#000000",
    marginBottom: "5px",
    textAlign: "center",
  },
  fechaNacimientoInput: {
    width: "100%",
    alignItems: "center",
    padding: "0.5rem 0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    textAlign: "center",
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

export default MatrimonioForm

