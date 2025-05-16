import ComboBox from "../ui/ComboBox"

function BautismoForm({ formData, handleChange, ciudadesColombia }) {

  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const añoActual = new Date().getFullYear();
  const años = Array.from({ length: 500 }, (_, i) => añoActual - i);

  return (
    <>
      {/* Datos del bautizado */}
      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Datos del Bautizado</h2>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Nombre</label>
            <input
              type="text"
              name="bautismo.primerNombre"
              value={formData.bautismo.primerNombre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Nombre</label>
            <input
              type="text"
              name="bautismo.segundoNombre"
              value={formData.bautismo.segundoNombre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Primer Apellido</label>
            <input
              type="text"
              name="bautismo.primerApellido"
              value={formData.bautismo.primerApellido}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Segundo Apellido</label>
            <input
              type="text"
              name="bautismo.segundoApellido"
              value={formData.bautismo.segundoApellido}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
        <div style={styles.formRow}>
          {/* Fecha de Nacimiento */}
          <div style={{ ...styles.fechaNacimientoContainer, flex: 1 }}>
            <label style={styles.formLabelNacimiento}>Fecha de Nacimiento</label>
            <div style={styles.fechaNacimientoRow}>
              <div style={styles.fechaNacimientoGroup}>
                <select
                  
                  name="bautismo.fechaNacimiento.dia"
                  value={formData.bautismo.fechaNacimiento.dia}
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
                  
                  name="bautismo.fechaNacimiento.mes"
                  value={formData.bautismo.fechaNacimiento.mes}
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
                  name="bautismo.fechaNacimiento.año"
                  value={formData.bautismo.fechaNacimiento.año}
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
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.formLabel}>Lugar de Nacimiento</label>
            <ComboBox
              options={ciudadesColombia}
              value={formData.bautismo.lugarNacimiento}
              onChange={handleChange}
              placeholder="Seleccione o escriba la ciudad"
              name="bautismo.lugarNacimiento"
            />
          </div>
        </div>
      </div>
      {/* Datos anexos */}
      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Datos Anexos</h2>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres del Padre</label>
            <input
              type="text"
              name="bautismo.nombrePadre"
              value={formData.bautismo.nombrePadre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de la Madre</label>
            <input
              type="text"
              name="bautismo.nombreMadre"
              value={formData.bautismo.nombreMadre}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de Abuelo Paterno</label>
            <input
              type="text"
              name="bautismo.abueloPaterno"
              value={formData.bautismo.abueloPaterno}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de Abuela Paterna</label>
            <input
              type="text"
              name="bautismo.abuelaPaterna"
              value={formData.bautismo.abuelaPaterna}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de Abuelo Materno</label>
            <input
              type="text"
              name="bautismo.abueloMaterno"
              value={formData.bautismo.abueloMaterno}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de Abuela Materna</label>
            <input
              type="text"
              name="bautismo.abuelaMaterna"
              value={formData.bautismo.abuelaMaterna}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres del padrino (ó padrinos)</label>
            <input
              type="text"
              name="bautismo.padrino"
              value={formData.bautismo.padrino}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombres de la madrina (ó madrinas)</label>
            <input
              type="text"
              name="bautismo.madrina"
              value={formData.bautismo.madrina}
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
}

export default BautismoForm

