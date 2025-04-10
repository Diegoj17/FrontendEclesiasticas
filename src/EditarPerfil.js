import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { FaArrowLeft, FaUser, FaSave, FaExclamationCircle, FaCheck } from "react-icons/fa"
import logo from "./logo.png";

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
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const inputRef = useRef(null);
  const bubbleRef = useRef(null);

  const [message, setMessage] = useState({ text: "", type: "" });

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        password: user.password || "",
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
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      console.log("Enviando datos:", formData);
      const success = await updateUser(formData);

      if (success) {
        setMessage({
          text: "Perfil actualizado correctamente",
          type: "success",
        });
        setTimeout(() => {
          navigate("/principal");
        }, 2000);
      } else {
        setMessage({
          text: "Error al actualizar el perfil",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: "Error al actualizar el perfil",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/principal");
  };

  const validatePassword = (pass) => {
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

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
        </div>
        <div style={styles.card}>
          <div style={styles.header}>
            <button onClick={() => navigate("/principal")} style={styles.backButton}>
              <FaArrowLeft />
            </button>
            <h1 style={styles.title}>Editar Perfil</h1>
            <div style={styles.spacer}></div>
          </div>

          <div style={styles.subtitle}>Actualiza tu información personal</div>

          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              <FaUser size={40} color="#385792" />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.rowContainer}>
              <div style={{ ...styles.formGroup, flex: 1, marginRight: '10px' }}>
                <label htmlFor="name" style={styles.label}>Nombre</label>
                <input
                  type="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label htmlFor="email" style={styles.label}>Apellido</label>
                <input
                  type="lastname"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
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

            <div style={styles.passwordContainer}>
              <label htmlFor="password" style={styles.label}>Contraseña</label>
              <div style={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  type="password"
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
                  paddingRight: '35px'
                  }}
                  required
                />
                {errors.password && touched.password && (
                  <FaExclamationCircle
                    style={styles.errorIcon}
                      color="#E83F25"
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
                    "Guardando..."
                  </div>
                ) : (
                  <>
                    <FaSave style={styles.buttonIcon} />
                    Guardar Cambios
                  </>
                )}

                {/* Incluir animación CSS global */}
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </button>
            </div>
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
    marginTop: '-8rem',
    display: 'flex',
    justifyContent: 'center',
    cursor: 'default',
  },
  logo: {
    width: '200px',
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
    borderRadius: "0.7rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    padding: "30px",
    boxSizing: "border-box",
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
    margin: "0 auto",
    textAlign: "center",
    flex: 1,
  },
  spacer: {
    width: "24px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "80px",
    height: "80px",
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
    marginBottom: "5px",
    fontWeight: "600",
  },
  input: {
    justifyContent: "center",
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
    gap: "10px",
  },
  cancelButton: {
    flex: "1",
    padding: "1rem 1rem",
    backgroundColor: "#FCCE74",
    color: "#000000",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "550",
  },
  saveButton: {
    padding: "1rem 1rem",
    backgroundColor: "#FCCE74",
    color: "black",
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
    width: '220px',
    backgroundColor: '#FFCFB3',
    borderRadius: '8px',
    boxShadow: '0 2px 14px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e4e6eb',
    zIndex: 1000
  },
  bubbleArrow: {
    position: 'absolute',
    left: '-8px',
    top: '16px',
    width: '0',
    height: '0',
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderRight: '8px solid #FFCFB3',
    filter: 'drop-shadow(-2px 0 1px rgba(0, 0, 0, 0.05))'
  },
  rulesContainer: {
    padding: '20px'
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  ruleText: {
    fontSize: '14px',
    color: '#000000'
  },
  ruleIcon: {
    fontSize: '16px',
    color: '#1877f2',
    backgroundColor: '#FFCFB3',
  }
}

export default EditProfile

