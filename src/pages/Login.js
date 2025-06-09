import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { useAuth } from "../context/AuthContext"
import { FaEye, FaEyeSlash, FaRegEnvelope } from "react-icons/fa";
import { LuLock } from "react-icons/lu";
import { CgEnter } from "react-icons/cg";

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inputRef = useRef(null)

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Principal"); // Cambia a la ruta que desees
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        'https://actaseclesiasticas.koyeb.app/api/auth/login',
        { email, password }
      );
      
      if (response.data.error) {
        setError(response.data.error);
        setIsLoading(false);
        return;
      }
  
      // Guardar datos en contexto/auth
      login({
        email: response.data.email,
        displayName: response.data.displayName,
        token: response.data.idToken,
        rol: response.data.rol
      });
      
      navigate("/admin/dashboard");
    } catch (err) {
      // Si la respuesta del servidor existe, verificamos el código HTTP
      if (err.response) {
        const status = err.response.status;
        const serverError = err.response.data?.error;

        if (status === 401) {
          // 401 → credenciales incorrectas
          setError("Contraseña incorrecta");
        } else if (serverError) {
          // Cualquier otro mensaje de error proveniente del backend
          setError(serverError);
        } else {
          // Fallback general
          setError("Error desconocido");
        }
      } else {
        // No hubo respuesta (problema de red, etc.)
        setError("Error de conexión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    // Guarda la posición actual del cursor
    const { selectionStart, selectionEnd } = inputRef.current
    setShowPassword(prev => !prev)
    // Restaura la posición después del render
    setTimeout(() => {
      inputRef.current.setSelectionRange(selectionStart, selectionEnd)
    }, 0)
  }

  const handleForgotPassword = () => {
    navigate("/recuperarContraseña") // Redirige a la interfaz de recuperación de contraseña
  }

  const handleCreateAccount = () => {
    navigate('/crearCuenta'); // Redirige a la interfaz de creación de cuenta
  };


  return (

    <div style={styles.container}>
      {/* Contenedor principal flexible */}
      <div style={styles.contentWrapper}>
        {/* Logo */}
      <div style={styles.logoContainer}>
        <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
      </div>

      {/* Formulario de inicio de sesión (cuadro blanco) */}
      <div style={styles.loginContainer}>
        <h2 style={styles.title}>Inicio de Sesión</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Correo Electrónico
            </label>
            <div style={styles.inputContainer}>
            <FaRegEnvelope  style={styles.inputIcon} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Contraseña
            </label>
            <div style={styles.inputContainer}>
            <LuLock style={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              required
              ref={inputRef}
            />
            {password.length > 0 && (
                <div
                  style={styles.toggleIcon}
                  onMouseDown={e => e.preventDefault()}
                  onClick={togglePasswordVisibility}
            
                >
                {showPassword
                  ? <FaEye size={20} />
                  : <FaEyeSlash size={20} />
                }
                </div>
              )}
          </div>
          </div>
          

          <button
            type="submit"
            style={styles.button}
            disabled={isLoading}
            >
            {isLoading ? (
            <div style={styles.loadingContent}>
            {/* Spinner animado */}
            <div style={styles.spinner}></div>
            Ingresando...
          </div>
        ) : (
        <div style={styles.buttonContent}>
          <CgEnter style={styles.enterIcon} />
          <span>Ingresar</span>
      </div>
        )}
      </button>
      {error && <div style={styles.error}>{error}</div>}
      
      {/* Incluir animación CSS global */}
      <style>{`
          @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
          }
      `       }</style>
      <style>{`
            @keyframes gradientAnimation {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
        </form>

        <p style={{
          ...styles.forgotPassword,
          textDecoration: isHovered ? 'underline' : 'none'
        }} 
          onClick={handleForgotPassword}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          ¿Olvidaste tu contraseña?
        </p>

        

        <div style={styles.divider}></div>

        <div style={styles.buttonContainer}>
        <button
        type="submit" 
        onClick={handleCreateAccount} style={styles.createAccount} title="Crear cuenta nueva">
          <span style={styles.buttonText}>Crear cuenta nueva</span>
      </button>
      </div>
      </div>
    </div>
  </div>
  )
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    overflow: "auto",
    position: "relative",
    backgroundColor: "#385792",
    width: "100%",
    cursor: 'default',
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "10rem",
    maxWidth: "1200px",
    width: "100%",
    flexWrap: "wrap", // Permite que los elementos se apilen en pantallas pequeñas
  },
  logoContainer: {
    marginRight: '5px',
    marginLeft: '-50px',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "50%",
  },
  logo: {
    width: "100%",
    height: "auto",
    maxWidth: "100%",
    objectFit: "contain",
    marginRight: "6rem",
  },
  loginContainer: {
    backgroundColor: '#ffffff',
    padding: '3rem',
    marginLeft: '-80px',
    borderRadius: '0.7rem',
    //boxShadow: '0 8px 8px ',
    width: '50%',
    maxWidth: '30rem',
    minWidth: '30rem',
    height: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
    marginBottom: '2rem',
    marginTop: '-1rem',
    fontWeight: "700",
    position: "relative",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    position: "relative",
  },
  formGroup: {
    marginBottom: '1rem',
    position: "relative",
  },
  label: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    display: "block",
    position: "relative",
  },
  input: {
    padding: "1rem",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "0.5rem",
    position: "relative",
    transition: "border-color 0.2s opacity 0.1s ease",
    outline: "none",
    paddingLeft: '40px',
  },
  button: {
    padding: "0.75rem",
    fontSize: "25px",
   // backgroundColor: "#F9E400",
    color: "black",
    border: "none",
    cursor: "pointer",
    borderRadius: "0.5rem",
    marginTop: "20px",
    position: "relative",
    transition: "background-color 0.2s ease",
    transform: "none !important",
    backgroundImage: "radial-gradient(#F6C90E, #F6C90E)"
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',

  },
  createAccount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#27548A",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "0.5rem",
    marginTop: "1rem",
    position: "relative",
    transition: "background-color 0.2s ease",
    transform: "none !important",
    marginBottom: "-1rem",
  },
  icon: {
    width: "1rem",
    height: "1rem",
    fill: "white",
    marginRight: "0.3rem"
  },
  forgotPassword: {
    marginTop: '1.1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    color: '#27548A',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
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
  error: {
    color: "#ff4444",
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
  },
  // Agregar animación CSS-in-JS
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  "@keyframes gradientAnimation": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  toggleIcon: {
    position: 'absolute',
    right: '1rem',
    top: '55%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#000000'       
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#000000',
    fontSize: '1.1rem',
    zIndex: 1,
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  enterIcon: {
    fontSize: '1.2rem',
  },
  divider: {
    width: '100%',
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '0.5rem 0',
  },

};

export default Login;
