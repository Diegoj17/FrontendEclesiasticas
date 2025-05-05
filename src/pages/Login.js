import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { useAuth } from "../context/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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
      {/* Logo en la parte izquierda */}
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
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
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
        <p style={styles.createAccountLink} onClick={handleCreateAccount}>
          Crear Cuenta
        </p>
        <p style={styles.forgotPassword} onClick={handleForgotPassword}>
          ¿Olvidaste tu contraseña?
        </p>
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
    display: "flex",
    width: "100%",
    height: 'auto',
    maxWidth: '800px ',
    objectFit: "contain",
    maxHeight: "80vh",
    marginRight: '150px',
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    backgroundColor: '#ffffff',
    padding: '3rem',
    marginLeft: '-80px',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
    fontSize: '2.5rem',
    marginBottom: '4rem',
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
    backgroundColor: "#FCCE74",
    color: "black",
    border: "none",
    cursor: "pointer",
    borderRadius: "0.5rem",
    marginTop: "20px",
    position: "relative",
    transition: "background-color 0.2s ease",
    transform: "none !important",
  },
  forgotPassword: {
    marginTop: '1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    color: '#007BFF',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  createAccountLink: {
    marginTop: '1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    color: '#007BFF',
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
  

};

export default Login;
