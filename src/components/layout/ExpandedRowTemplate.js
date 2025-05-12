const ExpandedRowTemplate = (data) => {

console.log("🚀 expanded data:", data)

  // Función para determinar el título de la fila expandida
  const getExpandedTitle = () => {
    const { primerNombre, segundoNombre, primerApellido, segundoApellido, ceremonia } = data
    const nombreCompleto =
      `${primerNombre || ""} ${segundoNombre || ""} ${primerApellido || ""} ${segundoApellido || ""}`.trim()

    if (ceremonia === "Matrimonio") {
      // Para matrimonio, mostrar ambos nombres
      return `Detalles de ${nombreCompleto} y ${data.nombreCompletoEsposa || "Esposa"}`
    }

    return `Detalles de ${nombreCompleto}`
  }

  // Renderizar detalles de Bautismo
  const renderBautismoDetails = () => {
    return (
      <div style={styles.expandedContent}>
        <h3 style={styles.expandedTitle}>{getExpandedTitle()}</h3>

        <div style={styles.detailsGrid}>
          {/* Columna 1: Datos del Bautizado */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos del Bautizado</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Fecha de bautizo:</span>
              <span style={styles.value}>{data.fecha || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Lugar de bautizo:</span>
              <span style={styles.value}>{data.lugarNacimiento || "No disponible"}</span>
            </div>
          </div>

          {/* Columna 2: Datos del Padre */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos del Padre</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Padre:</span>
              <span style={styles.value}>{data.nombresPadre || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Abuelo Paterno:</span>
              <span style={styles.value}>{data.abueloPaterno || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Abuela Paterna:</span>
              <span style={styles.value}>{data.abuelaPaterna || "No disponible"}</span>
            </div>
          </div>

          {/* Columna 3: Datos de la Madre */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos de la Madre</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Madre:</span>
              <span style={styles.value}>{data.nombresMadre || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Abuelo Materno:</span>
              <span style={styles.value}>{data.abueloMaterno || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Abuela Materna:</span>
              <span style={styles.value}>{data.abuelaMaterna || "No disponible"}</span>
            </div>
          </div>
        </div>

        <div style={styles.detailsGrid}>
          {/* Columna 4: Padrinos */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Padrinos</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Padrino:</span>
              <span style={styles.value}>{data.padrino || data.nombrepadrinos || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Madrina:</span>
              <span style={styles.value}>{data.madrina || data.nombremadrinas || "No disponible"}</span>
            </div>
          </div>

          {/* Columna 5: Datos de la Ceremonia */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Sacerdote:</span>
              <span style={styles.value}>{data.nombresSacerdote || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Doy Fe:</span>
              <span style={styles.value}>{data.nombresDoyFe || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Fecha de la Ceremonia:</span>
              <span style={styles.value}>{data.fecha || "No disponible"}</span>
            </div>
          </div>

          {/* Columna 6: Nota Marginal */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Nota Marginal</h4>
            <div style={styles.detailRow}>
              <span style={styles.value}>{data.notaMarginal || "Sin notas adicionales"}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar detalles de Confirmación
  const renderConfirmacionDetails = () => {
    return (
      <div style={styles.expandedContent}>
        <h3 style={styles.expandedTitle}>{getExpandedTitle()}</h3>

        <div style={styles.detailsGrid}>
          {/* Columna 1: Datos de Acta de Bautizo */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos de Acta de Bautizo</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Libro:</span>
              <span style={styles.value}>{data.libro || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Folio:</span>
              <span style={styles.value}>{data.folio || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Acta:</span>
              <span style={styles.value}>{data.acta || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Fecha de bautizo:</span>
              <span style={styles.value}>{data.fechaNacimiento || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Lugar de bautizo:</span>
              <span style={styles.value}>{data.lugarNacimiento || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Diócesis de bautizo:</span>
              <span style={styles.value}>{"No disponible"}</span>
            </div>
          </div>

          {/* Columna 2: Datos de la Familia */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos de la Familia</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Padre:</span>
              <span style={styles.value}>{data.nombresPadre || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Madre:</span>
              <span style={styles.value}>{data.nombresMadre || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Padrino:</span>
              <span style={styles.value}>{data.padrino || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Madrina:</span>
              <span style={styles.value}>{data.madrina || "No disponible"}</span>
            </div>
          </div>

          {/* Columna 3: Datos de la Ceremonia */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Monseñor:</span>
              <span style={styles.value}>{data.monsenor || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Párroco o Vicario:</span>
              <span style={styles.value}>{data.nombresSacerdote || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Doy Fe:</span>
              <span style={styles.value}>{data.nombresDoyFe || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Fecha de la Ceremonia:</span>
              <span style={styles.value}>{data.fecha || "No disponible"}</span>
            </div>
          </div>
        </div>

        {/* Nota Marginal */}
        <div style={styles.notaMarginalSection}>
          <h4 style={styles.sectionTitle}>Nota Marginal</h4>
          <div style={styles.notaMarginalContent}>
            <span>{data.notaMarginal || "Sin notas adicionales"}</span>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar detalles de Matrimonio
  const renderMatrimonioDetails = () => {
    return (
      <div style={styles.expandedContent}>
        <h3 style={styles.expandedTitle}>{getExpandedTitle()}</h3>

        <div style={styles.detailsGrid}>
          {/* Columna 1: Datos del Esposo */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos del Esposo</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Libro:</span>
              <span style={styles.value}>{data.libro || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Folio:</span>
              <span style={styles.value}>{data.folio || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Acta:</span>
              <span style={styles.value}>{data.acta || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Fecha de nacimiento:</span>
              <span style={styles.value}>{data.fechaNacimientoEsposo || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Lugar de nacimiento:</span>
              <span style={styles.value}>{data.lugarNacimientoEsposo || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Padre:</span>
              <span style={styles.value}>{data.padreEsposo || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Madre:</span>
              <span style={styles.value}>{data.madreEsposo || "No disponible"}</span>
            </div>
          </div>

          {/* Columna 2: Datos de la Esposa */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos de la Esposa</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Nombre completo:</span>
              <span style={styles.value}>{data.nombreCompletoEsposa || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Libro:</span>
              <span style={styles.value}>{data.libro || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Folio:</span>
              <span style={styles.value}>{data.folio || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Acta:</span>
              <span style={styles.value}>{data.acta || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Fecha de nacimiento:</span>
              <span style={styles.value}>{data.fechaNacimientoEsposa || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Lugar de nacimiento:</span>
              <span style={styles.value}>{data.lugarNacimientoEsposa || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Padre:</span>
              <span style={styles.value}>{data.padreEsposa || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Madre:</span>
              <span style={styles.value}>{data.madreEsposa || "No disponible"}</span>
            </div>
          </div>

          {/* Columna 3: Testigos */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Testigos</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Primer testigo:</span>
              <span style={styles.value}>{data.testigo1 || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Segundo testigo:</span>
              <span style={styles.value}>{data.testigo2 || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Tercer testigo:</span>
              <span style={styles.value}>{data.testigo3 || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Cuarto testigo:</span>
              <span style={styles.value}>{data.testigo4 || "No disponible"}</span>
            </div>
          </div>
        </div>

        <div style={styles.detailsGrid}>
          {/* Columna 4: Datos de la Ceremonia */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
            <div style={styles.detailRow}>
              <span style={styles.label}>Sacerdote:</span>
              <span style={styles.value}>{data.nombresSacerdote || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Doy Fe:</span>
              <span style={styles.value}>{data.nombresDoyFe || "No disponible"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Fecha de la Ceremonia:</span>
              <span style={styles.value}>{data.fecha || "No disponible"}</span>
            </div>
          </div>

          {/* Columna 5: Nota Marginal */}
          <div style={styles.detailSection}>
            <h4 style={styles.sectionTitle}>Nota Marginal</h4>
            <div style={styles.notaMarginalContent}>
              <span>{data.notaMarginal || "Sin notas adicionales"}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

// Determinar qué plantilla mostrar según el tipo de ceremonia
  const renderTemplate = () => {
    console.log("Renderizando plantilla para ceremonia:", data.ceremonia)

    if (!data || !data.ceremonia) {
      return (
        <div style={styles.expandedContent}>
          <h3 style={styles.expandedTitle}>Detalles del Acta</h3>
          <p>No hay información disponible para esta acta.</p>
        </div>
      )
    }

    const ceremonia = data.ceremonia.toLowerCase()

    if (ceremonia.includes("bautismo") || ceremonia.includes("Bautismo") || ceremonia.includes("BAUTISMO")
      || ceremonia.includes("bautizo") || ceremonia.includes("BAUTIZO") || ceremonia.includes("Bautizo")) {
      return renderBautismoDetails()
    } else if (ceremonia.includes("confirmacion") || ceremonia.includes("confirmación")) {
      return renderConfirmacionDetails()
    } else if (ceremonia.includes("matrimonio")) {
      return renderMatrimonioDetails()
    } else {
      // Plantilla genérica si no se reconoce el tipo
      return (
        <div style={styles.expandedContent}>
          <h3 style={styles.expandedTitle}>Detalles del Acta</h3>
          <p>No hay datos disponibles.</p>
        </div>
      )
    }
  }

  return renderTemplate()
}


const styles = {

  expandedContent: {
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "0.5rem",
    margin: "0.5rem",
    boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
  },
  expandedTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    borderBottom: "2px solid #FCCE74",
    paddingBottom: "0.5rem",
    color: "#333",
  },
    detailCell: {
        padding: "0.5rem 0.5rem",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        cursor: "default",
      },
      detailsContainer: {
        padding: "0rem 0.5rem",
        
      },
      detailsTitle: {
        padding: "0rem 0.5rem",
        fontSize: "1.1rem",
        fontWeight: "600",
        marginBottom: "0.5rem",
        color: "#385792",
      },
      detailsGrid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "0.5rem",
        cursor: "default",
      },
      detailSection: {
        flex: "1 1 calc(30% - 1rem)",
        minWidth: "250px",
        padding: "0rem 1rem",
        border: "1px solid #e0e0e0",
        borderRadius: "0.5rem",
        backgroundColor: "#ffffff",
      },
      sectionTitle: {
        fontSize: "1.1rem",
        fontWeight: "600",
        marginBottom: "0.5rem",
        color: "#385792",
      },
      detailsRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.5rem",
      },
      detailsLabel: {
        fontWeight: "500",
      },
      detailsValue: {
        textAlign: "right",
      },
      buttonIcon: {
        width: "16px",
        height: "16px",
      },
      label: {
    fontWeight: "bold",
    minWidth: "150px",
    color: "#666",
  },
  value: {
    flex: 1,
    color: "#333",
  },
  notaMarginalSection: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  notaMarginalContent: {
    padding: "0.5rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "0.25rem",
    fontSize: "0.9rem",
    color: "#333",
  },
};

export default ExpandedRowTemplate;