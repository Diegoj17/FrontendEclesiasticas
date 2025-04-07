import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "./logo.png" // Asegúrate de que la ruta del logo sea correcta
import { useAuth } from "./AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Principal")
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    // Aquí puedes manejar la lógica de inicio de sesión
    console.log("Email:", email)
    console.log("Password:", password)

    // Crear datos del usuario para la autenticación
    const userData = {
      name: "Nombre Usuario",
      role: "Rol",
      email: email,
    }

    // Guardar la sesión en el contexto de autenticación
    login(userData)

    // Redirigir a la interfaz principal
    navigate("/Principal")
  }

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
        <h2 style={styles.title}>Inicio de sesión</h2>
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

          <button type="submit" style={styles.button}>
            Ingresar
          </button>
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
    backgroundColor: "#385792",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    overflow: "auto",
    position: "relative",
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
    width: "100%",
    height: 'auto',
    maxWidth: '900px ',
    objectFit: "contain",
    maxHeight: "80vh",
    marginRight: '150px',
  },
  loginContainer: {
    backgroundColor: 'white',
    padding: '3rem',
    marginLeft: '-80px',
    borderRadius: '1.5rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
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
    position: "reative",
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

};

export default Login;