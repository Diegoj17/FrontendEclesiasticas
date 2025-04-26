import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "./logo.png";
import axios from 'axios';
import { FaKey } from 'react-icons/fa';

function RecuperarContraseña() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  const navigate = useNavigate();

  const [modal, setModal] = useState({
    show: false,
    type: 'success', // 'success' o 'error'
    message: ''
  });

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    
    try {
      const response = await axios.post(
        "http://eclesiasticasbackend-production.up.railway.app/api/auth/reset-password",
        { email },
        { cancelToken: source.token }
      );
      
      // Modal de éxito
      setModal({
        show: true,
        type: 'success',
        message: 'Correo enviado exitosamente'
      });
      
    } catch (error) {
      if (!axios.isCancel(error)) {
        setError(error.response?.data?.error || "Error al enviar el correo");
      }
    } finally {
      setCancelTokenSource(null);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operación cancelada por el usuario');
      setCancelTokenSource(null);
      setIsLoading(true);
    }
    navigate('/login');
  };


  const handleCloseModal = () => {
    setModal(prev => ({...prev, show: false}));
    navigate('/login'); // Redirige siempre al cerrar modal
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        {/* Logo positioned outside and above the white card */}
        <div style={styles.logoContainer}>
          <img src={logo || "/placeholder.svg"} alt="Logo" style={styles.logo} />
        </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Recuperar Contraseña</h2>
        <p style={styles.description}>
          Por favor, ingresa tu correo electrónico para recuperar tu contraseña.
        </p>
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        
        <div style={styles.avatarContainer}>
                              <div style={styles.avatar}>
                                <FaKey size={40} color="#385792" />
                              </div>
                            </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if(submitted) setEmailError("");
              }}
              onBlur={() => !email && setEmailError("Ingrese el Correo electrónico")}
              style={{
                ...styles.input,
                borderColor: emailError ? "#e74c3c" : "#ddd"
              }}
              required
            />
            {emailError && (
              <div style={styles.errorText}>
                {emailError}
              </div>
            )}
          </div>
          <div style={{...styles.buttonContainer}}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancelar
              </button>
            <button
                type="submit"
                style={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div style={styles.loadingContent}>
                    <div style={styles.spinner}></div>
                    Enviando...
                  </div>
                ) : "Enviar"}
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
     {/* Modal unificado */}
    {modal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{
              ...styles.modalTitle,
              color: modal.type === 'success' ? '#2ecc71' : '#e74c3c'
            }}>
              {modal.type === 'success' ? '¡Éxito!' : '¡Error!'}
            </h3>
            
            <p style={styles.modalText}>{modal.message}</p>
            
            <button
              style={{
                ...styles.modalButton,
                backgroundColor: modal.type === 'success' ? '#2ecc71' : '#e74c3c'
              }}
              onClick={handleCloseModal}
            >
              Aceptar
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
    height: '100vh',
    backgroundColor: '#385792',
    padding: '20px',
    boxSizing: 'border-box',
    paddingTop: '40px',
    cursor: 'default',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    width: '100%',
    gap: '20px',
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
    width: '200px',
    height: 'auto',
    objectFit: 'contain',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1.5rem',
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
    width: "100%",
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
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
    padding: '0.75rem',
    fontSize: '1rem',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    outline: 'none',
    '&:focus': {
      borderColor: '#1877f2',
      boxShadow: '0 0 0 2px #e7f3ff'
    }
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  cancelButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#FCCE74',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    transition: 'opacity 0.3s ease',
    fontWeight: "550",
  },
  submitButton: {
    padding: '1rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#FCCE74',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    fontWeight: "550",
    transition: 'opacity 0.3s ease',
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
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    }
  },
  
};

<style>
  {`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
</style>

export default RecuperarContraseña;