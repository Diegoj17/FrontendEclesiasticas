"use client"

import { useEffect, useState } from "react"
import ActaService from "../../services/ActaService" // Ajusta la ruta según sea necesario

// Función para capitalizar la primera letra
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "")

const DetallesActas = ({ acta }) => {
  const [detalle, setDetalle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetalle = async () => {
      if (!acta) return

      setLoading(true)
      try {
        console.log("Fetching details for acta:", acta)
        let data

        // Normalizar el tipo de ceremonia para asegurar consistencia
        const tipoNormalizado = acta.ceremonia ? acta.ceremonia.toLowerCase() : ""

        switch (tipoNormalizado) {
          case "bautismo":
          case "Bautismo":
          case "bautizo":
          case "BAUTIZO":
            console.log("Fetching bautizo details with ID:", acta.id)
            data = await ActaService.getBautizoById(acta.id)
            break
          case "confirmacion":
            console.log("Fetching confirmacion details with ID:", acta.id)
            data = await ActaService.getConfirmacionById(acta.id)
            break
          case "matrimonio":
            console.log("Fetching matrimonio details with ID:", acta.id)
            data = await ActaService.getMatrimonioById(acta.id)
            break
          default:
            throw new Error(`Tipo de ceremonia no válido: ${tipoNormalizado}`)
        }

        console.log("Received data:", data)
        setDetalle(data)
      } catch (err) {
        console.error("Error fetching details:", err)
        setError(err.message || "Error al cargar los detalles")
      } finally {
        setLoading(false)
      }
    }

    fetchDetalle()
  }, [acta])

  if (!acta) return <div>No se ha seleccionado un acta</div>
  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  const getNombreCompleto = () => {
    const { primerNombre, segundoNombre, primerApellido, segundoApellido } = acta
    return [primerNombre, segundoNombre, primerApellido, segundoApellido].filter(Boolean).map(capitalize).join(" ")
  }

  // Usar los datos del detalle si están disponibles, de lo contrario usar los datos del acta
  const datos = detalle || acta

  const renderDetalles = () => {
    const tipo = capitalize(acta.ceremonia)

    console.log("Rendering details for type:", tipo)
    console.log("Using data:", datos)

    switch (tipo) {
      case "Bautismo":
        return (
          <div style={styles.detailsGrid}>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos del Bautizado</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha de nacimiento:</span>
                <span style={styles.detailsValue}>{datos.idBautizado.fechaNacimiento || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
                <span style={styles.detailsValue}>{datos.idBautizado.lugarNacimiento || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos del Padre</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padre:</span>
                <span style={styles.detailsValue}>{datos.idBautizado.padre.nombre1 || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuelo Paterno:</span>
                <span style={styles.detailsValue}>{datos.abueloPaterno || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuela Paterna:</span>
                <span style={styles.detailsValue}>{datos.abuelaPaterna || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Madre</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madre:</span>
                <span style={styles.detailsValue}>{datos.idBautizado.madre.nombre1 || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuelo Materno:</span>
                <span style={styles.detailsValue}>{datos.abueloMaterno || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Abuela Materna:</span>
                <span style={styles.detailsValue}>{datos.abuelaMaterna || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Padrinos y Madrinas</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padrinos:</span>
                <span style={styles.detailsValue}>{datos.nombrespadrino || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madrinas:</span>
                <span style={styles.detailsValue}>{datos.nombresmadrina || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Sacerdote:</span>
                <span style={styles.detailsValue}>{datos.idSacerdote.nombre || datos.nombresSacerdote || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Doy Fe:</span>
                <span style={styles.detailsValue}>{datos.idDoyfe.nombre || datos.nombresDoyFe || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha ceremonia:</span>
                <span style={styles.detailsValue}>{datos.idActa.fecha || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Nota Marginal</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsValue}>{datos.idActa.notas || "No disponible"}</span>
              </div>
            </div>
          </div>
        )

      case "Confirmacion":
        return (
          <div style={styles.detailsGrid}>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de Acta de Bautizo</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Libro:</span>
                <span style={styles.detailsValue}>{datos.libro || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Folio:</span>
                <span style={styles.detailsValue}>{datos.folio || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Acta:</span>
                <span style={styles.detailsValue}>{datos.acta || datos.numeroActa || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha de bautizo:</span>
                <span style={styles.detailsValue}>{datos.fechaNacimiento || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar de bautizo:</span>
                <span style={styles.detailsValue}>{datos.lugarNacimiento || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Diocesis de bautizo:</span>
                <span style={styles.detailsValue}>{datos.diocesis || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Familia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padre:</span>
                <span style={styles.detailsValue}>{datos.idConfirmante.nombresPadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madre:</span>
                <span style={styles.detailsValue}>{datos.idConfirmante.nombresMadre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padrino:</span>
                <span style={styles.detailsValue}>
                  {datos.nombrespadrino || datos.idPadrino.nombre1 || "No disponible"}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madrina:</span>
                <span style={styles.detailsValue}>
                  {datos.nombresmadrina || datos.idMadrina.nombre1  || "No disponible"}
                </span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Monseñor:</span>
                <span style={styles.detailsValue}>{datos.idMonsr.nombre || datos.monsenor || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Sacerdote:</span>
                <span style={styles.detailsValue}>{datos.idSacerdote.nombre || datos.nombresSacerdote || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Doy Fe:</span>
                <span style={styles.detailsValue}>{datos.idDoyfe.nombre || datos.nombresDoyFe || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha ceremonia:</span>
                <span style={styles.detailsValue}>{datos.idActa.fecha || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Nota Marginal</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsValue}>{datos.idActa.notas || "No disponible"}</span>
              </div>
            </div>
          </div>
        )

      case "Matrimonio":
        // Intentar acceder a los datos anidados de manera segura
        const novio = datos.personaA || {}
        const novia = datos.personaB || {}

        return (
          <div style={styles.detailsGrid}>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos del Esposo</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Nombre completo:</span>
                <span style={styles.detailsValue}>
                  {`${capitalize(acta.primerNombre || "")} ${capitalize(acta.segundoNombre || "")} ${capitalize(acta.primerApellido || "")} ${capitalize(acta.segundoApellido || "")}`}
                  {datos.personaB.nombre1 || "No disponible"} {datos.personaB.nombre2 || "No disponible"} {datos.personaB.apellido1 || "No disponible"} {datos.personaB.apellido2 || "No disponible"}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha de nacimiento:</span>
                <span style={styles.detailsValue}>
                  {datos.personaB.fechaNacimiento || "No disponible"}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar de nacimiento:</span>
                <span style={styles.detailsValue}>
                  {datos.personaB.lugarNacimiento || novio.lugarNacimiento || "No disponible"}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padre:</span>
                <span style={styles.detailsValue}>
                  {datos.personaB.padre.nombre1 || "No disponible"} 
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madre:</span>
                <span style={styles.detailsValue}>
                  {datos.personaB.madre.nombre1 || "No disponible"} 
                </span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Esposa</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Nombre completo:</span>
                <span style={styles.detailsValue}>
                  {datos.nombreCompletoEsposa ||
                    `${capitalize(datos.novia_nombre1 || novia.primerNombre || "")} 
                    ${capitalize(datos.novia_nombre2 || novia.segundoNombre || "")} 
                    ${capitalize(datos.novia_apellido1 || novia.primerApellido || "")} 
                    ${capitalize(datos.novia_apellido2 || novia.segundoApellido || "")}`}
                    {datos.personaA.nombre1 || "No disponible"} {datos.personaA.nombre2 || "No disponible"} {datos.personaA.apellido1 || "No disponible"} {datos.personaA.apellido2 || "No disponible"}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha nacimiento:</span>
                <span style={styles.detailsValue}>
                  {datos.personaA.fechaNacimiento || "No disponible"}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Lugar nacimiento:</span>
                <span style={styles.detailsValue}>
                  {datos.personaA.lugarNacimiento ||
                    datos.lugarNacimientoEsposa ||
                    novia.lugarNacimiento ||
                    "No disponible"}
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Padre:</span>
                <span style={styles.detailsValue}>
                  {datos.personaA.padre.nombre1 || "No disponible"} 
                </span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Madre:</span>
                <span style={styles.detailsValue}>
                  {datos.personaA.madre.nombre1 || "No disponible"}
                </span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Testigos</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Primer Testigo:</span>
                <span style={styles.detailsValue}>{datos.testigo1 || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Segundo Testigo:</span>
                <span style={styles.detailsValue}>{datos.testigo2 || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Tercer Testigo:</span>
                <span style={styles.detailsValue}>{datos.testigo3 || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Cuarto Testigo:</span>
                <span style={styles.detailsValue}>{datos.testigo4 || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Datos de la Ceremonia</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Sacerdote:</span>
                <span style={styles.detailsValue}>{datos.idSacerdote.nombre || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Doy Fe:</span>
                <span style={styles.detailsValue}>{datos.idDoyfe.nombre  || "No disponible"}</span>
              </div>
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>Fecha ceremonia:</span>
                <span style={styles.detailsValue}>{datos.idActa.fecha || "No disponible"}</span>
              </div>
            </div>
            <div style={styles.detailsSection}>
              <h4 style={styles.sectionTitle}>Nota Marginal</h4>
              <div style={styles.detailsRow}>
                <span style={styles.detailsValue}>{datos.idActa.notas || "No disponible"}</span>
              </div>
            </div>
          </div>
        )

      default:
        return <div>No hay información disponible para el tipo: {tipo}</div>
    }
  }

  return (
    <div style={styles.detailsContainer}>
      <h3 style={styles.detailsTitle}>Detalles de {getNombreCompleto()}</h3>
      {renderDetalles()}
    </div>
  )
}

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
    textTransform: "capitalize",
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
  },
}

export default DetallesActas
