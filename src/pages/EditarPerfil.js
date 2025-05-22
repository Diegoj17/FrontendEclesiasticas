import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaArrowLeft, FaUser, FaSave, FaExclamationCircle, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa"
import logo from "../assets/logo.png"

function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const inputRef = useRef(null);
  const bubbleRef = useRef(null);

  const [modal, setModal] = useState({
      show: false,
      type: 'success', // 'success' o 'error'
      message: ''
  });
  

  const [message, setMessage] = useState({ text: "", type: "" });

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({}); // Limpiar errores previos

    setMessage({ text: "", type: "" })

    try {
    console.log("Enviando datos para actualizar:", {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
    });

    const success = await updateUser({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,  
    });

      if (success) {
        // Actualizar localStorage
        const updatedUser = {
            ...user,
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            displayName: `${formData.nombre} ${formData.apellido}`.trim(),
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage"));
        
        // Mostrar modal de éxito
        setModal({
          show:true,
          type: 'success',
          message: 'Perfil Actualizado Exitosamente'
        });

    } else {
        setModalMessage("Error al actualizar el perfil");
        setShowErrorModal(true);
    }
} catch (error) {
    console.error("Error:", error);
    setModalMessage(error.message || "Error al actualizar el perfil");
    setShowErrorModal(true);
} finally {
    setLoading(false);
}
};


  const validatePassword = (pass) => {

    if (pass === "") return true;
    const errors = {
      length: pass.length >= 6, // Cambiado a 6 caracteres
      uppercase: /[A-Z]/.test(pass),
      number: /\d/.test(pass),
      specialChar: /[!@#$%^&*]/.test(pass), // Caracteres específicos
    };

    const isValid = Object.values(errors).every((v) => v);
    setPasswordErrors(errors);
    setErrors((prev) => ({ ...prev, password: !isValid }));

    return isValid;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target)) {
        if (inputRef.current !== event.target) {
          setShowRules(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rules = [
    { id: 1, text: 'Mínimo 6 caracteres', valid: password.length >= 6 },
    { id: 2, text: 'Al menos una mayúscula', valid: /[A-Z]/.test(password) },
    { id: 3, text: 'Al menos un número', valid: /\d/.test(password) },
    { id: 4, text: 'Un carácter especial (!@#$%^&*)', valid: /[!@#$%^&*]/.test(password) },
  ];

  const closeSuccessModal = () => {
  const savedPath = sessionStorage.getItem("currentPath") || "/Principal";
  setModal(prev => ({...prev, show: false}));
  navigate(savedPath);
};

  const closeErrorModal = () => {
    const savedPath = sessionStorage.getItem("currentPath") || "/Principal";
    setModal(prev => ({...prev, show: false}));
    navigate(savedPath);
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
        </div>
        <div style={styles.card}>
          <div style={styles.header}>
            <button onClick={handleCancel} style={styles.backButton}>
              <FaArrowLeft style={styles.atras}/>
            </button>
            <h1 style={styles.title}>Editar Perfil</h1>
            <div style={styles.spacer}></div>
          </div>

          <div style={styles.subtitle}>Actualiza tu información personal</div>

          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              <FaUser style={styles.avatarIcon} />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.rowContainer}>
              <div style={{ ...styles.formGroup, flex: 1, marginRight: '10px' }}>
                <label htmlFor="nombre" style={styles.label}>Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label htmlFor="email" style={styles.label}>Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            
            <div style={styles.buttonContainer}>
              <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                Cancelar
              </button>
              <button
                type="submit"
                style={styles.saveButton}
                disabled={loading || Object.values(passwordErrors).some((v) => !v)}
              >
                {loading ? (
                  <div style={styles.loadingContent}>
                    <div style={styles.spinner}></div>
                    Guardando...
                  </div>
                ) : (
                  <>
                    <FaSave style={styles.buttonIcon} />
                    Guardar Cambios
                  </>
                )}
                </button>

                {/* Incluir animación CSS global */}
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
            </div>
          </form>
        </div>
      </div>

      {showSuccessModal && (
    <div style={styles.modalOverlay}>
        <div style={styles.modal}>
        <h3 style={{
              ...styles.modalTitle,
              color: modal.type === 'success' ? '#2ecc71' : '#e74c3c'
            }}>
              {modal.type === 'success' ? '¡Actualización Exitosa!' : 'Error'}
            </h3>

            <p style={styles.modalText}>{modal.message}</p>
          
            <button
              style={{
                ...styles.modalButton,
                backgroundColor: modal.type === 'success' ? '#2ecc71' : '#e74c3c'
              }}
                onClick={closeSuccessModal}
            >
                Aceptar
            </button>
        </div>
    </div>
)}

{showErrorModal && (
    <div style={styles.modalOverlay}>
        <div style={styles.modal}>
        <h3 style={{
              ...styles.modalTitle,
              color: modal.type === 'success' ? '#2ecc71' : '#e74c3c'
            }}>
              {modal.type === 'success' ? '¡Actualización Exitosa!' : 'Error'}
            </h3>

            <p style={styles.modalText}>{modal.message}</p>

            <button
                style={{...styles.modalButton, backgroundColor: '#e74c3c'}}
                onClick={closeErrorModal}
            >
                Cerrar
            </button>
        </div>
    </div>
)}

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#385792",
    padding: '20px 0 0 0',
    margin: '0 auto',
    cursor: 'default',
    flexWrap: "wrap",
    overflow: "auto",
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    width: '100%',
    gap: '15px',
    cursor: 'default',
  },
  logoContainer: {
    marginBottom: '0rem',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'default',
    marginTop: '-15rem',
    flexWrap: "wrap",
  },
  logo: {
    width: '12.5rem',
    height: 'auto',
    objectFit: 'contain',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  rowContainer: {
    display: 'flex',
    gap: '0rem',
    marginBottom: '0rem',
    flexWrap: "wrap",
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '0',
      marginBottom: '8px'
    }
  },
  card: {
    backgroundColor: "white",
    padding: '25px 30px',
    borderRadius: "0.7rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
    flexWrap: "wrap",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#385792",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0  0 4.5rem",
    color: "#385792",
    //marginTop: '-2.3rem',
  },
  spacer: {
    width: "24px",
  },
  subtitle: {
    textAlign: "center",
    color: "#000000",
    marginBottom: "0.5rem",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0.5rem",
  },
  avatarIcon: {
    color: "#385792",
    alignItems: "center",
    width: "2rem",
    height: "2rem",
  },
  avatar: {
    width: "4rem",
    height: "4rem",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #385792",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: "100%",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  label: {
    fontSize: "1rem",
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },
  input: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    height: "40px",
    width: "100%",
    marginBottom: "-1rem",
    padding: '0.75rem 1rem',
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "0.25rem",
    boxSizing: "border-box",
    outline: 'none',
    '&:focus': {
      borderColor: '#1877f2',
      boxShadow: '0 0 0 2px #e7f3ff'
    }
  },
  message: {
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    gap: "0.5rem",
  },
  cancelButton: {
    flex: "1",
    padding: "1rem 1rem",
    backgroundColor: "#CD1818",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "550",
  },
  saveButton: {
    padding: "1rem 1rem",
    backgroundColor: "#27548A",
    color: "white",
    border: "none",
    borderRadius: '5px',
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "550",
    display: "flex",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: "8px",
  },
  atras:{
    display: 'flex',
    alignItems: 'center',
    gap: '5rem',
    margin: '0 0  0 -1rem',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#385792',
  },
  passwordRequirements: {
    margin: '10px 0',
    padding: '15px',
    backgroundColor: '#FFCFB3',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  requirement: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '5px 0',
    fontSize: '14px'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    display: 'inline-block'
  },
  errorIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem'
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '0.8rem',
    marginTop: '5px',
    display: 'block'
  },

  passwordContainer: {
    position: 'relative',
    marginBottom: '20px',
    width: '100%'
  },
  rulesBubble: {
    position: 'absolute',
    left: '100%',
    top: '0',
    marginLeft: '30px',
    width: '275px',
    backgroundColor: '#FF0000',
    borderRadius: '8px',
    boxShadow: '0 2px 14px rgba(0, 0, 0, 0.1)',
    //border: '1px solid rgb(0, 0, 0)',
    zIndex: 1000
  },
  bubbleArrow: {
    position: 'absolute',
    left: '-1rem',
    top: '0.8rem',
    width: '1rem',
    height: '1rem',
    color: '#FF0000',
    borderTop: '0.5rem solid transparent',
    borderBottom: '0.5rem solid transparent',
    borderRight: '1rem solid #FF0000',
    filter: 'drop-shadow(-2px 0 1px rgba(0, 0, 0, 0.05))'
  },
  rulesContainer: {
    padding: '20px'
    
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '0.5rem',
    
  },
  ruleText: {
    fontSize: '14px',
    color: '#ffffff'
  },
  ruleIcon: {
    fontSize: '16px',
    color: '#1877f2',
    backgroundColor: '#FFCFB3',
  },
  loadingContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    justifyContent: "center",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
  },
  modalTitle: {
    color: '#2ecc71',
    marginBottom: '1rem',
  },
  modalText: {
    marginBottom: '1.5rem',
    color: '#555',
  },
  modalButton: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '0.8rem 2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  toggleIcon: {
  position: 'absolute',
  right: '2.2rem',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#000000'       
},

}

export default EditProfile
