import { useEffect, useState } from "react";
import ActaService from "../../services/ActaService"; // Adjust the path as necessary


// Función para capitalizar la primera letra
const capitalize = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

const DetallesActas = ({ acta }) => {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      if (!acta) return;
      
      setLoading(true);
      try {
        let data;
        switch (acta.ceremonia.toLowerCase()) {
          case 'bautismo':
            data = await ActaService.getBautizoById(acta.id);
            break;
          case 'confirmacion':
            data = await ActaService.getConfirmacionById(acta.id);
            break;
          case 'matrimonio':
            data = await ActaService.getMatrimonioById(acta.id);
            break;
          default:
            throw new Error('Tipo de ceremonia no válido');
        }
        setDetalle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [acta]);

  if (!acta) return <div>No se ha seleccionado un acta</div>;
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!detalle) return <div>No se encontraron detalles</div>;


  const getNombreCompleto = () => {
    
    const { primerNombre, segundoNombre, primerApellido, segundoApellido } = acta;
    return [primerNombre, segundoNombre, primerApellido, segundoApellido]
      .filter(Boolean)
      .map(capitalize)
      .join(' ');
  };

  const renderDetalles = () => {
    const tipo = capitalize(acta.ceremonia);
    switch (tipo) {
      case 'Bautismo':
        return (
          <div style={styles.detailsGrid}>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos del Bautizado</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha de nacimiento:</span>
                <span style={styles.detailsValue}>{acta.fechaNacimiento || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
                <span style={styles.detailsValue}>{acta.lugarNacimiento || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos del Padre</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padre:</span>
                <span style={styles.detailsValue}>{acta.nombresPadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuelo Paterno:</span>
                <span style={styles.detailsValue}>{acta.abueloPaterno || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuela Paterna:</span>
                <span style={styles.detailsValue}>{acta.abuelaPaterna || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Madre</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madre:</span>
                <span style={styles.detailsValue}>{acta.nombresMadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuelo Materno:</span>
                <span style={styles.detailsValue}>{acta.abueloMaterno || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuela Materna:</span>
                <span style={styles.detailsValue}>{acta.abuelaMaterna || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Padrinos y Madrinas</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padrinos:</span>
                <span style={styles.detailsValue}>{acta.nombrepadrinos || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madrinas:</span>
                <span style={styles.detailsValue}>{acta.nombremadrinas || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Oficiante:</span>
                <span style={styles.detailsValue}>{acta.oficial || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Doy Fe:</span>
                <span style={styles.detailsValue}>{acta.doyFe || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha ceremonia:</span>
                <span style={styles.detailsValue}>{acta.fechaCeremonia || "No disponible"}</span>
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

      case 'Confirmacion':
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
                <span style={styles.detailsValue}>{acta.fechaNacimiento || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar de bautizo:</span>
                <span style={styles.detailsValue}>{acta.lugarNacimiento || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Diocesis de bautizo:</span>
                <span style={styles.detailsValue}>{acta.diocesis || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Familia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padre:</span>
                <span style={styles.detailsValue}>{acta.nombresPadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madre:</span>
                <span style={styles.detailsValue}>{acta.nombresMadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padrino:</span>
                <span style={styles.detailsValue}>{acta.nombrepadrinos || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madrina:</span>
                <span style={styles.detailsValue}>{acta.nombremadrinas || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Monseñor:</span>
                <span style={styles.detailsValue}>{acta.nombresmonsr || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Oficiante:</span>
                <span style={styles.detailsValue}>{acta.oficial || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Doy Fe:</span>
                <span style={styles.detailsValue}>{acta.nombresDoyFe || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha ceremonia:</span>
                <span style={styles.detailsValue}>{acta.fechaCeremonia || "No disponible"}</span>
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

        //Arreglar esto 
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
                <span style={styles.detailsValue}>{acta.novio_fechaNacimiento || "No disponible"}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
                <span style={styles.detailsValue}>{acta.novio_lugarNacimiento || "No disponible"}</span>
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
              <h4 style={styles.sectionTitle}>Esposa</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Nombre completo:</span>
                {capitalize(acta.novia_nombre1)} {capitalize(acta.novia_nombre2)} {capitalize(acta.primerApellido)} {capitalize(acta.segundoApellido)}
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
                <span style={styles.detailsLabel}>Fecha nacimiento:</span>
                <span style={styles.detailsValue}>{acta.fechaNacimientoEsposa || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar nacimiento:</span>
                <span style={styles.detailsValue}>{acta.lugarNacimientoEsposa || "No disponible"}</span>
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
                <span style={styles.detailsLabel}>Primer Testigo:</span>
                <span style={styles.detailsValue}>{acta.testigo1 || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Segundo Testigo:</span>
                <span style={styles.detailsValue}>{acta.testigo2 || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Tercer Testigo:</span>
                <span style={styles.detailsValue}>{acta.testigo3 || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Cuarto Testigo:</span>
                <span style={styles.detailsValue}>{acta.testigo4 || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Oficiante:</span>
                <span style={styles.detailsValue}>{acta.oficiante || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Doy Fe:</span>
                <span style={styles.detailsValue}>{acta.doyFe || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha ceremonia:</span>
                <span style={styles.detailsValue}>{acta.fechaCeremonia || "No disponible"}</span>
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
        Detalles de {getNombreCompleto()}
      </h3>
      {renderDetalles()}
    </div>
  );
};


const styles = {
  detailsCell: {
    padding: "0.5rem 0.5rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    cursor: "default",
  },
      detailsContainer: {
        padding: "0rem 0.5rem",
        color: "black",
        fontSize: "0.9rem",
      },
      detailsTitle: {
        padding: "0rem 0rem",
        marginTop: "-0.3rem",
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
        border: "0.5px solid #000000",
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
        fontWeight: "600",
        color: "black",
      },
      detailsValue: {
        fontSize: "0.9rem",
        fontWeight: "450",
        textAlign: "right",
      },
      buttonIcon: {
        width: "16px",
        height: "16px",
      },
};

export default DetallesActas;