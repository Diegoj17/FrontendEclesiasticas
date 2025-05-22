import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash, FaCheck, FaArrowLeft, FaKey, FaExclamationCircle,FaSave } from "react-icons/fa";
import logo from "../assets/logo.png";

function CambiarContraseña() {
  const navigate = useNavigate();
  const { updatedUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const [modal, setModal] = useState({
    show: false,
    type: 'success', // 'success' o 'error'
    message: ''
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const inputRef = useRef(null);
  const bubbleRef = useRef(null);
  const [showRules, setShowRules] = useState(false);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validaciones
    if (!validatePassword(formData.newPassword)) {
      setErrors(prev => ({ ...prev, newPassword: "La nueva contraseña no cumple los requisitos" }));
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
      setLoading(false);
      return;
    }

    try {
      await updatedUser({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      const savedPath = sessionStorage.getItem("currentPath") || "/Principal";
      navigate(savedPath);
    } catch (error) {
      setErrors(prev => ({ ...prev, general: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const rules = [
    { id: 1, text: 'Mínimo 6 caracteres', valid: formData.newPassword.length >= 6 },
    { id: 2, text: 'Al menos una mayúscula', valid: /[A-Z]/.test(formData.newPassword) },
    { id: 3, text: 'Al menos un número', valid: /\d/.test(formData.newPassword) },
    { id: 4, text: 'Un carácter especial (!@#$%^&*)', valid: /[!@#$%^&*]/.test(formData.newPassword) },
  ];

  const closeSuccessModal = () => {
  const savedPath = sessionStorage.getItem("currentPath") || "/Principal";
  setModal(prev => ({ ...prev, show: false }));
  navigate(savedPath);
};

  const closeErrorModal = () => {
    const savedPath = sessionStorage.getItem("currentPath") || "/Principal";
  setModal(prev => ({ ...prev, show: false }));
  navigate(savedPath);
  };

  const handleCancel = () => {
  const savedPath = sessionStorage.getItem("currentPath") || "/Principal";
  navigate(savedPath);
};

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>

        <div style={styles.card}>
          <div style={styles.header}>
            <button onClick={handleCancel} style={styles.backButton}>
              <FaArrowLeft style={styles.atras}/>
            </button>
            <h1 style={styles.title}>Cambiar Contraseña</h1>
            <div style={styles.spacer}></div>
          </div>

          <div style={styles.subtitle}>Actualiza tu contraseña de acceso</div>

          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              <FaKey style={styles.avatarIcon} />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Contraseña Actual */}
            <div style={styles.passwordContainer}>
              <label htmlFor="currentPassword" style={styles.label}>Actual Contraseña</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => 
                    setFormData({ ...formData, currentPassword: e.target.value })}
                  style={styles.input}
                  required
                />
                {formData.currentPassword && (
                  <div
                    style={styles.toggleIcon1}
                    onClick={() => setShowPassword(prev => ({
                      ...prev,
                      current: !prev.current
                    }))}
                  >
                {showPassword.current
                  ? <FaEye size={20} />
                  : <FaEyeSlash size={20} />
                }
                </div>
                )}
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div style={styles.passwordContainer}>
              <label style={styles.label}>Nueva Contraseña</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, newPassword: e.target.value });
                    validatePassword(e.target.value);
                  }}
                  onBlur={() => {
                      handleBlur('password');
                      setShowRules(false);
                  }}
                  onFocus={() => setShowRules(true)}
                  style={{
                    ...styles.input,
                    borderColor: errors.password && touched.password ? '#FF0000' : '#ddd',
                    paddingRight: '2.5rem',
                  }}
                  required
                />
                {formData.newPassword && (
                  <div
                    style={styles.toggleIcon}
                    onClick={() => setShowPassword(prev => ({
                      ...prev,
                      new: !prev.new
                    }))}
                  >
                    {showPassword.new
                      ? <FaEye size={20} />
                      : <FaEyeSlash size={20} />
                    }
                  </div>
                )}
                {errors.password && touched.password && (
                  <FaExclamationCircle
                    style={styles.errorIcon}
                  />
                )}

                {showRules && (
                  <div ref={bubbleRef} style={styles.rulesBubble}>
                    <div style={styles.bubbleArrow}></div>
                    <div style={styles.rulesContainer}>
                      {rules.map((rule) => (
                        <div key={rule.id} style={styles.ruleItem}>
                          <FaCheck
                            style={{
                              color: rule.valid ? "#00a400" : "#ffffff",
                              fontSize: "1rem",
                            }}
                          />
                          <span style={styles.ruleText}>{rule.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {errors.newPassword && <span style={styles.errorText}>{errors.newPassword}</span>}
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div style={styles.passwordContainer}>
              <label htmlFor="confirmPassword" style={styles.label}>Repetir Nueva Contraseña</label>
              <div style={styles.inputWrapper}>
                <input
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validatePassword(e.target.value);
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }}
                  onBlur={() => handleBlur('newPassword')}
                  style={{
                    ...styles.input,
                    borderColor: errors.password && touched.password ? '#E83F25' : '#ddd',
                    paddingRight: '2.5rem'
                  }}
                  required
                />
                {formData.confirmPassword && (
                  <div
                    style={styles.toggleIcon}
                    onClick={() => setShowPassword(prev => ({
                      ...prev,
                      confirm: !prev.confirm
                    }))}
                  >
                    {showPassword.confirm
                      ? <FaEye size={20} />
                      : <FaEyeSlash size={20} />
                    }
                  </div>
                )}
                </div>
                <div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <span style={styles.errorText}>Las contraseñas no coinciden</span>
                )}
                </div>
                {errors.password && touched.password && (
                  <FaExclamationCircle
                    style={styles.errorIcon1}
                  />
                )}
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
                    style={{ ...styles.modalButton, backgroundColor: '#e74c3c' }}
                    onClick={closeErrorModal}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
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
    color: "#385792",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: '0.5rem',
    marginTop: '-2.3rem',
    
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
    width: "3.5rem",
    height: "3.5rem",
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
    marginBottom: "-1rem",
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    height: "40px",
    width: "100%",
    padding: '0.75rem',
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
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
    gap: "1rem",
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: '0.5rem',
    width: '100%'
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
    display: 'inline-block',
    marginBottom: "0.8rem",
    
  },
  errorIcon: {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: "#FF0000",
    fontSize: '1.2rem'
  },
  errorIcon1: {
    position: 'absolute',
    right: '0.5rem',
    top: '2.9rem',
    transform: 'translateY(-50%)',
    color: "#FF0000",
    fontSize: '1.2rem'
  },
  errorText: {
    color: '#FF0000',
    fontSize: '0.8rem',
    marginBottom: "-0.8rem",
    marginTop: '0.5rem',
    display: 'block',
  },
  rulesBubble: {
    position: 'absolute',
    left: '100%',
    top: '0',
    marginLeft: '30px',
    width: '275px',
    backgroundColor: '#CD1818',
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
    color: '#CD1818',
    borderTop: '0.5rem solid transparent',
    borderBottom: '0.5rem solid transparent',
    borderRight: '1rem solid #CD1818',
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
  right: '2rem',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#000000'       
  },
  toggleIcon1: {
  position: 'absolute',
  right: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#000000'       
  },
};

export default CambiarContraseña;