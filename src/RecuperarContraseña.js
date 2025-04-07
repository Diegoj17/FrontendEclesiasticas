import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "./logo.png";

function RecuperarContraseña() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica para enviar el correo de recuperación
    console.log('Correo electrónico:', email);
    alert('Se ha enviado un correo para recuperar tu contraseña.');
    navigate('/'); // Redirige al inicio de sesión después de enviar
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/login'); // Redirige al inicio de sesión al cancelar
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
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
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>
          <div style={styles.buttonContainer}>
            <button type="button" style={styles.cancelButton} onClick={handleCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
    {/* Modal de éxito */}
    {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Cuenta Creada Exitosamente</h3>
            <p>Tu cuenta ha sido creada correctamente.</p>
            <button
              style={styles.modalButton}
              onClick={closeModal}
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
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    width: '100%',
    gap: '20px',
  },
  logoContainer: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    width: '250px',
    height: 'auto',
    objectFit: 'contain',
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
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    display: 'block',
    textAlign: 'left',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem', // Espacio entre los botones
  },
  cancelButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#FCCE74',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1, // Ocupa el espacio disponible
  },
  submitButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#FCCE74',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1, // Ocupa el espacio disponible
  },
};

export default RecuperarContraseña;