import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import CommonRegistroSection from "../components/forms/CommonRegistroSection";
import CommonOficianteSection from "../components/forms/CommonOficianteSection";
import ConfirmacionOficianteSection from "../components/forms/ConfirmacionOficianteSection";
import BautismoForm from "../components/forms/BautismoForm";
import ConfirmacionForm from "../components/forms/ConfirmacionForm";
import MatrimonioForm from "../components/forms/MatrimonioForm";
import ActaService from "../services/ActaService";
import { FaArrowLeft, FaSave, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const initialFormData = {
  libro: "",
  folio: "",
  acta: "",
  oficiante: "",
  doyFe: "",
  notaMarginal: "",
  fechaCeremonia: { dia: "", mes: "", año: "" },
  bautismo: {
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    fechaNacimiento: { dia: "", mes: "", año: "" },
    lugarNacimiento: "",
    nombrePadre: "",
    nombreMadre: "",
    abueloPaterno: "",
    abuelaPaterna: "",
    abueloMaterno: "",
    abuelaMaterna: "",
    padrino: "",
    madrina: "",
  },
  confirmacion: {
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    fechaNacimiento: { dia: "", mes: "", año: "" },
    lugarNacimiento: "",
    fechaBautismo: { dia: "", mes: "", año: "" },
    lugarBautismo: "",
    nombrePadre: "",
    nombreMadre: "",
    padrino: "",
    madrina: "",
    monseñor: "",
  },
  matrimonio: {
    novio: {
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      fechaNacimiento: { dia: "", mes: "", año: "" },
      lugarNacimiento: "",
      nombrePadre: "",
      nombreMadre: "",
    },
    novia: {
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      fechaNacimiento: { dia: "", mes: "", año: "" },
      lugarNacimiento: "",
      nombrePadre: "",
      nombreMadre: "",
    },
    testigo1: "",
    testigo2: "",
    testigo3: "",
    testigo4: "",
  },
}

const normalizeTipo = (tipo) => tipo?.toString().toLowerCase().trim() || '';

function EditarActa() {
  const { id, tipo } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ciudadesColombia, setCiudadesColombia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(initialFormData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [acta, setActa] = useState(null);

  const [subActaId, setSubActaId] = useState(null);
  const [actaId, setActaId] = useState(null);


  const handleChange = (e) => {
    const { name, value, isComboBox } = e.target;
    if (isComboBox) {
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prev => {
        const next = { ...prev };
        let cursor = next;
        parts.slice(0, -1).forEach(key => {
          cursor[key] = { ...cursor[key] };
          cursor = cursor[key];
        });
        cursor[parts[parts.length - 1]] = value;
        return next;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const tipoNorm = normalizeTipo(tipo);
      console.log("🔄 Cargando acta tipo:", tipoNorm, "id:", id, subActaId, "subActaId:" , subActaId);
      try {
        let data;
        // Obtener datos según el tipo de acta
        switch (tipo.toLowerCase()) {
          case 'bautismo':
            data = await ActaService.getBautizoById(id);
            setActaId(data.idActa?.id);
            setSubActaId(data.idBautizado.id);
            break;
          case 'confirmacion':
            data = await ActaService.getConfirmacionById(id);
            setActaId(data.idActa?.id);
            setSubActaId(data.idConfirmante.id);
            break;
          case 'matrimonio':
            data = await ActaService.getMatrimonioById(id);
            setActaId(data.idActa?.id);
            setSubActaId(data.idActa?.id ?? "");

            break;
          default:
            throw new Error(`Tipo de acta no válido: ${tipo}`);
        }

        // Función para parsear fechas
        const parseFecha = (fecha) => {
          if (!fecha) return { dia: '', mes: '', año: '' };
          if (typeof fecha === 'object') return fecha;
          const [año, mes, dia] = fecha.split('-');
          return { dia: dia || '', mes: mes || '', año: año || '' };
        };

        // Base común para todos los tipos de acta
        const baseData = {
          libro: data.libro || data.idActa?.libro || '',
          folio: data.folio || data.idActa?.folio || '',
          acta: data.numeroActa || data.acta || data.idActa?.numeroActa || '',
          oficiante: data.nombresSacerdote || data.idSacerdote?.nombre || '',
          doyFe: data.nombresDoyFe || data.idDoyfe?.nombre || '',
          notaMarginal: data.notas || data.idActa?.notas || '',
          fechaCeremonia: parseFecha(data.fecha || data.idActa?.fecha),
        };

        // Datos específicos por tipo de acta
        let specificData = {};
        if (tipo.toLowerCase() === 'bautismo') {
          const bautizado = data.idBautizado || {};
          specificData = {
            bautismo: {
              primerNombre: bautizado.primerNombre || bautizado.nombre1 || data.primerNombre || '',
              segundoNombre: bautizado.segundoNombre || bautizado.nombre2 || data.segundoNombre || '',
              primerApellido: bautizado.primerApellido || bautizado.apellido1 || data.primerApellido || '',
              segundoApellido: bautizado.segundoApellido || bautizado.apellido2 || data.segundoApellido || '',
              fechaNacimiento: parseFecha(bautizado.fechaNacimiento),
              lugarNacimiento: bautizado.lugarNacimiento || '',
              nombrePadre: bautizado.padre?.nombre1 || data.nombresPadre || '',
              nombreMadre: bautizado.madre?.nombre1 || data.nombresMadre || '',
              abueloPaterno: data.abueloPaterno || '',
              abuelaPaterna: data.abuelaPaterna || '',
              abueloMaterno: data.abueloMaterno || '',
              abuelaMaterna: data.abuelaMaterna || '',
              padrino: data.nombrespadrino || data.idPadrino?.nombre1 || '',
              madrina: data.nombresmadrina || data.idMadrina?.nombre1 || '',
            }
          };
        } else if (tipo.toLowerCase() === 'confirmacion') {
          const confirmante = data.idConfirmante || {};
          specificData = {
            confirmacion: {
              primerNombre: confirmante.primerNombre || confirmante.nombre1 || data.primerNombre || '',
              segundoNombre: confirmante.segundoNombre || confirmante.nombre2 || data.segundoNombre || '',
              primerApellido: confirmante.primerApellido || confirmante.apellido1 || data.primerApellido || '',
              segundoApellido: confirmante.segundoApellido || confirmante.apellido2 || data.segundoApellido || '',
              fechaNacimiento: parseFecha(confirmante.fechaNacimiento || data.fechaNacimiento),
              lugarNacimiento: confirmante.lugarNacimiento || data.lugarNacimiento || '',
              fechaBautismo: parseFecha(data.fechaBautismo),
              lugarBautismo: data.lugarBautismo || '',
              nombrePadre: confirmante.padre?.nombre1 || data.nombresPadre || '',
              nombreMadre: confirmante.madre?.nombre1 || data.nombresMadre || '',
              padrino: data.nombrespadrino || data.idPadrino?.nombre1 || '',
              madrina: data.nombresmadrina || data.idMadrina?.nombre1 || '',
              monseñor: data.monsenor || data.idMonsr?.nombre || '',
              sacerdote: data.nombresSacerdote || data.idSacerdote?.nombre || "",
              doyFe: data.nombresDoyFe || data.idDoyfe?.nombre || "",
            }
          };
        } else if (tipo.toLowerCase() === 'matrimonio') {
          const personaA = data.personaA || {};
          const personaB = data.personaB || {};
          specificData = {
            matrimonio: {
              novio: {
                primerNombre: personaB.primerNombre || personaB.nombre1 || '',
                segundoNombre: personaB.segundoNombre || personaB.nombre2 || '',
                primerApellido: personaB.primerApellido || personaB.apellido1 || '',
                segundoApellido: personaB.segundoApellido || personaB.apellido2 || '',
                fechaNacimiento: parseFecha(personaB.fechaNacimiento),
                lugarNacimiento: personaB.lugarNacimiento || '',
                nombrePadre: personaB.padre?.nombre1 || '',
                nombreMadre: personaB.madre?.nombre1 || '',
              },
              novia: {
                primerNombre: personaA.primerNombre || personaA.nombre1 || '',
                segundoNombre: personaA.segundoNombre || personaA.nombre2 || '',
                primerApellido: personaA.primerApellido || personaA.apellido1 || '',
                segundoApellido: personaA.segundoApellido || personaA.apellido2 || '',
                fechaNacimiento: parseFecha(personaA.fechaNacimiento),
                lugarNacimiento: personaA.lugarNacimiento || '',
                nombrePadre: personaA.padre?.nombre1 || '',
                nombreMadre: personaA.madre?.nombre1 || '',
              },
              sacerdote: data.nombresSacerdote || data.idSacerdote?.nombre || '',
              doyFe: data.nombresDoyFe || data.idDoyfe?.nombre || '',
              testigo1: data.testigo1 || '',
              testigo2: data.testigo2 || '',
              testigo3: data.testigo3 || '',
              testigo4: data.testigo4 || '',
            }
          };
        }

        setFormData({ ...initialFormData, ...baseData, ...specificData });
      } catch (err) {
        console.error("Error al cargar datos del acta:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, tipo])

  useEffect(() => {
  if (subActaId) {
    console.log("Sub-acta ID:", subActaId);
    // lógica dependiente del ID...
  } else {
    console.warn("Aún no tengo el ID de la sub-acta");
  }
}, [subActaId]);


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!subActaId) {
      console.error("Aún no tengo el ID de la sub-acta");
      return;
    }
  setIsSubmitting(true);

  
  const rawActa = {
    ...formData,
    id: actaId,
    idSubActa: subActaId,
    tipo: tipo.toLowerCase(),
    
  };
    
  const payload = ActaService.convertirActaAFormatoPlano(rawActa);
  console.log("ID real enviado al backend:", payload.id); // Debe ser, por ejemplo, "1"

  console.log("Payload plano enviado:", payload);
  
  try {
    // Asegurar que los datos estén en el formato correcto
  
    await ActaService.updateActa(payload);
    
    setModalMessage("Los cambios se han guardado correctamente.");
    setShowSuccessModal(true);
    
    
  } catch (err) {
    console.error("Error al guardar acta:", err);
    setModalMessage(err.response?.data?.message || "Error al guardar los cambios");
    setShowErrorModal(true);
  } finally {
    setIsSubmitting(false);
  }
};

 // if (loading) return <div>Cargando acta...</div>;

  const handleBack = () => {
    navigate("/buscarActas");
  }

  return (
    <div style={styles.container}>
      <Header title={`Edición de Acta de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`} />
    
      <div style={styles.actionsBar}>
      <button onClick={handleBack} style={styles.backButton} title="Atrás">
          <FaArrowLeft style={styles.iconBack} />
          <span style={styles.buttonText}>Atrás</span>
      </button>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.topSections}>
          <CommonRegistroSection formData={formData} handleChange={handleChange} />
          {tipo === 'bautismo' && <CommonOficianteSection formData={formData} handleChange={handleChange} />}
          {tipo.startsWith('confirm') && <ConfirmacionOficianteSection formData={formData} handleChange={handleChange} />}
          {tipo === 'matrimonio' && <CommonOficianteSection formData={formData} handleChange={handleChange} />}

        </div>

        {tipo === 'bautismo' && <BautismoForm formData={formData} handleChange={handleChange} ciudadesColombia={ciudadesColombia} />}
        {tipo.startsWith('confirm') && <ConfirmacionForm formData={formData} handleChange={handleChange} ciudadesColombia={ciudadesColombia} />}
        {tipo === 'matrimonio' && <MatrimonioForm formData={formData} handleChange={handleChange} ciudadesColombia={ciudadesColombia} />}

        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Nota Marginal</h2>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <textarea
                    name="notaMarginal"
                    value={formData.notaMarginal}
                    onChange={handleChange}
                    style={styles.formNota}
                    placeholder="Escriba la nota marginal aquí..."
                />
              </div>
            </div>
        </div>

        <div style={styles.saveButtonContainer}>
        <button 
          type="submit" 
          style={styles.submitButton}
          disabled={isSubmitting}>
          <FaSave style={styles.buttonIcon} />
          <span style={styles.buttonText}>{isSubmitting ? "Guardando..." : "Guardar Acta"}</span>
        </button>
        </div>
      </form>

      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={{...styles.modalHeader, backgroundColor: "#4CAF50"}}>
              <h2 style={styles.modalTitle}>¡Éxito!</h2>
            </div>
            <div style={styles.modalBody}>
              <FaCheck style={{color: "#4CAF50", fontSize: "2rem", marginBottom: "1rem"}} />
              <p>{modalMessage}</p>
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(-1);
                }} 
                style={styles.confirmButton}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={{...styles.modalHeader, backgroundColor: "#F44336"}}>
              <h2 style={styles.modalTitle}>¡Error!</h2>
            </div>
            <div style={styles.modalBody}>
              <FaExclamationTriangle style={{color: "#F44336", fontSize: "2rem", marginBottom: "1rem"}} />
              <p>{modalMessage}</p>
            </div>
            <div style={styles.modalFooter}>
              <button 
                onClick={() => setShowErrorModal(false)} 
                style={{...styles.confirmButton, backgroundColor: "#F44336"}}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    
  );

}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto",
    cursor: "default",
  },
  form: {
    background: '#fff',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
  },
  topSections: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '0.5rem',
  },
  marginalSection: {
    margin: '1rem 0',
  },
  textarea: {
    width: '100%',
    minHeight: '5rem',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    padding: '0.5rem',
  },
  actionsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "0.5rem",
  },
  saveButtonContainer: {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginTop: "0rem",
  whiteSpace: "nowrap",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "0.5rem",
    backgroundColor: "#385792",
    cursor: "pointer",
    textAlign: "left",
    color: "white",
    transition: "background-color 0.2s",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    minHeight: "40px",
    marginTop: "0.5rem",
    marginLeft: "69.7rem",
    marginBottom: "0.5rem",
    opacity: 1,
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
  },
  buttonText: {
    fontSize: "1rem",
    flex: 1,
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF000F",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    marginTop: "1rem",
    marginLeft: "1rem",
    gap: "0.5rem",
    fontSize: "1rem",
    minWidth: "100px",
  },

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
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    padding: "0rem",
    marginBottom: "0.5rem",
    fontWeight: "700",
    color: "#385792",
    marginTop: "-0rem",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "0.5rem",
    width: "100%",
    textTransform: "capitalize",
  },
  formGroup: {
    flex: "1",
    minWidth: "300px",
    marginBottom: "0.5rem",
    textTransform: "capitalize",
  },
  formNota: {
    display: "block",
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ced4da",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    marginBottom: "10px",
    color: "#000000",
    fontWeight: "500",
    minHeight: "100px",
    maxHeight: "200px",
    overflowY: "auto",
    resize: "vertical",
    whiteSpace: "pre-wrap",
    verticalAlign: "top",
    textTransform: "capitalize",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "1rem",
    borderBottom: "1px solid #e0e0e0",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
  modalBody: {
    padding: "1.5rem",
    textAlign: "center",
  },
  modalFooter: {
    padding: "1rem",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontWeight: "600",
    minWidth: "100px",
  },
};

export default EditarActa;
