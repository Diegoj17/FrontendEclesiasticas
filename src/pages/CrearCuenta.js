import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png"
import axios from 'axios';
import { FaExclamationCircle, FaCheck, FaUser, FaEye, FaEyeSlash  } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function CrearCuenta() {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [parroquia, setParroquia] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showRules, setShowRules] = useState(false);
  const inputRef = useRef(null);
  const bubbleRef = useRef(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [modal, setModal] = useState({
    show: false,
    type: 'success', // 'success' o 'error'
    message: ''
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setErrors((prev) => ({ ...prev, email: !isValid }));
    return isValid;
  };

  const validatePassword = (pass) => {
    const errors = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /\d/.test(pass),
      specialChar: /[\W_]/.test(pass),
    };

    const isValid = Object.values(errors).every((v) => v);
    setPasswordErrors(errors);
    setErrors((prev) => ({ ...prev, password: !isValid }));

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setTouched({ email: true, password: true });
      setIsLoading(true); // Desactivar carga si hay error
      return;
    }

    try {
      const response = await axios.post(
        "https://actaseclesiasticas.koyeb.app/api/auth/register",
        {
          email,
          password,
          nombre: name,
          apellido: lastname,
        }
      );

      setShowSuccessModal(true);
  
    } catch (error) {
      const errorMsg = error.response?.data?.error || "El correo ya existe, por favor intenta con otro.";
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
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

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setName("");
    setLastname("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
        </div>
        <div style={styles.card}>
          <h2 style={styles.title}>Crear Cuenta</h2>
          <p style={styles.description}>Ingresa los datos para crear la cuenta.</p>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              <FaUser style={styles.avatarIcon} />
            </div>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.rowContainer}>
              <div style={{...styles.formGroup, flex: 1, marginRight: '10px'}}>
                <label htmlFor="name" style={styles.label}>Nombre</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              <div style={{...styles.formGroup, flex: 1}}>
                <label htmlFor="email" style={styles.label}>Apellido</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) validateEmail(e.target.value);
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, email: true }));
                    validateEmail(email);
                  }}
                  style={{
                    ...styles.input,
                    borderColor: errors.email && touched.email ? '#e74c3c' : '#ddd',
                    paddingRight: '35px',
                  }}
                  required
                />
                {errors.email && touched.email && (
                  <FaExclamationCircle style={styles.errorIcon} color="#e74c3c" />
                )}
              </div>
            </div>

            <div style={styles.passwordContainer}>
              <label htmlFor="password" style={styles.label}>Contraseña</label>
              <div style={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                    
                  }}
                  onBlur={() => handleBlur('password')}
                  onFocus={() => setShowRules(true)}
                  style={{
                    ...styles.input,
                    borderColor: errors.password && touched.password ? '#E83F25' : '#ddd',
                    paddingRight: '2.5rem',
                  }}
                  required
                />
                {password.length > 0 && (
                    <div
                      style={styles.toggleIcon}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword
                        ? <FaEye  size={20} />
                        : <FaEyeSlash size={20} />
                      }
                    </div>
                  )}
                {errors.password && touched.password && (
                  <FaExclamationCircle style={styles.errorIcon} color="#E83F25" />
                )}
                {showRules && (
                  <div ref={bubbleRef} style={styles.rulesBubble}>
                    <div style={styles.bubbleArrow}></div>
                    <div style={styles.rulesContainer}>
                      {rules.map((rule) => (
                        <div key={rule.id} style={styles.ruleItem}>
                          <FaCheck
                            style={{
                              color: rule.valid ? '#00a400' : '#ffffff',
                              fontSize: '15px',
                            }}
                          />
                          <span style={styles.ruleText}>{rule.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div style={styles.passwordContainer}>
              <label htmlFor="password" style={styles.label}>Repetir Contraseña Nueva</label>
              <div style={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  name="password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);     
                  }}
                  onBlur={() => handleBlur('password')}
                  onFocus={() => setShowRules(true)}
                  style={{
                    ...styles.input,
                    borderColor: errors.password && touched.password ? '#E83F25' : '#ddd',
                    paddingRight: '2.5rem',
                  }}
                  required
                />
                {confirmPassword.length > 0 && (
                    <div
                      style={styles.toggleIcon}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword
                        ? <FaEye  size={20} />
                        : <FaEyeSlash size={20} />
                      }
                    </div>
                )}
                {confirmPassword && password !== confirmPassword && (
                  <span style={styles.errorText}>Las contraseñas no coinciden</span>
                )}
                {errors.password && touched.password && (
                  <FaExclamationCircle 
                    style={styles.errorIcon} 
                    color="#E83F25" />
                )}
                </div>
            </div>
            <div style={styles.buttonContainer}>
              <button type="button" style={styles.cancelButton} onClick={handleCancel}>
                Cancelar
              </button>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={isLoading}
                >
                {isLoading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}> </div>
              Creando...
            </div>
          ) : (
            "Crear Cuenta"
          )}
        </button>
        {/* Incluir animación CSS global */}
        <style>{`
                  @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                  }
      `       }</style>
      </div>
          </form>
        </div>
      </div>
      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Cuenta Creada Exitosamente</h3>
            <p>Tu cuenta ha sido creada correctamente.</p>
            <button style={styles.modalButton} onClick={closeModal}>
              Aceptar
            </button>
          </div>
        </div>
      )}

