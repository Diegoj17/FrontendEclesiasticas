import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { FaArrowLeft, FaEdit, FaPrint, FaDownload } from "react-icons/fa"
import { FiCalendar, FiUser, FiBook, FiFileText } from "react-icons/fi"
import ActaService from "../services/ActaService"
import HeaderAdmin from "../components/layout/HeaderAdmin"


const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "")

const formatFecha = (fecha) => {
  if (!fecha) return ""
  const options = { day: "numeric", month: "long", year: "numeric" }
  const partes = new Date(fecha).toLocaleDateString("es-ES", options).split(" ")
  return `${partes[0]} de ${partes[2].toUpperCase()} de ${partes[4]}`
}

export default function VistaActaDetalle() {
  const { id } = useParams()
  const location = useLocation()
  const tipo = new URLSearchParams(location.search).get("tipo") || ""
  const navigate = useNavigate()

  const [acta, setActa] = useState(null)
  const [detalle, setDetalle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener los datos del acta
  useEffect(() => {
    if (!tipo) {
      setError("No se especificó el tipo de acta")
      setLoading(false)
      return
    }

    const fetchActa = async () => {
      setLoading(true)
      try {
        let data

        // Normalizar el tipo de acta
        const tipoNormalizado = tipo.toLowerCase()

        switch (tipoNormalizado) {
          case "bautizo":
          case "bautismo":
            data = await ActaService.getBautizoById(id)
            break
          case "confirmacion":
            data = await ActaService.getConfirmacionById(id)
            break
          case "matrimonio":
            data = await ActaService.getMatrimonioById(id)
            break
          default:
            throw new Error(`Tipo de acta no válido: ${tipo}`)
        }

        let actaTransformada
        try {
          actaTransformada = ActaService.transformActasForTable([data])[0]
          
          // Si no tiene ceremonia, asignarla manualmente basada en el tipo
          if (!actaTransformada.ceremonia) {
            actaTransformada.ceremonia = tipoNormalizado === "bautizo" ? "bautismo" : tipoNormalizado
          }
        } catch (error) {
          console.error("Error en transformación, creando acta manual:", error)
          // Crear un objeto acta básico si la transformación falla
          actaTransformada = {
            id: data.id || id,
            ceremonia: tipoNormalizado === "bautizo" ? "bautismo" : tipoNormalizado,
            libro: data.libro || data.idActa?.libro || "",
            folio: data.folio || data.idActa?.folio || "",
            acta: data.numeroActa || data.acta || data.idActa?.numeroActa || "",
            primerNombre: data.idBautizado?.nombre1 || data.idConfirmante?.nombre1 || data.personaB?.nombre1 || "",
            segundoNombre: data.idBautizado?.nombre2 || data.idConfirmante?.nombre2 || data.personaB?.nombre2 || "",
            primerApellido: data.idBautizado?.apellido1 || data.idConfirmante?.apellido1 || data.personaB?.apellido1 || "",
            segundoApellido: data.idBautizado?.apellido2 || data.idConfirmante?.apellido2 || data.personaB?.apellido2 || "",
            fechaNacimiento: data.idBautizado?.fechaNacimiento || data.idConfirmante?.fechaNacimiento || data.personaB?.fechaNacimiento || "",
            nombresPadre: data.idBautizado?.padre?.nombre1 || data.idConfirmante?.padre?.nombre1 || data.personaB?.padre?.nombre1 || data.nombresPadre || "",
            nombresMadre: data.idBautizado?.madre?.nombre1 || data.idConfirmante?.madre?.nombre1 || data.personaB?.madre?.nombre1 || data.nombresMadre || "",
            oficiante: data.nombresSacerdote || data.idSacerdote?.nombre || "",
            doyFe: data.nombresDoyFe || data.idDoyfe?.nombre || "",
            notaMarginal: data.notas || data.idActa?.notas || "",
            fecha: data.fecha || data.idActa?.fecha || "",
            fechaCeremonia: data.fecha || data.idActa?.fecha || ""
          }
        }

        setActa(actaTransformada)
        setDetalle(data)
      } catch (err) {
        setError(err.message || "Error al cargar el acta")
      } finally {
        setLoading(false)
      }
    }

    fetchActa()
  }, [id, tipo])

  const handleEditActa = (actaId, tipoCeremonia) => {
    // convertimos el tipo a minúsculas para que coincida con lo que espera CorregirActas
    const tipoNormalizado = tipoCeremonia.toLowerCase(); 
    navigate(`/actas/editar/${actaId}/${tipoNormalizado}`);
  };

  // Función para imprimir el acta (copiada exactamente de BuscarActas)
  const handlePrint = async (tipoPdf) => {
    if (!acta) {
      console.error("No hay acta disponible")
      return
    }

    if (!acta.ceremonia) {
      console.error("Acta sin ceremonia definida:", acta)
      alert("Error: No se pudo determinar el tipo de ceremonia")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No hay token de autenticación")

      const safeActa = JSON.parse(JSON.stringify(acta));

      const tipoDocumento = acta.ceremonia.toLowerCase()
      const requestBody = {
        tipoPdf: tipoPdf,
        tipoDocumento: tipoDocumento,
        parametros: {},
      }

      // Obtener fecha actual formateada
      const fechaActual = new Date()
      const mesAnio = fechaActual
        .toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        })
        .toUpperCase()

      const fechaActualFormateada = formatFecha(fechaActual)

      // Construir parámetros según el tipo de documento (exactamente como en BuscarActas)
      switch (tipoDocumento) {
        case "bautismo":
          requestBody.parametros = {
            libro: acta.libro || "",
            folio: acta.folio || "",
            acta: acta.acta || "",
            num_dias: "15",
            mes_anio: mesAnio,
            monsenior: acta.monsenor || acta.oficiante || "",
            nombre_bautizado: `${acta.primerNombre} ${acta.segundoNombre} ${acta.primerApellido} ${acta.segundoApellido}`,
            nombre_padre: acta.nombresPadre || "",
            nombre_madre: acta.nombresMadre || "",
            nombre_padrinos: acta.nombrepadrinos || acta.padrino || "N/A",
            nombre_doyfe: acta.doyFe || "",
            nota_marginal: acta.notaMarginal || "Ninguna",
            fecha_nacimiento: acta.fechaNacimiento ? formatFecha(acta.fechaNacimiento) : "",
            fecha_actual: fechaActualFormateada,
          }
          break

        case "matrimonio":
          requestBody.parametros = {
            libro: acta.libro || "",
            folio: acta.folio || "",
            acta: acta.acta || "",
            fecha: acta.fecha || acta.fechaCeremonia || "",

            nombres_esposo: `${acta.primerNombre} ${acta.segundoNombre} ${acta.primerApellido} ${acta.segundoApellido}`,
            nombres_padreesposo: acta.nombresPadre || "",
            nombres_madresesposo: acta.nombresMadre || "",
            fecha_nacimiento_esposo: acta.fechaNacimiento || "",
            libro_bautizo_esposo: acta.libroBautizo || "",
            folio_bautizo_esposo: acta.folioBautizo || "",
            acta_bautizo_esposo: acta.actaBautizo || "",
            lugar_nacimiento_esposo: acta.lugarNacimiento || "",

            nombres_esposa: acta.nombresEsposa || "",
            nombres_padreesposa: acta.nombresPadreEsposa || "",
            nombres_madresesposa: acta.nombresMadreEsposa || "",
            fecha_nacimiento_esposa: acta.fechaNacimientoEsposa || "",
            libro_bautizo_esposa: acta.libroBautizoEsposa || "",
            folio_bautizo_esposa: acta.folioBautizoEsposa || "",
            acta_bautizo_esposa: acta.actaBautizoEsposa || "",
            lugar_nacimiento_esposa: acta.lugarNacimientoEsposa || "",

            primer_testigo: acta.testigo1 || "",
            segundo_testigo: acta.testigo2 || "",
            tercer_testigo: acta.testigo3 || "",
            cuarto_testigo: acta.testigo4 || "",

            monsr: acta.monsenor || "",
            sacerdote: acta.oficiante || "",
            doyfe: acta.doyFe || "",
            notamarginal: acta.notaMarginal || "Sin observaciones",
          }
          break

        case "confirmacion":
          if (tipoPdf === "largo") {
            requestBody.parametros = {
              libro: acta.libro || "",
              folio: acta.folio || "",
              acta: acta.acta || "",
              nombre_confirmante: `${acta.primerNombre} ${acta.segundoNombre} ${acta.primerApellido} ${acta.segundoApellido}`,
              num_dias: "15",
              mes_anio: mesAnio.split(" ")[0], // Solo el mes (ej: "MAYO")
              monsenior: acta.monsenor || "",
              fecha_nacimiento: acta.fechaNacimiento ? formatFecha(acta.fechaNacimiento) : "",
              nombre_padre: acta.nombresPadre || "",
              nombre_madre: acta.nombresMadre || "",
              nombre_padrinos: acta.nombrepadrinos || "",
              nombre_doyfe: acta.doyFe || "",
              nota_marginal: acta.notaMarginal || "",
              fecha_actual: fechaActualFormateada,
            }
          } else {
            requestBody.parametros = {
              nombre: `${acta.primerNombre} ${acta.segundoNombre} ${acta.primerApellido} ${acta.segundoApellido}`,
              libro: acta.libro || "",
              folio: acta.folio || "",
              acta: acta.acta || "",
              fecha: acta.fecha || "",
              lugar_bautizo: acta.lugarBautizo || "",
              fecha_bautizo: acta.fechaBautizo || "",
              diocesis_bautizo: acta.diocesis || "",
              libro_bautizo: acta.libroBautizo || "",
              folio_bautizo: acta.folioBautizo || "",
              acta_bautizo: acta.actaBautizo || "",
              nombre_padre: acta.nombresPadre || "",
              nombre_madre: acta.nombresMadre || "",
              nombre_padrino: acta.padrino || "",
              nombre_madrina: acta.madrina || "",
              monsr: acta.monsenor || "",
              sacerdote: acta.oficiante || "",
              doyfe: acta.doyFe || "",
              notamarginal: acta.notaMarginal || "",
            }
          }
          break

        default:
          throw new Error(`Tipo de ceremonia no válido: ${tipoDocumento}`)
      }

      console.log("Enviando a PDF:", JSON.stringify(requestBody, null, 2))

      // Enviar solicitud GET con el JSON (exactamente como en BuscarActas)
      const response = await axios.post(
        "https://actaseclesiasticas.koyeb.app/api/actas/pdf",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        responseType: "blob"
      }
    );

      // Abrir PDF en nueva ventana para imprimir
      const pdfBlob = new Blob([response.data], { type: "application/pdf" })
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const printWindow = window.open(pdfUrl, "_blank")

      // Intentar imprimir automáticamente
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }

      // Limpiar URL después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl)
      }, 10000)
    } catch (error) {
      console.error("Error al generar PDF:", error)

      let errorMessage = error.message
      if (error.response) {
        errorMessage = error.response.data.error || error.response.statusText
      }

      alert(`Error al generar el PDF: ${errorMessage}`)
    }
  }

  // Función para descargar el acta como PDF
  const handleDownload = async (tipoPdf) => {
    if (!acta) return

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No hay token de autenticación")

      const tipoDocumento = acta.ceremonia.toLowerCase()
      const requestBody = {
        tipoPdf: tipoPdf,
        tipoDocumento: tipoDocumento,
        parametros: {},
      }

      // Obtener fecha actual formateada
      const fechaActual = new Date()
      const mesAnio = fechaActual
        .toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        })
        .toUpperCase()

      const fechaActualFormateada = formatFecha(fechaActual)

      // Construir parámetros según el tipo de documento (exactamente como en BuscarActas)
      switch (tipoDocumento) {
        case "bautismo":
          requestBody.parametros = {
            libro: acta.libro || "",
            folio: acta.folio || "",
            acta: acta.acta || "",
            num_dias: "15",
            mes_anio: mesAnio,
            monsenior: acta.monsenor || acta.oficiante || "",
            nombre_bautizado: `${acta.primerNombre} ${acta.segundoNombre} ${acta.primerApellido} ${acta.segundoApellido}`,
            nombre_padre: acta.nombresPadre || "",
            nombre_madre: acta.nombresMadre || "",
            nombre_padrinos: acta.nombrepadrinos || acta.padrino || "N/A",
            nombre_doyfe: acta.doyFe || "",
            nota_marginal: acta.notaMarginal || "Ninguna",
            fecha_nacimiento: acta.fechaNacimiento ? formatFecha(acta.fechaNacimiento) : "",
            fecha_actual: fechaActualFormateada,
          }
          break

        case "matrimonio":
          requestBody.parametros = {
            libro: acta.libro || "",
            folio: acta.folio || "",
            acta: acta.acta || "",
            fecha: acta.fecha || acta.fechaCeremonia || "",

            nombres_esposo: `${acta.primerNombre} ${acta.segundoNombre} ${acta.primerApellido} ${acta.segundoApellido}`,
            nombres_padreesposo: acta.nombresPadre || "",
            nombres_madresesposo: acta.nombresMadre || "",
            fecha_nacimiento_esposo: acta.fechaNacimiento || "",
            libro_bautizo_esposo: acta.libroBautizo || "",
            folio_bautizo_esposo: acta.folioBautizo || "",
            acta_bautizo_esposo: acta.actaBautizo || "",
            lugar_nacimiento_esposo: acta.lugarNacimiento || "",

            nombres_esposa: acta.nombresEsposa || "",
            nombres_padreesposa: acta.nombresPadreEsposa || "",
            nombres_madresesposa: acta.nombresMadreEsposa || "",
            fecha_nacimiento_esposa: acta.fechaNacimientoEsposa || "",
            libro_bautizo_esposa: acta.libroBautizoEsposa || "",
            folio_bautizo_esposa: acta.folioBautizoEsposa || "",
            acta_bautizo_esposa: acta.actaBautizoEsposa || "",
            lugar_nacimiento_esposa: acta.lugarNacimientoEsposa || "",

            primer_testigo: acta.testigo1 || "",
            segundo_testigo: acta.testigo2 || "",
            tercer_testigo: acta.testigo3 || "",
            cuarto_testigo: acta.testigo4 || "",

            monsr: acta.monsenor || "",
            sacerdote: acta.oficiante || "",
            doyfe: acta.doyFe || "",
            notamarginal: acta.notaMarginal || "Sin observaciones",
          }
          break

        case "confirmacion":
          if (tipoPdf === "largo") {
            requestBody.parametros = {
              libro: acta.libro || "",
              folio: acta.folio || "",
              acta: acta.acta || "",
              nombre_confirmante: `${acta.primerNombre} ${acta.segundoNombre} ${acta.primerApellido} ${acta.segundoApellido}`,
              num_dias: "15",
              mes_anio: mesAnio.split(" ")[0],
              monsenior: acta.monsenor || "",
              fecha_nacimiento: acta.fechaNacimiento ? formatFecha(acta.fechaNacimiento) : "",
              nombre_padre: acta.nombresPadre || "",
              nombre_madre: acta.nombresMadre || "",
              nombre_padrinos: acta.nombrepadrinos || "",
              nombre_doyfe: acta.doyFe || "",
              nota_marginal: acta.notaMarginal || "",
              fecha_actual: fechaActualFormateada,
            }
          } else {
            requestBody.parametros = {
              nombre: `${acta.primerNombre} ${acta.segundoNombre} ${acta.primerApellido} ${acta.segundoApellido}`,
              libro: acta.libro || "",
              folio: acta.folio || "",
              acta: acta.acta || "",
              fecha: acta.fecha || "",
              lugar_bautizo: acta.lugarBautizo || "",
              fecha_bautizo: acta.fechaBautizo || "",
              diocesis_bautizo: acta.diocesis || "",
              libro_bautizo: acta.libroBautizo || "",
              folio_bautizo: acta.folioBautizo || "",
              acta_bautizo: acta.actaBautizo || "",
              nombre_padre: acta.nombresPadre || "",
              nombre_madre: acta.nombresMadre || "",
              nombre_padrino: acta.padrino || "",
              nombre_madrina: acta.madrina || "",
              monsr: acta.monsenor || "",
              sacerdote: acta.oficiante || "",
              doyfe: acta.doyFe || "",
              notamarginal: acta.notaMarginal || "",
            }
          }
          break

        default:
          throw new Error(`Tipo de ceremonia no válido: ${tipoDocumento}`)
      }

      console.log("Enviando a PDF para descarga:", JSON.stringify(requestBody, null, 2))

      // Enviar solicitud GET con el JSON (exactamente como en BuscarActas)
      const response = await axios.post(
        "https://actaseclesiasticas.koyeb.app/api/actas/pdf",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          responseType: "blob"
        }
      );

      // Descargar PDF (exactamente como en BuscarActas)
      const pdfBlob = new Blob([response.data], { type: "application/pdf" })
      const pdfUrl = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = `acta_${acta.ceremonia}_${acta.acta}.pdf`
      link.click()
      URL.revokeObjectURL(pdfUrl)
    } catch (error) {
      console.error("Error al descargar PDF:", error)

      let errorMessage = error.message
      if (error.response) {
        errorMessage = error.response.data.error || error.response.statusText
      }

      alert(`Error al descargar el PDF: ${errorMessage}`)
    }
  }

  // Función para renderizar detalles específicos según el tipo de acta
  const renderDetallesEspecificos = () => {
    if (!detalle) {
      return (
        <div style={styles.detailItem}>
          <FiFileText style={styles.detailIcon} />
          <div>
            <p style={styles.detailLabel}>Estado:</p>
            <p style={styles.detailValue}>Cargando detalles...</p>
          </div>
        </div>
      )
    }

    const tipoLower = tipo.toLowerCase()

    if (tipoLower === "bautizo" || tipoLower === "bautismo" || tipoLower === "Bautismo") {
      return (
        <div style={styles.detailsGrid}>
          {/* Datos del Bautizado */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos del Bautizado</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Nombre completo:</p>
                <p style={styles.detailValue}>
                  {detalle?.idBautizado?.nombre1 || ""} {detalle?.idBautizado?.nombre2 || ""}{" "}
                  {detalle?.idBautizado?.apellido1 || ""} {detalle?.idBautizado?.apellido2 || ""}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiCalendar style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Fecha de nacimiento:</p>
                <p style={styles.detailValue}>
                  {detalle?.idBautizado?.fechaNacimiento || detalle?.fechaNacimiento || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Lugar de nacimiento:</p>
                <p style={styles.detailValue}>
                  {detalle?.idBautizado?.lugarNacimiento || detalle?.lugarNacimiento || "No disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Datos de los Padres */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos de los Padres</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Padre:</p>
                <p style={styles.detailValue}>
                  {detalle?.idBautizado?.padre?.nombre1 || detalle?.nombresPadre || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Madre:</p>
                <p style={styles.detailValue}>
                  {detalle?.idBautizado?.madre?.nombre1 || detalle?.nombresMadre || "No disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Datos de los Abuelos */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos de los Abuelos</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Abuelo Paterno:</p>
                <p style={styles.detailValue}>{detalle?.abueloPaterno || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Abuela Paterna:</p>
                <p style={styles.detailValue}>{detalle?.abuelaPaterna || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Abuelo Materno:</p>
                <p style={styles.detailValue}>{detalle?.abueloMaterno || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Abuela Materna:</p>
                <p style={styles.detailValue}>{detalle?.abuelaMaterna || "No disponible"}</p>
              </div>
            </div>
          </div>

          {/* Datos de los Padrinos */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Padrinos</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Padrino:</p>
                <p style={styles.detailValue}>
                  {detalle?.nombrespadrino || detalle?.idPadrino?.nombre1 || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Madrina:</p>
                <p style={styles.detailValue}>
                  {detalle?.nombresmadrina || detalle?.idMadrina?.nombre1 || "No disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Datos de la Ceremonia */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos de la Ceremonia</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Sacerdote:</p>
                <p style={styles.detailValue}>
                  {detalle?.nombresSacerdote || detalle?.idSacerdote?.nombre || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Doy Fe:</p>
                <p style={styles.detailValue}>{detalle?.nombresDoyFe || detalle?.idDoyfe?.nombre || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiCalendar style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Fecha de ceremonia:</p>
                <p style={styles.detailValue}>{detalle?.fecha || detalle?.idActa?.fecha || "No disponible"}</p>
              </div>
            </div>
          </div>

          {/* Nota Marginal */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Nota Marginal</h3>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailValue}>{detalle?.notas || detalle?.idActa?.notas || "No disponible"}</p>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (tipoLower === "confirmacion") {
      return (
        <div style={styles.detailsGrid}>
          {/* Datos del Confirmante */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos del Confirmante</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Nombre completo:</p>
                <p style={styles.detailValue}>
                  {detalle?.idConfirmante?.nombre1 || detalle?.primerNombre || ""}{" "}
                  {detalle?.idConfirmante?.nombre2 || detalle?.segundoNombre || ""}{" "}
                  {detalle?.idConfirmante?.apellido1 || detalle?.primerApellido || ""}{" "}
                  {detalle?.idConfirmante?.apellido2 || detalle?.segundoApellido || ""}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiCalendar style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Fecha de nacimiento:</p>
                <p style={styles.detailValue}>
                  {detalle?.idConfirmante?.fechaNacimiento || detalle?.fechaNacimiento || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Lugar de nacimiento:</p>
                <p style={styles.detailValue}>
                  {detalle?.idConfirmante?.lugarNacimiento || detalle?.lugarNacimiento || "No disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Datos del Bautismo */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos del Bautismo</h3>

            <div style={styles.detailItem}>
              <FiCalendar style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Fecha de bautismo:</p>
                <p style={styles.detailValue}>{detalle?.fechaBautismo || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Lugar de bautismo:</p>
                <p style={styles.detailValue}>{detalle?.lugarBautismo || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiBook style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Libro/Folio/Acta:</p>
                <p style={styles.detailValue}>
                  Libro {detalle?.libro || "No disponible"}, Folio {detalle?.folio || "No disponible"}, Acta{" "}
                  {detalle?.acta || detalle?.numeroActa || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Diócesis:</p>
                <p style={styles.detailValue}>{detalle?.diocesis || "No disponible"}</p>
              </div>
            </div>
          </div>

          {/* Datos de los Padres */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos de los Padres</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Padre:</p>
                <p style={styles.detailValue}>
                  {detalle?.idConfirmante?.padre?.nombre1 || detalle?.nombresPadre || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Madre:</p>
                <p style={styles.detailValue}>
                  {detalle?.idConfirmante?.madre?.nombre1 || detalle?.nombresMadre || "No disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Datos de los Padrinos */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Padrinos</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Padrino:</p>
                <p style={styles.detailValue}>
                  {detalle?.nombrespadrino || detalle?.idPadrino?.nombre1 || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Madrina:</p>
                <p style={styles.detailValue}>
                  {detalle?.nombresmadrina || detalle?.idMadrina?.nombre1 || "No disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Datos de la Ceremonia */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos de la Ceremonia</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Monseñor:</p>
                <p style={styles.detailValue}>{detalle?.monsenor || detalle?.idMonsr?.nombre || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Sacerdote:</p>
                <p style={styles.detailValue}>
                  {detalle?.nombresSacerdote || detalle?.idSacerdote?.nombre || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Doy Fe:</p>
                <p style={styles.detailValue}>{detalle?.nombresDoyFe || detalle?.idDoyfe?.nombre || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiCalendar style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Fecha de ceremonia:</p>
                <p style={styles.detailValue}>{detalle?.fecha || detalle?.idActa?.fecha || "No disponible"}</p>
              </div>
            </div>
          </div>

          {/* Nota Marginal */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Nota Marginal</h3>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailValue}>{detalle?.notas || detalle?.idActa?.notas || "No disponible"}</p>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (tipoLower === "matrimonio") {
      // Acceder de manera segura a los datos de los esposos
      const esposo = detalle?.personaB || {}
      const esposa = detalle?.personaA || {}

      return (
        <div style={styles.detailsGrid}>
          {/* Datos del Esposo */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos del Esposo</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Nombre completo:</p>
                <p style={styles.detailValue}>
                  {esposo?.nombre1 || ""} {esposo?.nombre2 || ""} {esposo?.apellido1 || ""} {esposo?.apellido2 || ""}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiCalendar style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Fecha de nacimiento:</p>
                <p style={styles.detailValue}>{esposo?.fechaNacimiento || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Lugar de nacimiento:</p>
                <p style={styles.detailValue}>{esposo?.lugarNacimiento || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Padre:</p>
                <p style={styles.detailValue}>{esposo?.padre?.nombre1 || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Madre:</p>
                <p style={styles.detailValue}>{esposo?.madre?.nombre1 || "No disponible"}</p>
              </div>
            </div>
          </div>

          {/* Datos de la Esposa */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos de la Esposa</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Nombre completo:</p>
                <p style={styles.detailValue}>
                  {esposa?.nombre1 || ""} {esposa?.nombre2 || ""} {esposa?.apellido1 || ""} {esposa?.apellido2 || ""}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiCalendar style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Fecha de nacimiento:</p>
                <p style={styles.detailValue}>{esposa?.fechaNacimiento || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Lugar de nacimiento:</p>
                <p style={styles.detailValue}>{esposa?.lugarNacimiento || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Padre:</p>
                <p style={styles.detailValue}>{esposa?.padre?.nombre1 || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Madre:</p>
                <p style={styles.detailValue}>{esposa?.madre?.nombre1 || "No disponible"}</p>
              </div>
            </div>
          </div>

          {/* Datos de los Testigos */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Testigos</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Primer Testigo:</p>
                <p style={styles.detailValue}>{detalle?.testigo1 || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Segundo Testigo:</p>
                <p style={styles.detailValue}>{detalle?.testigo2 || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Tercer Testigo:</p>
                <p style={styles.detailValue}>{detalle?.testigo3 || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Cuarto Testigo:</p>
                <p style={styles.detailValue}>{detalle?.testigo4 || "No disponible"}</p>
              </div>
            </div>
          </div>

          {/* Datos de la Ceremonia */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Datos de la Ceremonia</h3>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Sacerdote:</p>
                <p style={styles.detailValue}>
                  {detalle?.nombresSacerdote || detalle?.idSacerdote?.nombre || "No disponible"}
                </p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiUser style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Doy Fe:</p>
                <p style={styles.detailValue}>{detalle?.nombresDoyFe || detalle?.idDoyfe?.nombre || "No disponible"}</p>
              </div>
            </div>

            <div style={styles.detailItem}>
              <FiCalendar style={styles.detailIcon} />
              <div>
                <p style={styles.detailLabel}>Fecha de ceremonia:</p>
                <p style={styles.detailValue}>{detalle?.fecha || detalle?.idActa?.fecha || "No disponible"}</p>
              </div>
            </div>
          </div>

          {/* Nota Marginal */}
          <div style={styles.detailSection}>
            <h3 style={styles.sectionTitle}>Nota Marginal</h3>

            <div style={styles.detailItem}>
              <FiFileText style={styles.detailIcon} />
              <div>
                <p style={styles.detailValue}>{detalle?.notas || detalle?.idActa?.notas || "No disponible"}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  // SOLUCIÓN: Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Cargando acta...</p>
          {/* Incluir animación CSS global */}
          <style>{`
            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }`      
          }</style>
        </div>
      </div>
    )
  }

  // SOLUCIÓN: Mostrar error si hay algún problema
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Error: {error}</p>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <FaArrowLeft /> Volver
          </button>
        </div>
      </div>
    )
  }

  // SOLUCIÓN: Verificar que acta no sea null antes de renderizar
  if (!acta) {
    return (
      <div style={styles.container}>
        <div style={styles.notFoundContainer}>
          <p>No se encontró el acta solicitada</p>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <FaArrowLeft /> Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <HeaderAdmin title="Vista Detalle de Actas" />

      <main
        style={{
          ...styles.content,
          transition: "margin-left 0.3s ease-in-out",
          overflow: "auto",
          height: "calc(100vh - 70px)",
        }}
      >
        {/* Header con botones reorganizados */}
        <div style={styles.header}>
          {/* Botón Volver a la izquierda */}
          <div style={styles.leftActions}>
            <button onClick={() => navigate(-1)} style={styles.backButton} className="no-print">
              <FaArrowLeft /> Volver
            </button>
          </div>

          {/* Botones de acción a la derecha */}
          <div style={styles.rightActions} className="no-print">
            <button onClick={() => handleEditActa(acta.id, acta.tipo)} style={styles.editButton}>
              <FaEdit /> Editar
            </button>

            <button onClick={() => handlePrint("corto")} style={styles.printButton}>
              <FaPrint /> Imprimir Corto
            </button>

            <button onClick={() => handlePrint("largo")} style={styles.printButton}>
              <FaPrint /> Imprimir Largo
            </button>

            <button onClick={() => handleDownload("corto")} style={styles.downloadButton}>
              <FaDownload /> Descargar PDF Corto
            </button>

            <button onClick={() => handleDownload("largo")} style={styles.downloadButton}>
              <FaDownload /> Descargar PDF Largo
            </button>
          </div>
        </div>

        {/* Contenido principal para imprimir */}
        <div className="print-content">
          <h1 style={styles.title}>
            Acta de {capitalize(tipo)} - N° {acta?.numero || acta?.idActa?.numero || id}
          </h1>

          <div style={styles.subtitle}>
            Libro:  {detalle.idActa?.libro|| "N/A"} - Folio: {detalle.idActa?.folio || "N/A"} - Acta: {detalle.idActa?.numeroActa || "N/A"}
          </div>

          {/* Renderizar todos los detalles específicos */}
          {renderDetallesEspecificos()}
        </div>

        {/* Estilos para impresión */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-content, .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            @page {
              margin: 1cm;
              size: A4;
            }
          }
        `}</style>
      </main>
    </div>
  )
}

// Estilos
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto",
    cursor: "default",
  },
  content: {
    flex: 1,
    padding: "1.5rem 1rem",
    position: "relative",
    flexWrap: "wrap",
    overflowX: "auto",
    overflowY: "auto",
    transition: "margin-left 0.3s ease-in-out",
    backgroundColor: "#FFFFFF",
    height: "calc(100vh - 100px)",
    cursor: 'default',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e5e7eb",
  },
  leftActions: {
    display: "flex",
    alignItems: "center",
    marginTop: "-0.5rem",
  },
  rightActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "-0.5rem",
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  errorContainer: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '20px auto'
  },
  errorText: {
    color: '#b91c1c',
    fontSize: '16px'
  },
  notFoundContainer: {
    padding: '20px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '20px auto'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FF000F',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '-0.5rem',
    marginBottom: '0.5rem',
    justifyContent: 'flex-end',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  printButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  title: {
    fontSize: '1.7rem',
    color: '#000000',
    marginBottom: '1rem',
    textAlign: 'center',
    marginTop: '-0rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#000',
    fontWeight: '500',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  detailsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "0.5rem",
    cursor: "default",
  },
  detailsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '0.5rem',
    fontSize: "0.9rem",
    padding: "0rem 0.5rem",
  },
  detailSection: {
    flex: "1 1 calc(30% - 2rem)",
    backgroundColor: '#f9fafb',
    padding: "0rem 1rem",
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: "0.5px solid #000000",
    borderRadius: "0.5rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    color: '#385792',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e5e7eb'
  },
  detailItem: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    alignItems: 'flex-start'
  },
  detailIcon: {
    color: '#385792',
    fontSize: '1.3rem',
    marginTop: '-0.5rem',
  },
  detailLabel: {
    fontSize: "1.05rem",
    color: '#385792',
    fontWeight: '600',
    marginBottom: '-0.8rem',
    marginTop: '-0.5rem',
  },
  detailValue: {
    fontSize: "0.9rem",
    color: '#000000',
    fontWeight: '400',
    textTransform: "capitalize",
    marginBottom: '0.5rem',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
};