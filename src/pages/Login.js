import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { useAuth } from "../context/AuthContext"
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Principal")
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
        return;
      }
  
      // Guardar datos en contexto/auth
      login({
        email: response.data.email,
        displayName: response.data.displayName,
        token: response.data.idToken
      });
      
      navigate("/Principal");
    } catch (error) {
      setError(error.response?.data?.error || "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

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
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            {password.length > 0 && (
                <div
                  style={styles.toggleIcon}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setShowPassword(prev => !prev)}
            
                >
                {showPassword
                  ? <FaEye size={20} />
                  : <FaEyeSlash size={20} />
                }
                </div>
              )}
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
          "Ingresar"
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

        <p style={styles.forgotPassword} onClick={handleForgotPassword}>
          ¿Olvidaste tu contraseña?
        </p>

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
    gap: "6rem",
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
    borderRadius: '0.8rem',
    //boxShadow: '0 8px 8px ',
    width: '50%',
    maxWidth: '400px',
    minWidth: '500px',
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
    transition: "border-color 0.2s ease",
    outline: "none",
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
    marginTop: "1.5rem",
    position: "relative",
    transition: "background-color 0.2s ease",
    transform: "none !important",
  },
  icon: {
    width: "1rem",
    height: "1rem",
    fill: "white",
    marginRight: "0.3rem"
  },
  forgotPassword: {
    marginTop: '1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    color: '#27548A',
    cursor: 'pointer',
    textDecoration: 'underline',
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
  top: '70%',
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#000000'       
},

};

export default Login;