{/* Modal de Error corregido */}
{showErrorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>¡Error!</h3>
            <p style={styles.modalText}>{errorMessage}</p>
            <button
              style={styles.modalButtonError}
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
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#385792',
    boxSizing: 'border-box',
    padding: '20px 0 0 0',
    cursor: 'default',
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '-0.5rem',
    maxWidth: '25rem',
    width: '100%',
    gap: '0.5rem',
    cursor: 'default',
  },
  logoContainer: {
    marginBottom: '0rem',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'default',
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
    marginBottom: '0.5rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '0',
      marginBottom: '8px'
    }
  },
  card: {
    backgroundColor: 'white',
    padding: '25px 30px',
    borderRadius: '0.7rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    margin: '0 0 8px 0',
    textAlign: 'center',
    color: '#385792',
    marginTop: '-0.9rem',
  },
  description: {
    fontSize: '1rem',
    margin: '0 0 20px 0',
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#000000',
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: "-0.5rem",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: "100%",
  },
  formGroup: {
    marginBottom: '0.5rem',
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    display: 'block',
    textAlign: 'left',
    fontWeight: "600",
  },
  input: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    height: "2.5rem",
    width: "100%",
    padding: '0.75rem 0.5rem',
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  cancelButton: {
    flex: 1,
    padding: '1rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#FF0000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: "550",
    position: 'relative',
    transition: 'opacity 0.3s ease',
    transform: "none !important",
  },
  submitButton: {
    flex: 1,
    padding: '1rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#27548A',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: "550",
    transition: 'opacity 0.3s ease',
  },
  message: {
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: "0.5rem",
    justifyContent: "center",
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
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
  modalButton: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '0.8rem 2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  modalButtonError: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '10px 25px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '15px',
    '&:hover': {
      opacity: 0.9
    }
  },
  modalText: {
    color: '#666',
    margin: '15px 0'
  },
  passwordRequirements: {
    margin: '15px 0',
    padding: '10px',
    marginBottom: '0px',
    backgroundColor: '#FFB1B5',
    borderRadius: '5px',
  },
  requirementTitle: {
    fontSize: '0.9rem',
    color: '#555',
    padding: '0 0 5px 0',
    margin: 0,
    marginBottom: '5px',
  },
  requirementList: {
    listStyleType: 'none',
    paddingLeft: '15px',
    margin: 0,
    fontSize: '0.9rem',
    marginBottom: '5px',
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
    //border: '1px solid #e4e6eb',
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
    marginBottom: '0.5rem'
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
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    }
  },
  toggleIcon: {
  position: 'absolute',
  right: '2.2rem',
  top: '50%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#000000'       // color neutro; cambia si quieres otro
},
  
};

export default CrearCuenta;
