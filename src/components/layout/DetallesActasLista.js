const DetallesActas = ({ acta }) => {
    if (!acta) return <div>No se ha seleccionado un acta</div>;

    console.log("Datos del acta recibidos:", acta);
    
  const getNombreCompleto = (acta) => {
    if (acta.tipo === "Bautismo") {
      return `${acta.bautismo.primerNombre || ""} ${acta.bautismo.segundoNombre || ""} ${acta.bautismo.primerApellido || ""} ${acta.bautismo.segundoApellido || ""}`.trim();
    } else if (acta.tipo === "Confirmación") {
      return `${acta.confirmacion.primerNombre || ""} ${acta.confirmacion.segundoNombre || ""} ${acta.confirmacion.primerApellido || ""} ${acta.confirmacion.segundoApellido || ""}`.trim();
    } else if (acta.tipo === "Matrimonio") {
      return `${acta.matrimonio.novio.primerNombre || ""} ${acta.matrimonio.novio.primerApellido || ""} y ${acta.matrimonio.novia.primerNombre || ""} ${acta.matrimonio.novia.primerApellido || ""}`.trim();
    }
    return "Nombre no disponible";
  };

  const renderDetalles = () => {
    switch(acta.tipo) {
      case 'Bautismo':
        return (
            <div style={styles.detailsGrid}>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos del Bautizado</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha de bautizo:</span>
                <span style={styles.detailsValue}>
                  {acta.bautismo.fechaNacimiento?.dia}/{acta.bautismo.fechaNacimiento?.mes}/
                  {acta.bautismo.fechaNacimiento?.año}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar de bautizo:</span>
                <span style={styles.detailsValue}>{acta.bautismo.lugarNacimiento || "No disponible"}</span>
              </div>
            </div>
           <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos del Padre</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padre:</span>
                <span style={styles.detailsValue}>{acta.bautismo.nombrePadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuelo Paterno:</span>
                <span style={styles.detailsValue}>{acta.bautismo.abueloPaterno || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuela Paterna:</span>
                <span style={styles.detailsValue}>{acta.bautismo.abuelaPaterna || "No disponible"}</span>
              </div>
            </div>
  
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Madre</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madre:</span>
                <span style={styles.detailsValue}>{acta.bautismo.nombreMadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuelo Materno:</span>
                <span style={styles.detailsValue}>{acta.bautismo.abueloMaterno || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuela Materna:</span>
                <span style={styles.detailsValue}>{acta.bautismo.abuelaMaterna || "No disponible"}</span>
              </div>
            </div>
  
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Padrinos</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padrino:</span>
                <span style={styles.detailsValue}>{acta.bautismo.padrino || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madrina:</span>
                <span style={styles.detailsValue}>{acta.bautismo.madrina || "No disponible"}</span>
              </div>
            </div>
  
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Sacerdote:</span>
                <span style={styles.detailsValue}>{acta.oficiante || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Doy Fe:</span>
                <span style={styles.detailsValue}>{acta.doyFe || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha de la Ceremonia:</span>
                <span style={styles.detailsValue}>
                  {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
                </span>
              </div>
         </div>
         <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Nota Marginal</h4>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsValue}>{acta.notaMarginal || "No disponible"}</span>
                 </div>
                 </div>
       </div>
        );
      case 'Confirmación':
        return (
            <div style={styles.detailsGrid}>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de Acta de Bautizo</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Libro:</span>
                <span style={styles.detailsValue}>{acta.libro || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Folio:</span>
                <span style={styles.detailsValue}>{acta.folio || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Acta:</span>
                <span style={styles.detailsValue}>{acta.acta || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha de bautizo:</span>
                <span style={styles.detailsValue}>
                  {acta.confirmacion.fechaNacimiento?.dia}/{acta.confirmacion.fechaNacimiento?.mes}/
                  {acta.confirmacion.fechaNacimiento?.año}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar de bautizo:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.lugarNacimiento || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Diocesis de bautizo:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.diocesis || "No disponible"}</span>
              </div>
            </div>
  
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Familia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padre:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.nombrePadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madre:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.nombreMadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padrino:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.padrino || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madrina:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.madrina || "No disponible"}</span>
              </div>
            </div>
  
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Monseñor:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.monseñor || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Párroco o Vicario:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.sacerdote || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Doy Fe:</span>
                <span style={styles.detailsValue}>{acta.confirmacion.doyFe || acta.doyFe || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha de la Ceremonia:</span>
                <span style={styles.detailsValue}>
                  {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
                </span>
              </div>
              </div>
              <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Nota Marginal</h4>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsValue}>{acta.notaMarginal || "No disponible"}</span>
                 </div>
                 </div>
          </div>
        );
      case 'Matrimonio':
        return (
            <div style={styles.detailsGrid}>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos del Esposo</h4>
              <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Libro:</span>
                 <span style={styles.detailsValue}>{acta.libro || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Folio:</span>
                 <span style={styles.detailsValue}>{acta.folio || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Acta:</span>
                 <span style={styles.detailsValue}>{acta.acta || "No disponible"}</span>
               </div>
              <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Fecha de nacimiento:</span>
                 <span style={styles.detailsValue}>
                   {acta.matrimonio.novio.fechaNacimiento?.dia}/{acta.matrimonio.novio.fechaNacimiento?.mes}/
                   {acta.matrimonio.novio.fechaNacimiento?.año}
                 </span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.novio.lugarNacimiento || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Padre:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.novio.nombrePadre || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Madre:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.novio.nombreMadre || "No disponible"}</span>
               </div>
             </div>
   
             <div style={styles.detailsSection}>
               <h4 style={styles.sectionTitle}>Datos de la Esposa</h4>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Nombre completo:</span>
                 <span style={styles.detailsValue}>
                   {acta.matrimonio.novia.primerNombre} {acta.matrimonio.novia.segundoNombre}{" "}
                   {acta.matrimonio.novia.primerApellido} {acta.matrimonio.novia.segundoApellido}
                 </span>
               </div>  
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Libro:</span>
                 <span style={styles.detailsValue}>{acta.libro || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Folio:</span>
                 <span style={styles.detailsValue}>{acta.folio || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Acta:</span>
                 <span style={styles.detailsValue}>{acta.acta || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Fecha de nacimiento:</span>
                 <span style={styles.detailsValue}>
                   {acta.matrimonio.novia.fechaNacimiento?.dia}/{acta.matrimonio.novia.fechaNacimiento?.mes}/
                   {acta.matrimonio.novia.fechaNacimiento?.año}
                 </span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.novia.lugarNacimiento || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Padre:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.novia.nombrePadre || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Madre:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.novia.nombreMadre || "No disponible"}</span>
               </div>
             </div>
   
             <div style={styles.detailsSection}>
               <h4 style={styles.sectionTitle}>Testigos</h4>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Primer testigo:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.testigo1 || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Segundo testigo:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.testigo2 || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Tercer testigo:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.testigo3 || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Cuarto testigo:</span>
                 <span style={styles.detailsValue}>{acta.matrimonio.testigo4 || "No disponible"}</span>
               </div>
             </div>
   
             <div style={styles.detailsSection}>
               <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Sacerdote:</span>
                 <span style={styles.detailsValue}>{acta.oficiante || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Doy Fe:</span>
                 <span style={styles.detailsValue}>{acta.doyFe || "No disponible"}</span>
               </div>
               <div style={styles.detailsRow}>
                 <span style={styles.detailsLabel}>Fecha de la Ceremonia:</span>
                 <span style={styles.detailsValue}>
                   {acta.fechaCeremonia?.dia}/{acta.fechaCeremonia?.mes}/{acta.fechaCeremonia?.año}
                 </span>
               </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Nota Marginal</h4>
                <div style={styles.detailsRow}>
                  <span style={styles.detailsValue}>{acta.notaMarginal || "No disponible"}</span>
                </div>
            </div>
          </div>
        );
      default:
        return <div>No hay información disponible</div>;
    }
  };

  return (
    <div style={styles.detailsContainer}>
      <h3 style={styles.detailsTitle}>
        Detalles de {getNombreCompleto(acta)}
      </h3>
      {renderDetalles()}
    </div>
  );
};


const styles = {
    detailsCell: {
        padding: "0.5rem 0.5rem",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        cursor: "default",
      },
      detailsContainer: {
        padding: "0rem 0.5rem",
        
      },
      detailsTitle: {
        padding: "0rem 0.2rem",
        marginTop: "0rem",
        fontSize: "1.2rem",
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
      detailsSection: {
        flex: "1 1 calc(30% - 1rem)",
        minWidth: "250px",
        padding: "0rem 1rem",
        border: "1px solid #e0e0e0",
        borderRadius: "0.5rem",
        backgroundColor: "#ffffff",
      },
      sectionTitle: {
        fontSize: "1.1rem",
        fontWeight: "550",
        marginBottom: "0.5rem",
        marginTop: "0.7rem",
        color: "#385792",
      },
      detailsRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.5rem",
      },
      detailsLabel: {
        fontSize: "0.9rem",
        fontWeight: "500",
        color: "black",
      },
      detailsValue: {
        fontSize: "0.9rem",
        fontWeight: "450",
        textAlign: "right",
        textTransform: "capitalize",
      },
      buttonIcon: {
        width: "16px",
        height: "16px",
      },
};

export default DetallesActas;